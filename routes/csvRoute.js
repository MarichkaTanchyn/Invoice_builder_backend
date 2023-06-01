const express = require('express');
const csvController = require('../controllers/csvController');
const router = express.Router();

router.post("/readExcelSheet/:fileKey", csvController.readExcel);

module.exports = router;