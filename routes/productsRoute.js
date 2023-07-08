const express = require('express');

const productController = require("../controllers/productController");
const {authorize} = require("../middleware/authJwt");

const router = express.Router();

router.post("/addProduct/:CategoryId",  authorize,productController.addProduct);

router.get("/getCategoryProducts/:CategoryId", authorize, productController.getProducts);

router.get("/getProduct/:ProductId", authorize, productController.getProduct);

router.post("/updateProducts", authorize, productController.updateProducts);

router.delete("/deleteProduct/:ProductId", authorize, productController.deleteProduct);

router.delete("/deleteAllProducts", authorize, productController.deleteAllProducts);

router.post("/deleteProducts", authorize, productController.deleteProducts);

router.delete("/deleteCategoryProducts/:CategoryId", authorize, productController.deleteCategoryProducts);

module.exports = router;