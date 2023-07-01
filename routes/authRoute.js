const controller = require("../controllers/authController");

const path = require('path');

const express = require('express');
const {authorize} = require("../middleware/authJwt");

const router = express.Router();

router.post(
    "/signup",
    controller.signup
);
router.post("/signIn", controller.signIn);
module.exports = router;
