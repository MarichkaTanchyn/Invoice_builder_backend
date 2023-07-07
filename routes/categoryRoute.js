const express = require('express');

const categoryController = require("../controllers/categoryController");
const {authorize} = require("../middleware/authJwt");

const router = express.Router();

router.get("/getCategories/:CompanyId", authorize, categoryController.getCategories)

router.get("/getCategoriesWithSubcategories/:CompanyId", authorize, categoryController.getCategoriesWithSubcategories)

router.post("/addCategories/:CompanyId", authorize, categoryController.addCategories);

router.delete("/deleteCategory/:CategoryId", authorize, categoryController.deleteCategory);

router.post("/updateCategory/:CategoryId", authorize, categoryController.updateCategory);


module.exports = router;

