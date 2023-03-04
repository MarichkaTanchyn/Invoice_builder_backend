const Invoice = require('../models/invoice');
const InvoiceDraft = require('../models/invoiceDraft');

exports.getAllDocuments = async (req, res, next) => {
    try {
        let invoice = await Invoice.findAll();
        let invoiceDraft = await InvoiceDraft.findAll();
        res.status(200).json({invoice, invoiceDraft});
    } catch (error) {
        res.status(500).send({
            message:
                error.message || "Some error occurred while getting ALL DOCUMENTS"
        });
    }
}

exports.createInvoice = async (req, res, next) => {
    try {
        let invoice = {
            invoiceNumber: req.body.invoiceNumber,
            creationDate: req.body.creationDate,
            dueDate: req.body.dueDate,
            validTo: req.body.validTo,
            totalAmount: req.body.totalAmount,
            status: req.body.status,
            typeOfDocument: req.body.typeOfDocument,
            invoiceFileLink: req.body.invoiceFileLink
        }
        invoice = await Invoice.create(invoice, {validate: true});
        res.status(200).json({invoice});
    } catch (error) {
        res.status(500).send({
            message:
                error.message || "Some error occurred while creating INVOICE"
        });
    }
}
exports.createInvoiceDraft = async (req, res, next) => {
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
            invoiceFile: req.body.invoiceFile
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

exports.getInvoice = async (req, res, next) => {
    if (!req.params.id) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    try {
        let invoice = await Invoice.findAll({
            where: {
                id : req.params.id
            }
        })
        res.status(200).send(invoice)
    } catch (error) {
        res.status(500).send({
            message:
                error.message || "Some error occurred while get request"
        });
    }
}

exports.getInvoiceDraft = async (req, res, next) => {
    if (!req.params.id) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    try {
        let invoiceDraft = await InvoiceDraft.findAll({
            where: {
                id : req.params.id
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

exports.deleteInvoice = async (req, res, next) => {
    if (!req.params.id) {
        res.status(400).send({
            message: "ID can not be empty!"
        });
        return;
    }
    try {
        let invoice = await Invoice.destroy({
            where: {
                id : req.params.id
            }
        })
        res.status(200).send(invoice)
    } catch (error) {
        res.status(500).send({
            message:
                error.message || "Some error occurred while delete request"
        });
    }
}

exports.deleteInvoiceDraft = async (req, res, next) => {
    if (!req.params.id) {
        res.status(400).send({
            message: "ID can not be empty!"
        });
        return;
    }
    try {
        let invoiceDraft = await InvoiceDraft.destroy({
            where: {
                id : req.params.id
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

exports.updateInvoice = async (req, res, next) => {
    if (!req.params.id) {
        res.status(400).send({
            message: "ID can not be empty!"
        });
        return;
    }
    try {
        let invoice = await Invoice.update({
            invoiceNumber: req.body.invoiceNumber,
            creationDate: req.body.creationDate,
            dueDate: req.body.dueDate,
            validTo: req.body.validTo,
            totalAmount: req.body.totalAmount,
            status: req.body.status,
            typeOfDocument: req.body.typeOfDocument,
            invoiceFile: req.body.invoiceFile,
        }, {
            where: {
                id : req.params.id
            }
        })
        res.status(200).send(invoice)
    } catch (error) {
        res.status(500).send({
            message:
                error.message || "Some error occurred while update request"
        });
    }
}

exports.updateInvoiceDraft = async (req, res, next) => {
    if (!req.params.id) {
        res.status(400).send({
            message: "ID can not be empty!"
        });
        return;
    }
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
                id : req.params.id
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

