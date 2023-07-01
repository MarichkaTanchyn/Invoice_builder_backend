const express = require('express');
const verifySignUp = require("../middleware/verifySignUp");

const employeeController = require("../controllers/employeeController");
const {authorize} = require("../middleware/authJwt");

const router = express.Router();

router.get("/getCompanyEmployees/:id", authorize, employeeController.getEmployeesInCompany)

router.post("/addEmployee/:id",
    [
        verifySignUp.checkDuplicateEmail,
        authorize
    ],
    employeeController.addEmployee);

router.delete("/deleteEmployee/:id", authorize, employeeController.deleteEmployee);

router.post("/updatePerson/:id", authorize, employeeController.updatePerson);

module.exports = router;