const express = require('express');

const categoryController = require("../controllers/categoryController");

const router = express.Router();

router.get("/getCategories/:id", categoryController.getCategories)

router.post("/addCategory/:id", categoryController.addCategory);

router.delete("/deleteCategory/:companyId/:id", categoryController.deleteCategory);

router.post("/updateCategory/:id", categoryController.updateCategory);

module.exports = router;

