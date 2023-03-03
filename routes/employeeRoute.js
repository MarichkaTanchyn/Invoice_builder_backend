const express = require('express');

const employeeController = require("../controllers/employeeController");

const router = express.Router();

router.get("/getCompanyEmployees/:id", employeeController.getEmployeesInCompany)

router.post("/addEmployee/:id", employeeController.addEmployee);

router.delete("/deleteEmployee/:id", employeeController.deleteEmployee);

router.post("/updatePerson/:id", employeeController.updatePerson);

module.exports = router;