const path = require('path');

const express = require('express');

const categoryController = require("../controllers/CategoryController");

const router = express.Router();

router.post("/addCategory", categoryController.addCategory);

module.exports = router;

