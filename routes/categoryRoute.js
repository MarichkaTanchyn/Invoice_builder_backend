const path = require('path');

const express = require('express');

const categoryController = require("../controllers/categoryController");

const router = express.Router();

router.get("/getCategories/:id", categoryController.getCategories)

router.post("/addCategory/:id", categoryController.addCategory);

module.exports = router;

