const express = require('express');

const categoryController = require("../controllers/categoryController");

const router = express.Router();

router.get("/getCategories/:CompanyId", categoryController.getCategories)

router.post("/addCategories/:CompanyId", categoryController.addCategories);

router.delete("/deleteCategory/:CategoryId", categoryController.deleteCategory);

router.post("/updateCategory/:CategoryId", categoryController.updateCategory);


module.exports = router;

