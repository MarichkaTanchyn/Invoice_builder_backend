const express = require('express');

const companyController = require("../controllers/companyController");

const router = express.Router();

router.get("/getAllCompanies", companyController.getAllCompanies);

router.get("/getCompany/:id", companyController.getCompany)

router.delete("/deleteCompany/:id", companyController.deleteCompany);

router.post("/updateCompany/:id", companyController.updateCompany);

module.exports = router;
