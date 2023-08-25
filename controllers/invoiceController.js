const Invoice = require('../models/invoice');
const Employee = require('../models/employee');
const Person = require('../models/person');
const Product = require('../models/product');
const Customer = require('../models/customer');
const permissionOperations = require("../middleware/permissionCheck");
const IdVerifications = require("../middleware/idVerifications");
const validateRequest = require('../middleware/validateRequest');
const {generatePdf} = require("../middleware/generatePdf");
const {createFile, getFileFromS3} = require("../util/amazonS3");


exports.getAllDocuments = [validateRequest(['CompanyId', 'EmployeeId'], []), async (req, res, next) => {
    try {
        const {CompanyId, EmployeeId} = req.params;

        await IdVerifications.employeeExists({EmployeeId});
        await IdVerifications.companyExists({CompanyId});

        let hasPermission = await permissionOperations.hasPermission(EmployeeId, "all_invoices_access")
        let invoices;
        if (hasPermission) {
            invoices = await Invoice.findAll({
                where: {
                    CompanyId
                }, include: [{
                    model: Employee, include: {
                        model: Person, attributes: ['firstName', 'lastName']
                    }
                }, {
                    model: Customer,
                }]
            });
        } else {
            invoices = await Invoice.findAll({
                where: {
                    EmployeeId, CompanyId
                }, include: [{
                    model: Employee, include: {
                        model: Person, attributes: ['firstName', 'lastName']
                    }
                }, {
                    model: Customer,
                }]
            });
        }
        res.status(200).json({invoices});
    } catch (err) {
        next(err);
    }
}]

exports.createInvoice = [validateRequest(['EmployeeId'], []), async (req, res, next) => {
    await IdVerifications.employeeExists({EmployeeId: req.params.EmployeeId});
    try {
        const body = req.body[0];
        if (body.products && Array.isArray(body.products)) {

            const htmlString = body.html;
            const pdf = await generatePdf(htmlString);
            const {Location, Key} = await createFile(pdf, req.params.id);

            let invoice = await Invoice.create({
                documentNumber: body.documentNumber,
                currency: body.currency.value,
                paymentMethod: body.paymentMethod,
                validTo: body.validUntil,
                validFrom: body.validFrom,
                totalAmount: body.summary.totalAmount,
                paidAmount: body.paid,
                documentType: body.documentType,
                invoiceFileLink: Location,
                CustomerId: body.customer.id,
                EmployeeId: body.employee.id,
                CompanyId: body.companyDetails.id
            },
                {validate: true});


            for (let productData of body.products) {
                const product = await Product.findByPk(productData.product.id);
                if (product) {
                    await invoice.addProduct(product, { through: {
                            unit: productData.unit,
                            amount: productData.amount,
                            tax: productData.vat,
                            discount: productData.discount
                        } });
                }
            }

            res.status(200).send("success");
        } else {
            res.status(400).send({
                message: "Products can not be empty!"
            });
        }
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

exports.getCustomerInvoices = [validateRequest(['CustomerId'], []), async (req, res, next) => {

    await IdVerifications.customerExists({CustomerId: req.params.CustomerId});
    try {
        let invoices = await Invoice.findAll({
            where: {
                CustomerId: req.params.CustomerId
            }, include: [{
                model: Employee, include: {
                    model: Person, attributes: ['firstName', 'lastName']
                }
            }, {
                model: Customer,
            }]
        })
        res.status(200).send(invoices)
    } catch (err) {
        next(err);
    }

}]

exports.getInvoicePdf = [validateRequest(['InvoiceId'] , []), async (req, res, next) => {
    await IdVerifications.invoiceExists({InvoiceId: req.params.InvoiceId});
    try {

        const invoice = await Invoice.findByPk(req.params.InvoiceId)
        const file = await getFileFromS3(invoice.invoiceFileLink);
        if (!file) {
            res.status(500).send("Unable to fetch file from S3.");
            return;
        }
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename=invoice.pdf');

        res.send(file);
    } catch (err) {
        next(err)
    }
}]