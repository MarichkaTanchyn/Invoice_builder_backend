const express = require('express');

const companyController = require("../controllers/companyController");
const {authorize} = require("../middleware/authJwt");

const router = express.Router();

router.get("/getAllCompanies", authorize, companyController.getAllCompanies);

router.get("/getCompany/:CompanyId", authorize, companyController.getCompany)

router.delete("/deleteCompany/:CompanyId", authorize, companyController.deleteCompany);

router.post("/updateCompany/:CompanyId", authorize, companyController.updateCompany);

module.exports = router;
