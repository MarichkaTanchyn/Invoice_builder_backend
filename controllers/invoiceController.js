const Invoice = require('../models/invoice');
const InvoiceDraft = require('../models/invoiceDraft');
const Employee = require('../models/employee');
const Person = require('../models/person');
const permissionOperations = require("../middleware/permissionCheck");
const IdVerifications = require("../middleware/idVerifications");

exports.getAllDocuments = async (req, res, next) => {
    try {
        const {CompanyId, EmployeeId} = req.params;
        if (!CompanyId || !EmployeeId) {
            return res.status(400).send({
                message: "Content can not be empty!"
            });
        }
        await IdVerifications.userExists({EmployeeId});
        await IdVerifications.companyExists({CompanyId});

        let hasPermission = await permissionOperations.hasPermission(EmployeeId, "all_invoices_access")
        let invoices, drafts, documents;
        if (hasPermission) {
            invoices = await Invoice.findAll({
                where: {
                    CompanyId
                }
            });
            drafts = await InvoiceDraft.findAll({
                where: {
                    CompanyId
                }
            });
            documents = [...invoices, ...drafts];
        } else
            {
                invoices = await Invoice.findAll({
                    where: {
                        EmployeeId,
                        CompanyId
                    }
                });
                drafts = await InvoiceDraft.findAll({
                    where: {
                        EmployeeId,
                        CompanyId
                    }
                });
                documents = [...invoices, ...drafts];
            }
            res.status(200).json({documents});
        }
    catch
        (error)
        {
            res.status(500).send({
                message: error.message || "Some error occurred while retrieving documents."
            });
        }
    }

//todo: rewrite this function, its test function, in real one I will need more details
    exports.createInvoice = async (req, res, next) => {
        if (!req.params.EmployeeId) {
            res.status(400).send({
                message: "Content can not be empty!"
            });
            return;
        }
        console.log(req.params.EmployeeId)
        await IdVerifications.userExists({EmployeeId: req.params.EmployeeId});
        let employee = await Employee.findAll({
            include: {
                model: Person,
                required: true,
                where: {
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
                message:
                    error.message || "Some error occurred while creating INVOICE"
            });
        }
    }

    exports.getInvoice = async (req, res, next) => {
        if (!req.params.InvoiceId) {
            res.status(400).send({
                message: "Content can not be empty!"
            });
            return;
        }
        await IdVerifications.invoiceExists({InvoiceId: req.params.InvoiceId});
        try {
            let invoice = await Invoice.findAll({
                where: {
                    id: req.params.InvoiceId
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


    exports.deleteInvoice = async (req, res, next) => {
        if (!req.params.InvoiceId) {
            res.status(400).send({
                message: "ID can not be empty!"
            });
            return;
        }
        await IdVerifications.invoiceExists({InvoiceId: req.params.InvoiceId});
        try {
            let invoice = await Invoice.destroy({
                where: {
                    id: req.params.InvoiceId
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

    exports.updateInvoice = async (req, res, next) => {
        if (!req.params.InvoiceId) {
            res.status(400).send({
                message: "ID can not be empty!"
            });
            return;
        }
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
        } catch (error) {
            res.status(500).send({
                message:
                    error.message || "Some error occurred while update request"
            });
        }
    }
