const path = require('path');
const express = require('express');

const employeeController = require("../controllers/employeeController");

const router = express.Router();

router.get("/getCompaniesEmployees/:id", employeeController.getEmployeesInCompany)

module.exports = router;