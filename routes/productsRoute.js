const express = require('express');

const productController = require("../controllers/productController");

const router = express.Router();

router.post("/addProducts/:CategoryId", productController.addProducts);

router.get("/getProducts/:CategoryId", productController.getProducts);

router.delete("/deleteProduct/:ProductId", productController.deleteProduct);

router.delete("/deleteAllProducts", productController.deleteAllProducts);

router.delete("/deleteCategoryProducts/:CategoryId", productController.deleteCategoryProducts);

module.exports = router;