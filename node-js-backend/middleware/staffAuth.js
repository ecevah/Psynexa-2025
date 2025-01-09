const jwt = require("jsonwebtoken");
const { Staff, Restrictions } = require("../models");

const staffAuth = async (req, res, next) => {
  try {
    // Token kontrolü
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          message: "Yetkilendirme token'ı bulunamadı",
          status: 401,
        },
      });
    }

    // Token'ı doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.staff_id) {
      return res.status(403).json({
        success: false,
        error: {
          message: "Bu endpoint sadece staff üyeleri için erişilebilir",
          status: 403,
        },
      });
    }

    // Staff bilgilerini ve yetkilerini getir
    const staff = await Staff.findOne({
      where: { id: decoded.staff_id },
      include: [
        {
          model: Restrictions,
          attributes: ["permissions"],
        },
      ],
    });

    if (!staff) {
      return res.status(404).json({
        success: false,
        error: {
          message: "Staff üyesi bulunamadı",
          status: 404,
        },
      });
    }

    // Staff'ın yetkilerini kontrol et
    const permissions = staff.Restriction?.permissions || [];
    const route = req.baseUrl + req.path;
    const method = req.method;

    // Yetki kontrolü
    const hasPermission = checkPermission(permissions, route, method);
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        error: {
          message: "Bu işlem için yetkiniz bulunmamaktadır",
          status: 403,
        },
      });
    }

    // Staff bilgilerini request'e ekle
    req.staff = staff;
    req.permissions = permissions;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        error: {
          message: "Geçersiz token",
          status: 401,
        },
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: {
          message: "Token süresi dolmuş",
          status: 401,
        },
      });
    }

    return res.status(500).json({
      success: false,
      error: {
        message: "Sunucu hatası",
        status: 500,
      },
    });
  }
};

// Yetki kontrolü fonksiyonu
const checkPermission = (permissions, route, method) => {
  // Özel rotalar için yetki kontrolleri
  const permissionMap = {
    // Psikolog yönetimi
    "/api/psychologist-approval": {
      GET: "view_psychologist_approvals",
      PUT: "manage_psychologist_approvals",
    },
    "/api/psychologists": {
      GET: "view_psychologists",
      PUT: "manage_psychologists",
      DELETE: "manage_psychologists",
    },

    // Staff yönetimi
    "/api/staff": {
      GET: "view_staff",
      POST: "manage_staff",
      PUT: "manage_staff",
      DELETE: "manage_staff",
    },
    "/api/restrictions": {
      GET: "view_restrictions",
      POST: "manage_restrictions",
      PUT: "manage_restrictions",
      DELETE: "manage_restrictions",
    },

    // İçerik yönetimi
    "/api/blogs": {
      GET: "view_content",
      POST: "manage_content",
      PUT: "manage_content",
      DELETE: "manage_content",
    },
    "/api/articles": {
      GET: "view_content",
      POST: "manage_content",
      PUT: "manage_content",
      DELETE: "manage_content",
    },
    "/api/meditations": {
      GET: "view_content",
      POST: "manage_content",
      PUT: "manage_content",
      DELETE: "manage_content",
    },
    "/api/series": {
      GET: "view_content",
      POST: "manage_content",
      PUT: "manage_content",
      DELETE: "manage_content",
    },
    "/api/breathing-exercises": {
      GET: "view_content",
      POST: "manage_content",
      PUT: "manage_content",
      DELETE: "manage_content",
    },

    // Test yönetimi
    "/api/tests": {
      GET: "view_tests",
      POST: "manage_tests",
      PUT: "manage_tests",
      DELETE: "manage_tests",
    },

    // Müşteri yönetimi
    "/api/clients": {
      GET: "view_clients",
      PUT: "manage_clients",
      DELETE: "manage_clients",
    },

    // Paket ve ödeme yönetimi
    "/api/packages": {
      GET: "view_packages",
      POST: "manage_packages",
      PUT: "manage_packages",
      DELETE: "manage_packages",
    },
    "/api/payments": {
      GET: "view_payments",
      POST: "manage_payments",
      PUT: "manage_payments",
      DELETE: "manage_payments",
    },

    // Log yönetimi
    "/api/logs": {
      GET: "view_logs",
    },
  };

  // Route'u kontrol et
  for (const [pattern, methodPermissions] of Object.entries(permissionMap)) {
    if (route.startsWith(pattern)) {
      const requiredPermission = methodPermissions[method];
      if (!requiredPermission) return false;
      return permissions.includes(requiredPermission);
    }
  }

  // Eğer route için özel bir yetki tanımlanmamışsa, varsayılan olarak erişimi reddet
  return false;
};

module.exports = staffAuth;
