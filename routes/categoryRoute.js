const path = require('path');

const express = require('express');

const categoryController = require("../controllers/categoryController");

const router = express.Router();

router.get("/getCategories",categoryController.getCategories);

router.post("/addCategory", categoryController.addCategory);

module.exports = router;

