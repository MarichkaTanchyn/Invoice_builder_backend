const controller = require("../controllers/authController");

const path = require('path');

const express = require('express');
const {authorize} = require("../middleware/authJwt");

const router = express.Router();

router.post("/companySignup", controller.companySignup);

router.post("/signIn", controller.signIn);

router.post("/employeeSignup/:token", controller.employeeSignup);

router.get("/createInvite/:CompanyId", controller.createInvite)

module.exports = router;
