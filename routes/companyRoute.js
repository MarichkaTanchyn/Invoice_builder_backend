const path = require('path');
const express = require('express');

const companyController = require("../controllers/companyController");

const router = express.Router();

router.get("/getAllCompanies",companyController.getAllCompanies);
router.delete("/deleteCompany/:id",companyController.deleteCompany)

module.exports = router;
