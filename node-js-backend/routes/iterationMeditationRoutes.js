const express = require("express");
const router = express.Router();
const IterationMeditationController = require("../controllers/IterationMeditationController");
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Yükleme dizinlerini oluştur
const createUploadDirs = () => {
  const dirs = [
    "public/audios",
    "public/videos",
    "public/images",
    "public/uploads",
  ];
  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createUploadDirs();

// Multer yapılandırması
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = "public/";

    if (file.fieldname === "background_sound") {
      uploadPath += "audios";
    } else if (file.fieldname.startsWith("item_media_")) {
      switch (req.body.content_type) {
        case "audio":
          uploadPath += "audios";
          break;
        case "video":
          uploadPath += "videos";
          break;
        case "image":
          uploadPath += "images";
          break;
        default:
          uploadPath += "uploads";
      }
    } else if (file.fieldname.startsWith("item_description_sound_")) {
      uploadPath += "audios";
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.fieldname === "background_sound" ||
    file.fieldname.startsWith("item_description_sound_")
  ) {
    if (!file.mimetype.startsWith("audio/")) {
      return cb(new Error("Only audio files are allowed!"), false);
    }
  } else if (file.fieldname.startsWith("item_media_")) {
    const contentType = req.body.content_type;
    if (contentType === "audio" && !file.mimetype.startsWith("audio/")) {
      return cb(new Error("Invalid audio file type!"), false);
    }
    if (contentType === "video" && !file.mimetype.startsWith("video/")) {
      return cb(new Error("Invalid video file type!"), false);
    }
    if (contentType === "image" && !file.mimetype.startsWith("image/")) {
      return cb(new Error("Invalid image file type!"), false);
    }
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
});

// Routes
router.post("/", auth, upload.any(), IterationMeditationController.create);
router.get("/", auth, IterationMeditationController.getAll);
router.get("/my", auth, IterationMeditationController.getByPsychologist);
router.get("/:id", auth, IterationMeditationController.getById);
router.put("/:id", auth, upload.any(), IterationMeditationController.update);
router.delete("/:id", auth, IterationMeditationController.delete);

module.exports = router;
