const multer = require("multer");
const fs = require("fs");
const path = require("path");
const logger = require("./logger");

// Dosya yükleme yolunu belirle
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath;

    // İçerik türüne göre yükleme yolunu belirle
    if (file.fieldname === "background_sound") {
      uploadPath = "public/audios";
    } else if (file.fieldname.startsWith("item_media_")) {
      switch (req.body.content_type) {
        case "audio":
          uploadPath = "public/audios";
          break;
        case "video":
          uploadPath = "public/videos";
          break;
        case "text":
        case "image":
          uploadPath = "public/images";
          break;
        default:
          uploadPath = "public/uploads";
      }
    } else {
      switch (file.fieldname) {
        case "photo":
        case "background_image":
          uploadPath = "public/images";
          break;
        case "pdf":
          uploadPath = "public/pdfs";
          break;
        case "vocalization":
        case "sound":
          uploadPath = "public/audios";
          break;
        case "video":
          uploadPath = "public/videos";
          break;
        default:
          uploadPath = "public/uploads";
      }
    }

    // Klasör yoksa oluştur
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname +
        "-" +
        uniqueSuffix +
        path.extname(file.originalname).toLowerCase()
    );
  },
});

// Dosya filtreleme
const fileFilter = (req, file, cb) => {
  // background_sound her zaman ses dosyası olmalı
  if (file.fieldname === "background_sound") {
    if (!file.mimetype.startsWith("audio/")) {
      return cb(
        new Error("Background sound için sadece ses dosyası yüklenebilir!")
      );
    }
    return cb(null, true);
  }

  // item_media dosyaları content_type'a göre kontrol edilmeli
  if (file.fieldname.startsWith("item_media_")) {
    const contentType = req.body.content_type;

    switch (contentType) {
      case "audio":
        if (!file.mimetype.startsWith("audio/")) {
          return cb(new Error(`${file.fieldname} için ses dosyası gerekli!`));
        }
        break;
      case "video":
        if (!file.mimetype.startsWith("video/")) {
          return cb(new Error(`${file.fieldname} için video dosyası gerekli!`));
        }
        break;
      case "text":
      case "image":
        if (!file.mimetype.startsWith("image/")) {
          return cb(new Error(`${file.fieldname} için resim dosyası gerekli!`));
        }
        break;
      default:
        return cb(new Error("Geçersiz içerik türü!"));
    }
    return cb(null, true);
  }

  // Diğer dosya tipleri için kontrol
  switch (file.fieldname) {
    case "photo":
    case "background_image":
      if (!file.mimetype.startsWith("image/")) {
        return cb(new Error("Sadece resim dosyaları yüklenebilir!"));
      }
      break;
    case "pdf":
      if (file.mimetype !== "application/pdf") {
        return cb(new Error("Sadece PDF dosyaları yüklenebilir!"));
      }
      break;
    case "vocalization":
    case "sound":
      if (!file.mimetype.startsWith("audio/")) {
        return cb(new Error("Sadece ses dosyaları yüklenebilir!"));
      }
      break;
    case "video":
      if (!file.mimetype.startsWith("video/")) {
        return cb(new Error("Sadece video dosyaları yüklenebilir!"));
      }
      break;
    default:
      return cb(new Error("Geçersiz dosya türü!"));
  }

  cb(null, true);
};

// Dosya silme fonksiyonu
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      logger.info(`Dosya silindi: ${filePath}`);
    }
  } catch (error) {
    logger.error(`Dosya silme hatası: ${error.message}`);
  }
};

// Meditation iteration için özel upload middleware
const createMeditationIterationUpload = (req, res, next) => {
  try {
    // Items'ı parse et
    const items = JSON.parse(req.body.items || "[]");
    if (!Array.isArray(items)) {
      throw new Error("Items bir dizi olmalıdır");
    }

    // Upload fields'ı oluştur
    const fields = [
      { name: "background_sound", maxCount: 1 },
      ...items.map((_, index) => ({
        name: `item_media_${index + 1}`,
        maxCount: 1,
      })),
    ];

    // Upload middleware'i oluştur ve çalıştır
    const upload = multer({
      storage: storage,
      fileFilter: fileFilter,
      limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
    }).fields(fields);

    // Upload işlemini gerçekleştir
    upload(req, res, (err) => {
      if (err) {
        logger.error("Upload error:", err);
        return res.status(400).json({
          status: false,
          message: err.message || "Dosya yükleme hatası",
        });
      }
      next();
    });
  } catch (error) {
    logger.error("createMeditationIterationUpload error:", error);
    return res.status(400).json({
      status: false,
      message: error.message || "İşlem sırasında bir hata oluştu",
    });
  }
};

// Genel upload middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});

module.exports = {
  upload,
  deleteFile,
  createMeditationIterationUpload,
};
