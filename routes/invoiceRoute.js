const express = require('express');

const invoiceController = require("../controllers/invoiceController");
const {authorize} = require("../middleware/authJwt");

const router = express.Router();

router.get("/getAllDocuments/:CompanyId/:EmployeeId", authorize, invoiceController.getAllDocuments);

router.get("/getInvoice/:InvoiceId", authorize, invoiceController.getInvoice);

router.get("/getCustomerInvoices/:CustomerId", authorize, invoiceController.getCustomerInvoices);

router.get("/getInvoicePdf/:InvoiceId", authorize, invoiceController.getInvoicePdf);

router.post("/createInvoice/:EmployeeId", authorize, invoiceController.createInvoice);

router.delete("/deleteInvoice/:InvoiceId", authorize, invoiceController.deleteInvoice);

router.post("/updateInvoice/:InvoiceId", authorize, invoiceController.updateInvoice);


module.exports = router;