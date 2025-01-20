const express = require("express");
const router = express.Router();
const IterationMeditationController = require("../controllers/IterationMeditationController");
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

// Multer configuration for file uploads
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

const upload = multer({ storage: storage });

// Routes
router.post("/", auth, upload.any(), IterationMeditationController.create);
router.get("/", auth, IterationMeditationController.getAll);
router.get("/my", auth, IterationMeditationController.getByPsychologist);
router.get("/:id", auth, IterationMeditationController.getById);
router.put("/:id", auth, upload.any(), IterationMeditationController.update);
router.delete("/:id", auth, IterationMeditationController.delete);

module.exports = router;
