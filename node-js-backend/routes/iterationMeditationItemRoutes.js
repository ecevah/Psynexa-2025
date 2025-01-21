const express = require("express");
const router = express.Router();
const IterationMeditationItemController = require("../controllers/IterationMeditationItemController");
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

    if (file.fieldname === "media") {
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
    } else if (
      ["description_sound", "background_sound"].includes(file.fieldname)
    ) {
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
  if (["description_sound", "background_sound"].includes(file.fieldname)) {
    if (!file.mimetype.startsWith("audio/")) {
      return cb(new Error("Only audio files are allowed!"), false);
    }
  } else if (file.fieldname === "media") {
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

// Upload alanlarını yapılandır
const uploadFields = upload.fields([
  { name: "media", maxCount: 1 },
  { name: "description_sound", maxCount: 1 },
  { name: "background_sound", maxCount: 1 },
]);

// Routes
router.post("/", auth, uploadFields, IterationMeditationItemController.create);
router.get(
  "/meditation/:meditation_id",
  auth,
  IterationMeditationItemController.getAll
);
router.get("/:id", auth, IterationMeditationItemController.getById);
router.put(
  "/:id",
  auth,
  uploadFields,
  IterationMeditationItemController.update
);
router.delete("/:id", auth, IterationMeditationItemController.delete);

module.exports = router;
