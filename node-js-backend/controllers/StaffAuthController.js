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
        surname,
        email,
        password,
        date_of_birth,
        identity_number,
        phone,
        address,
        restrictions_id,
      } = req.body;

      // Check if staff with same email exists
      const existingStaff = await Staff.findOne({
        where: {
          [Op.or]: [{ email }],
        },
      });

      if (existingStaff) {
        return res.status(400).json({
          success: false,
          error: {
            message: "Bu e-posta ile kayıtlı bir personel zaten var",
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

      // Hash password before saving
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new staff member
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
            surname: staff.surname,
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
      const { email, password } = req.body;

      // Find staff by email
      const staff = await Staff.findOne({
        where: { email },
        include: [
          {
            model: Restrictions,
            attributes: ["permissions"],
          },
        ],
      });

      if (!staff) {
        return res.status(401).json({
          status: false,
          message: "Geçersiz e-posta veya şifre",
        });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, staff.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          status: false,
          message: "Geçersiz e-posta veya şifre",
        });
      }

      // Check if staff is active
      if (!staff.status) {
        return res.status(403).json({
          status: false,
          message: "Hesabınız aktif değil",
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

      res.status(200).json({
        status: true,
        data: {
          staff: {
            id: staff.id,
            name: staff.name,
            surname: staff.surname,
            email: staff.email,
            permissions: staff.Restriction?.permissions || {},
          },
          token,
        },
      });
    } catch (error) {
      console.error("Staff Login Error:", error);
      res.status(500).json({
        status: false,
        message: "Giriş sırasında bir hata oluştu",
      });
    }
  }
}

module.exports = StaffAuthController;
