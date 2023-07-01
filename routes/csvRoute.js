const express = require('express');
const csvController = require('../controllers/csvController');
const {authorize} = require("../middleware/authJwt");
const router = express.Router();

router.post("/readExcelSheet/:fileKey", authorize, csvController.readExcel);

router.post("/preprocessSelectedSheetData/:fileKey", authorize, csvController.preprocessSelectedSheetData);

router.post("/createNewCategoryFromSheet/:fileKey", authorize, csvController.createNewCategoryFromSheet);

module.exports = router;