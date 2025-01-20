const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Staff, Restrictions } = require("../models");
const { Op } = require("sequelize");
const logger = require("../config/logger");
const tokenService = require("../services/tokenService");

/**
 * @swagger
 * tags:
 *   name: Staff Authentication
 *   description: Staff authentication endpoints
 */

class StaffAuthController {
  /**
   * Register a new staff member
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async register(req, res) {
    try {
      const {
        name,
        surname,
        email,
        password,
        date_of_birth,
        identity_number,
        phone,
        address,
        restrictions_id,
      } = req.body;

      const existingStaff = await Staff.findOne({
        where: {
          [Op.or]: [{ email }],
        },
      });

      if (existingStaff) {
        return res.status(400).json({
          status: false,
          message: "Bu email ile kayıtlı bir personel zaten var",
          data: null,
        });
      }

      const restriction = await Restrictions.findByPk(restrictions_id);
      if (!restriction) {
        return res.status(400).json({
          status: false,
          message: "Geçersiz yetki grubu",
          data: null,
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Staff bilgilerini req.staff'dan al
      const createdBy = req.staff?.id;
      const createdType = req.staff?.id ? "staff" : "system";

      const staff = await Staff.create({
        name,
        surname,
        email,
        password: hashedPassword,
        date_of_birth,
        identity_number,
        phone,
        address,
        restrictions_id,
        status: true,
        created_by: createdBy,
        created_type: createdType,
        updated_by: createdBy,
      });

      const result = staff.toJSON();
      delete result.password;

      logger.info(`Yeni personel kaydı oluşturuldu: ${staff.email}`);
      res.status(201).json({
        status: true,
        message: "Personel kaydı başarıyla oluşturuldu",
        data: result,
      });
    } catch (error) {
      logger.error(`Personel kayıt hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Personel kaydı sırasında bir hata oluştu",
        data: null,
      });
    }
  }

  /**
   * Login staff member
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const staff = await Staff.findOne({
        where: { email },
        include: [
          {
            model: Restrictions,
            as: "restrictions",
            attributes: ["id", "name", "permissions", "is_active"],
          },
        ],
      });

      if (!staff) {
        return res.status(401).json({
          status: false,
          message: "Geçersiz email veya şifre",
        });
      }

      const isMatch = await bcrypt.compare(password, staff.password);
      if (!isMatch) {
        return res.status(401).json({
          status: false,
          message: "Geçersiz email veya şifre",
        });
      }

      if (!staff.status) {
        return res.status(403).json({
          status: false,
          message: "Hesabınız aktif değil",
        });
      }

      // Token'ları oluştur
      const { accessToken, refreshToken, refreshTokenExpiry } =
        tokenService.generateTokens(staff.id, "staff");

      // Refresh token'ı kaydet
      await tokenService.saveRefreshToken(
        refreshToken,
        staff.id,
        "staff",
        refreshTokenExpiry
      );

      const result = staff.toJSON();
      delete result.password;

      logger.info(`Personel giriş yaptı: ${staff.email}`);
      res.json({
        status: true,
        message: "Giriş başarılı",
        data: {
          staff: result,
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      logger.error(`Personel giriş hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Giriş işlemi başarısız",
      });
    }
  }
}

module.exports = new StaffAuthController();
