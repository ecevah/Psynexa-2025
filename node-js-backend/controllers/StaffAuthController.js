const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Staff, Restrictions } = require("../models");
const { Op } = require("sequelize");

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
  static async register(req, res) {
    try {
      const {
        name,
        username,
        email,
        password,
        date_of_birth,
        identity_number,
        phone,
        address,
        restrictions_id,
      } = req.body;

      // Check if staff with same email or username exists
      const existingStaff = await Staff.findOne({
        where: {
          [Op.or]: [{ email }, { username }],
        },
      });

      if (existingStaff) {
        return res.status(400).json({
          success: false,
          error: {
            message:
              "Bu e-posta veya kullanıcı adı ile kayıtlı bir personel zaten var",
            status: 400,
          },
        });
      }

      // Check if restrictions_id exists
      const restriction = await Restrictions.findByPk(restrictions_id);
      if (!restriction) {
        return res.status(400).json({
          success: false,
          error: {
            message: "Geçersiz yetki grubu",
            status: 400,
          },
        });
      }

      // Create new staff member
      const staff = await Staff.create({
        name,
        username,
        email,
        password,
        date_of_birth,
        identity_number,
        phone,
        address,
        restrictions_id,
        status: true,
      });

      // Generate JWT token
      const token = jwt.sign(
        { staff_id: staff.id, role: "staff" },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      res.status(201).json({
        success: true,
        data: {
          staff: {
            id: staff.id,
            name: staff.name,
            username: staff.username,
            email: staff.email,
          },
          token,
        },
      });
    } catch (error) {
      console.error("Staff Register Error:", error);
      res.status(500).json({
        success: false,
        error: {
          message: "Personel kaydı sırasında bir hata oluştu",
          status: 500,
        },
      });
    }
  }

  /**
   * Login staff member
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async login(req, res) {
    try {
      const { username, password } = req.body;

      // Find staff by username
      const staff = await Staff.findOne({
        where: { username },
        include: [
          {
            model: Restrictions,
            attributes: ["permissions"],
          },
        ],
      });

      if (!staff) {
        return res.status(401).json({
          success: false,
          error: {
            message: "Geçersiz kullanıcı adı veya şifre",
            status: 401,
          },
        });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, staff.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: {
            message: "Geçersiz kullanıcı adı veya şifre",
            status: 401,
          },
        });
      }

      // Check if staff is active
      if (!staff.status) {
        return res.status(403).json({
          success: false,
          error: {
            message: "Hesabınız aktif değil",
            status: 403,
          },
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { staff_id: staff.id, role: "staff" },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      res.json({
        success: true,
        data: {
          staff: {
            id: staff.id,
            name: staff.name,
            username: staff.username,
            email: staff.email,
            permissions: staff.Restriction?.permissions || {},
          },
          token,
        },
      });
    } catch (error) {
      console.error("Staff Login Error:", error);
      res.status(500).json({
        success: false,
        error: {
          message: "Giriş sırasında bir hata oluştu",
          status: 500,
        },
      });
    }
  }
}

module.exports = StaffAuthController;
