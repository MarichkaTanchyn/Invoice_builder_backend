const express = require('express');

const invoiceController = require("../controllers/invoiceController");

const router = express.Router();

router.get("/getAllDocuments/:CompanyId", invoiceController.getAllDocuments);

router.post("/createInvoice/:EmployeeId", invoiceController.createInvoice);

router.post("/createInvoiceDraft/:EmployeeId", invoiceController.createInvoiceDraft);

router.delete("/deleteInvoice/:InvoiceId", invoiceController.deleteInvoice);

router.delete("/deleteInvoiceDraft/:InvoiceId", invoiceController.deleteInvoiceDraft);

router.post("/updateInvoice/:InvoiceId", invoiceController.updateInvoice);

router.post("/updateInvoiceDraft/:InvoiceId", invoiceController.updateInvoiceDraft);

router.get("/getInvoice/:InvoiceId", invoiceController.getInvoice);

router.get("/getInvoiceDraft/:InvoiceId", invoiceController.getInvoiceDraft);

module.exports = router;