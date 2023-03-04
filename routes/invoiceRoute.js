const express = require('express');

const invoiceController = require("../controllers/invoiceController");

const router = express.Router();

router.get("/getAllDocuments/:id", invoiceController.getAllDocuments);

router.post("/createInvoice/:id", invoiceController.createInvoice);

router.post("/createInvoiceDraft/:id", invoiceController.createInvoiceDraft);

router.delete("/deleteInvoice/:companyId/:id", invoiceController.deleteInvoice);

router.delete("/deleteInvoiceDraft/:companyId/:id", invoiceController.deleteInvoiceDraft);

router.post("/updateInvoice/:id", invoiceController.updateInvoice);

router.post("/updateInvoiceDraft/:id", invoiceController.updateInvoiceDraft);

module.exports = router;