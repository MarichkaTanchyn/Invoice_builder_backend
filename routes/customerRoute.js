const express = require('express');
const {authorize} = require("../middleware/authJwt");

const customerController = require("../controllers/customerController");
const router = express.Router();

router.get("/getCompanyCustomers/:CompanyId", authorize, customerController.getCompanyCustomers);

router.get("/getCustomer/:CustomerId", authorize, customerController.getCustomer);

router.post("/addCustomer/:CompanyId", authorize, customerController.addCustomer);

router.post("/updateCustomer/:CustomerId", authorize, customerController.updateCustomer);

router.delete("/deleteCustomer/:CustomerId", authorize, customerController.deleteCustomer);

module.exports = router;
