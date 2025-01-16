const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Dosya yükleme için storage konfigürasyonu
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath;

    if (req.baseUrl.includes("psychologist")) {
      uploadPath = `public/psychologists/${req.user?.id || "temp"}`;
    } else if (req.baseUrl.includes("client")) {
      uploadPath = `public/clients/${req.user?.id || "temp"}`;
    } else {
      uploadPath = "public/uploads";
    }

    // Klasör yoksa oluştur
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Dosya adını oluştur: timestamp-orijinal_ad
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Dosya filtreleme
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "photo" || file.fieldname === "image") {
    // Resim dosyaları için kontrol
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Sadece resim dosyaları yüklenebilir!"), false);
    }
  } else if (file.fieldname === "pdf") {
    // PDF dosyaları için kontrol
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Sadece PDF dosyaları yüklenebilir!"), false);
    }
  } else {
    cb(new Error("Geçersiz dosya tipi!"), false);
  }
};

// Multer konfigürasyonu
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Dosya silme fonksiyonu
const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }
  return false;
};

module.exports = {
  upload,
  deleteFile,
};
