const Invoice = require('../models/invoice');
const InvoiceDraft = require('../models/invoiceDraft');
const Employee = require('../models/employee');
const Person = require('../models/person');
const permissionOperations = require("../middleware/permissionCheck");
const IdVerifications = require("../middleware/idVerifications");
const validateRequest = require('../middleware/validateRequest');


exports.getAllDocuments = [validateRequest(['CompanyId', 'EmployeeId'], []), async (req, res, next) => {
    try {
        const {CompanyId, EmployeeId} = req.params;

        await IdVerifications.userExists({EmployeeId});
        await IdVerifications.companyExists({CompanyId});
        //todo: add employee name and surname to response

        let hasPermission = await permissionOperations.hasPermission(EmployeeId, "all_invoices_access")
        let invoices, drafts, documents;
        if (hasPermission) {
            invoices = await Invoice.findAll({
                where: {
                    CompanyId
                }, include: [{
                    model: Employee, include: [{
                        model: Person, attributes: ['firstName', 'lastName']
                    }]
                }]
            });
            drafts = await InvoiceDraft.findAll({
                where: {
                    CompanyId
                }, include: [{
                    model: Employee, include: [{
                        model: Person, attributes: ['firstName', 'lastName']
                    }]
                }]
            });
            documents = [...invoices, ...drafts];
        } else {
            invoices = await Invoice.findAll({
                where: {
                    EmployeeId, CompanyId
                }, include: [{
                    model: Employee, include: [{
                        model: Person, attributes: ['firstName', 'lastName']
                    }]
                }]
            });
            drafts = await InvoiceDraft.findAll({
                where: {
                    EmployeeId, CompanyId
                }, include: [{
                    model: Employee, include: [{
                        model: Person, attributes: ['firstName', 'lastName']
                    }]
                }]
            });
            documents = [...invoices, ...drafts];
        }
        res.status(200).json({documents});
    } catch (err) {
        next(err);
    }
}]

//todo: rewrite this function, its test function, in real one I will need more details
exports.createInvoice = [validateRequest(['EmployeeId'], []), async (req, res, next) => {

    await IdVerifications.userExists({EmployeeId: req.params.EmployeeId});
    let employee = await Employee.findAll({
        include: {
            model: Person, required: true, where: {
                id: req.params.EmployeeId
            }
        },
    })
    try {
        let invoice = {
            invoiceNumber: req.body.invoiceNumber,
            creationDate: req.body.creationDate,
            dueDate: req.body.dueDate,
            validTo: req.body.validTo,
            totalAmount: req.body.totalAmount,
            status: req.body.status,
            typeOfDocument: req.body.typeOfDocument,
            invoiceFileLink: req.body.invoiceFileLink,
            EmployeeId: req.params.EmployeeId,
            CompanyId: employee[0].Person.CompanyId
        }
        invoice = await Invoice.create(invoice, {validate: true});
        res.status(200).json({invoice});
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while creating INVOICE"
        });
    }
}]

exports.getInvoice = [validateRequest(['InvoiceId'], []), async (req, res, next) => {

    await IdVerifications.invoiceExists({InvoiceId: req.params.InvoiceId});
    try {
        let invoice = await Invoice.findAll({
            where: {
                id: req.params.InvoiceId
            }
        })
        res.status(200).send(invoice)
    } catch (err) {
        next(err);
    }
}]


exports.deleteInvoice = [validateRequest(['InvoiceId'], []), async (req, res, next) => {

    await IdVerifications.invoiceExists({InvoiceId: req.params.InvoiceId});
    try {
        await Invoice.destroy({
            where: {
                id: req.params.InvoiceId
            }
        })
        res.sendStatus(200)
    } catch (err) {
        next(err);
    }
}]

exports.updateInvoice = [validateRequest(['InvoiceId'], []), async (req, res, next) => {

    await IdVerifications.invoiceExists({InvoiceId: req.params.InvoiceId});
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
                id: req.params.id
            }
        })
        res.status(200).send(invoice)
    } catch (err) {
        next(err);
    }
}]
