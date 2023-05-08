const express = require('express');

const productController = require("../controllers/productController");

const router = express.Router();

router.post("/addProducts/:CategoryId", productController.addProducts);

module.exports = router;