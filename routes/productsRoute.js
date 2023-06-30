const express = require('express');

const productController = require("../controllers/productController");

const router = express.Router();

router.post("/addProduct/:CategoryId", productController.addProduct);

router.get("/getCategoryProducts/:CategoryId", productController.getProducts);

router.post("/updateProducts", productController.updateProducts);

router.delete("/deleteProduct/:ProductId", productController.deleteProduct);

router.delete("/deleteAllProducts", productController.deleteAllProducts);

router.post("/deleteProducts", productController.deleteProducts);

router.delete("/deleteCategoryProducts/:CategoryId", productController.deleteCategoryProducts);

module.exports = router;