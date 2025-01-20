const express = require("express");
const router = express.Router();
const IterationMeditationItemController = require("../controllers/IterationMeditationItemController");
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

// Multer yapılandırması
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = "public/";
    // Dosya türüne göre yükleme yolunu belirleyin
    if (file.fieldname === "media") {
      uploadPath += "media";
    } else if (file.fieldname === "description_sound") {
      uploadPath += "audios";
    } else if (file.fieldname === "background_sound") {
      uploadPath += "audios";
    } else if (file.fieldname === "vocalization") {
      uploadPath += "audios";
    } else if (file.fieldname === "sound") {
      uploadPath += "audios";
    } else if (file.fieldname === "content") {
      uploadPath += "content";
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

// Upload alanlarını yapılandırın
const uploadFields = upload.fields([
  { name: "media", maxCount: 1 },
  { name: "description_sound", maxCount: 1 },
  { name: "background_sound", maxCount: 1 },
  { name: "vocalization", maxCount: 1 },
  { name: "sound", maxCount: 1 },
  { name: "content", maxCount: 1 },
]);

// Create a new iteration meditation item
router.post("/", auth, uploadFields, IterationMeditationItemController.create);

// Get all items for a specific meditation
router.get(
  "/meditation/:meditation_id",
  auth,
  IterationMeditationItemController.getAll
);

// Get a specific item by ID
router.get("/:id", auth, IterationMeditationItemController.getById);

// Update an item
router.put(
  "/:id",
  auth,
  uploadFields,
  IterationMeditationItemController.update
);

// Delete an item
router.delete("/:id", auth, IterationMeditationItemController.delete);

module.exports = router;
