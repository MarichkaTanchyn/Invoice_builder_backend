const express = require("express");
const invoiceDraftController = require("../controllers/invoiceDraftController");
const {authorize} = require("../middleware/authJwt");

const router = express.Router();

router.post("/createInvoiceDraft/:EmployeeId", authorize, invoiceDraftController.createInvoiceDraft);

router.delete("/deleteInvoiceDraft/:InvoiceId", authorize, invoiceDraftController.deleteInvoiceDraft);

router.post("/updateInvoiceDraft/:InvoiceId", authorize, invoiceDraftController.updateInvoiceDraft);

router.get("/getInvoiceDraft/:InvoiceId", authorize, invoiceDraftController.getInvoiceDraft);

module.exports = router;