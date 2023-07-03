const express = require('express');

const employeeController = require("../controllers/employeeController");
const {authorize} = require("../middleware/authJwt");

const router = express.Router();

router.get("/getCompanyEmployees/:id", authorize, employeeController.getEmployeesInCompany)

router.get("/getEmployee/:id", authorize, employeeController.getEmployee);

router.delete("/deleteEmployee/:EmployeeId", authorize, employeeController.deleteEmployee);

router.post("/updateEmployeePerson/:id", authorize, employeeController.updateEmployeePerson);

module.exports = router;
