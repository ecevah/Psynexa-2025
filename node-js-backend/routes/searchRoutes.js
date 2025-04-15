const express = require("express");
const router = express.Router();
const searchController = require("../controllers/SearchController");
const { authenticateJWT } = require("../middleware/authMiddleware");

// Tek kelimelik başlık araması için endpoint
router.get("/title/:keyword", authenticateJWT, searchController.searchByTitle);

// Kategori bazlı arama için endpoint
router.get(
  "/category/:category",
  authenticateJWT,
  searchController.searchByCategory
);

module.exports = router;
