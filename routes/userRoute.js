const authJwt = require("../middleware/authJwt");
const UserController = require("../controllers/userController");

const path = require('path');

const express = require('express');

const router = express.Router();

router.get("/api/Users", UserController.allUsers);

router.get(
    "/api/test/user",
    [authJwt.verifyToken],
    UserController.userBoard
);

router.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    UserController.adminBoard
);
module.exports = router;


