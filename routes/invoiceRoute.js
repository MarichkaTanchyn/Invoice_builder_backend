const express = require('express');

const invoiceController = require("../controllers/invoiceController");

const router = express.Router();

router.get("/getAllDocuments/:CompanyId/:EmployeeId", invoiceController.getAllDocuments);

router.get("/getInvoice/:InvoiceId", invoiceController.getInvoice);

router.post("/createInvoice/:EmployeeId", invoiceController.createInvoice);

router.delete("/deleteInvoice/:InvoiceId", invoiceController.deleteInvoice);

router.post("/updateInvoice/:InvoiceId", invoiceController.updateInvoice);


module.exports = router;