const controller = require("../controllers/authController");
const express = require('express');
const {authorize} = require("../middleware/authJwt");

const router = express.Router();

router.post("/companySignup", controller.companySignup);

router.post("/signIn", controller.signIn);

router.post("/employeeSignup/:token", controller.employeeSignup);

router.get("/createInvite/:CompanyId", controller.createInvite)

router.post ("/sendRegisterLinkViaEmail/:CompanyId", authorize, controller.sendRegisterLinkViaEmail)

router.post ("/acceptEmployee/:EmployeeId", authorize, controller.acceptEmployee)

module.exports = router;
