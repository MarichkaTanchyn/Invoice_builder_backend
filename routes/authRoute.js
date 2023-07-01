const controller = require("../controllers/authController");

const path = require('path');

const express = require('express');

const router = express.Router();

router.post(
    "/signup",
    controller.signup
);
router.post("/api/auth/signIn", controller.signIn);
module.exports = router;
