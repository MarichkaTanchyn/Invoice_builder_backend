const verifySignUp = require("../middleware/verifySignUp");
const controller = require("../controllers/authController");

const path = require('path');

const express = require('express');

const router = express.Router();

router.post(
    "/api/auth/signup",
    [
        verifySignUp.checkDuplicateEmail,
        verifySignUp.checkRolesExisted
    ],
    controller.signup
);
router.post("/api/auth/signIn", controller.signIn);
module.exports = router;
