const IdVerifications = require("../middleware/idVerifications");
const InvoiceDraft = require("../models/invoiceDraft");

exports.createInvoiceDraft = async (req, res, next) => {
    if (!req.params.EmployeeId) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    await IdVerifications.userExists({EmployeeId: req.params.EmployeeId});
    try {
        let invoiceDraft = {
            invoiceNumber: req.body.invoiceNumber,
            creationDate: req.body.creationDate,
            dueDate: req.body.dueDate,
            validTo: req.body.validTo,
            totalAmount: req.body.totalAmount,
            status: req.body.status,
            typeOfDocument: req.body.typeOfDocument,
            paymentMethod: req.body.paymentMethod,
            bankAccount: req.body.bankAccount,
            currency: req.body.currency,
            paid: req.body.paid,
            invoiceFile: req.body.invoiceFile,
            EmployeeId: req.params.EmployeeId
        }
        invoiceDraft = await InvoiceDraft.create(invoiceDraft, {validate: true});
        res.status(200).json({invoiceDraft});
    } catch (error) {
        res.status(500).send({
            message:
                error.message || "Some error occurred while creating INVOICE DRAFT"
        });
    }
}


exports.getInvoiceDraft = async (req, res, next) => {
    if (!req.params.InvoiceId) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    await IdVerifications.invoiceDraftExists({InvoiceId: req.params.InvoiceId});
    try {
        let invoiceDraft = await InvoiceDraft.findAll({
            where: {
                id: req.params.InvoiceId
            }
        })
        res.status(200).send(invoiceDraft)
    } catch (error) {
        res.status(500).send({
            message:
                error.message || "Some error occurred while get request"
        });
    }
}


exports.updateInvoiceDraft = async (req, res, next) => {
    if (!req.params.InvoiceId) {
        res.status(400).send({
            message: "ID can not be empty!"
        });
        return;
    }
    await IdVerifications.invoiceDraftExists({InvoiceId: req.params.InvoiceId});
    try {
        let invoiceDraft = await InvoiceDraft.update({
            invoiceNumber: req.body.invoiceNumber,
            creationDate: req.body.creationDate,
            dueDate: req.body.dueDate,
            validTo: req.body.validTo,
            totalAmount: req.body.totalAmount,
            status: req.body.status,
            typeOfDocument: req.body.typeOfDocument,
            invoiceFile: req.body.invoiceFile
        }, {
            where: {
                id: req.params.id
            }
        })
        res.status(200).send(invoiceDraft)
    } catch (error) {
        res.status(500).send({
            message:
                error.message || "Some error occurred while update request"
        });
    }
}


exports.deleteInvoiceDraft = async (req, res, next) => {
    if (!req.params.InvoiceId) {
        res.status(400).send({
            message: "ID can not be empty!"
        });
        return;
    }
    await IdVerifications.invoiceDraftExists({InvoiceId: req.params.InvoiceId});
    try {
        let invoiceDraft = await InvoiceDraft.destroy({
            where: {
                id: req.params.InvoiceId
            }
        })
        res.status(200).send(invoiceDraft)
    } catch (error) {
        res.status(500).send({
            message:
                error.message || "Some error occurred while delete request"
        });
    }
}
