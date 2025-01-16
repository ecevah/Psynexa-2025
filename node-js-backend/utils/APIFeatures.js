const { Op } = require("sequelize");

class APIFeatures {
  constructor(model, queryParams) {
    this.model = model;
    this.queryParams = queryParams;
    this.queryOptions = {
      where: {},
      order: [],
      attributes: {},
      limit: 10,
      offset: 0,
    };
  }

  filter() {
    const queryObj = { ...this.queryParams };
    const excludedFields = ["page", "sort", "limit", "fields", "search"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Gelişmiş filtreleme için operatörleri dönüştür
    Object.keys(queryObj).forEach((key) => {
      const value = queryObj[key];
      if (typeof value === "object") {
        Object.keys(value).forEach((operator) => {
          const sequelizeOp = this._convertOperator(operator);
          if (sequelizeOp) {
            this.queryOptions.where[key] = {
              ...this.queryOptions.where[key],
              [sequelizeOp]: value[operator],
            };
          }
        });
      } else {
        this.queryOptions.where[key] = value;
      }
    });

    return this;
  }

  search() {
    if (this.queryParams.search) {
      const searchFields = ["name", "surname", "email", "username"];
      const searchQuery = {
        [Op.or]: searchFields.map((field) => ({
          [field]: { [Op.iLike]: `%${this.queryParams.search}%` },
        })),
      };
      this.queryOptions.where = {
        ...this.queryOptions.where,
        ...searchQuery,
      };
    }
    return this;
  }

  sort() {
    if (this.queryParams.sort) {
      const sortFields = this.queryParams.sort.split(",");
      this.queryOptions.order = sortFields.map((field) => {
        const isDesc = field.startsWith("-");
        const cleanField = isDesc ? field.substring(1) : field;
        return [cleanField, isDesc ? "DESC" : "ASC"];
      });
    } else {
      this.queryOptions.order = [["created_at", "DESC"]];
    }
    return this;
  }

  limitFields() {
    if (this.queryParams.fields) {
      const fields = this.queryParams.fields.split(",");
      this.queryOptions.attributes = fields;
    }
    return this;
  }

  paginate() {
    const page = parseInt(this.queryParams.page, 10) || 1;
    const limit = parseInt(this.queryParams.limit, 10) || 10;
    const offset = (page - 1) * limit;

    this.queryOptions.limit = limit;
    this.queryOptions.offset = offset;
    this.page = page;

    return this;
  }

  async execute() {
    try {
      const results = await this.model.findAndCountAll(this.queryOptions);

      const totalPages = Math.ceil(results.count / this.queryOptions.limit);

      return {
        success: true,
        count: results.rows.length,
        total: results.count,
        totalPages,
        currentPage: this.page || 1,
        data: results.rows,
      };
    } catch (error) {
      throw new Error(`Veri getirme hatası: ${error.message}`);
    }
  }

  _convertOperator(operator) {
    const operatorMap = {
      gt: Op.gt,
      gte: Op.gte,
      lt: Op.lt,
      lte: Op.lte,
      in: Op.in,
      ne: Op.ne,
      like: Op.like,
      iLike: Op.iLike,
    };
    return operatorMap[operator];
  }
}

module.exports = APIFeatures;
