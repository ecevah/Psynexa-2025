const express = require("express");
const testJwtBenchController = require("../controllers/TestJwtBenchController");

const router = express.Router();

router.post("/", testJwtBenchController.testJwtBench);
router.post("/decode", testJwtBenchController.decodeJwtBench);

module.exports = router;
