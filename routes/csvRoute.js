const express = require('express');
const csvController = require('../controllers/csvController');
const router = express.Router();

router.post("/readExcelSheet/:fileKey", csvController.readExcel);

router.post("/preprocessSelectedSheetData/:fileKey", csvController.preprocessSelectedSheetData);

router.post("/createNewCategoryFromSheet/:fileKey", csvController.createNewCategoryFromSheet);

module.exports = router;