const IdVerifications = require("../middleware/idVerifications");
const InvoiceDraft = require("../models/invoiceDraft");
const Employee = require("../models/employee");
const Person = require("../models/person");
const validateRequest = require("../middleware/validateRequest");

exports.createInvoiceDraft = [validateRequest(['EmployeeId'], []), async (req, res, next) => {

    await IdVerifications.employeeExists({EmployeeId: req.params.EmployeeId});
    let employee = await Employee.findAll({
        include: {
            model: Person, required: true, where: {
                id: req.params.EmployeeId
            }
        },
    });
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
            EmployeeId: req.params.EmployeeId,
            CompanyId: employee[0].Person.CompanyId,
        }
        invoiceDraft = await InvoiceDraft.create(invoiceDraft, {validate: true});
        res.status(200).json({invoiceDraft});
    } catch (err) {
        next(err);
    }
}]


exports.getInvoiceDraft = [validateRequest(['InvoiceId'], []), async (req, res, next) => {

    await IdVerifications.invoiceDraftExists({InvoiceId: req.params.InvoiceId});
    try {
        let invoiceDraft = await InvoiceDraft.findAll({
            where: {
                id: req.params.InvoiceId
            }
        })
        res.status(200).send(invoiceDraft)
    } catch (err) {
        next(err);
    }
}]


exports.updateInvoiceDraft = [validateRequest(['InvoiceId'], []), async (req, res, next) => {
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
    } catch (err) {
        next(err);
    }
}]


exports.deleteInvoiceDraft = [validateRequest(['InvoiceId'], []), async (req, res, next) => {

    await IdVerifications.invoiceDraftExists({InvoiceId: req.params.InvoiceId});
    try {
        await InvoiceDraft.destroy({
            where: {
                id: req.params.InvoiceId
            }
        })
        res.sendStatus(200)
    } catch (err) {
        next(err);
    }
}]
