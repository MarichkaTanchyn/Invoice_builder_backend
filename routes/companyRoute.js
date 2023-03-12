const express = require('express');

const companyController = require("../controllers/companyController");

const router = express.Router();

router.get("/getAllCompanies", companyController.getAllCompanies);

router.get("/getCompany/:CompanyId", companyController.getCompany)

router.delete("/deleteCompany/:CompanyId", companyController.deleteCompany);

router.post("/updateCompany/:CompanyId", companyController.updateCompany);

module.exports = router;
