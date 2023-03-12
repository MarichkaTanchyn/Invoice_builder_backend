const express = require("express");
const invoiceDraftController = require("../controllers/invoiceDraftController");

const router = express.Router();

router.post("/createInvoiceDraft/:EmployeeId", invoiceDraftController.createInvoiceDraft);

router.delete("/deleteInvoiceDraft/:InvoiceId", invoiceDraftController.deleteInvoiceDraft);

router.post("/updateInvoiceDraft/:InvoiceId", invoiceDraftController.updateInvoiceDraft);

router.get("/getInvoiceDraft/:InvoiceId", invoiceDraftController.getInvoiceDraft);

module.exports = router;