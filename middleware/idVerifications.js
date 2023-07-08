const Employee = require("../models/employee");
const Company = require("../models/company");
const Invoice = require("../models/invoice");
const InvoiceDraft = require("../models/invoiceDraft");
const Category = require("../models/category");
const Invitation = require("../models/invitation");
const Customer = require("../models/customer");
const Product = require("../models/product");

const employeeExists = async ({EmployeeId}) => {
    let employee = await Employee.findByPk(EmployeeId);
    if (!employee) {
        throw new Error("User doesn't exist");
    }
    return true;
}

const companyExists = async ({CompanyId}) => {
    let company = await Company.findByPk(CompanyId);
    if (!company) {
        throw new Error("Company doesn't exist");
    }
    return true;
}

const invoiceExists = async ({InvoiceId}) => {
    let invoice = await Invoice.findByPk(InvoiceId);
    if (!invoice) {
        throw new Error("Invoice doesn't exist");
    }
    return true;
}

const invoiceDraftExists = async ({InvoiceDraftId}) => {
    let invoiceDraft = await InvoiceDraft.findByPk(InvoiceDraftId);
    if (!invoiceDraft) {
        throw new Error("Invoice draft doesn't exist");
    }
    return true;
}

const categoryExists = async ({CategoryId}) => {
    let category = await Category.findByPk(CategoryId);
    if (!category) {
        throw new Error("Category doesn't exist");
    }
    return true;
}

const customerExists = async ({CustomerId}) => {
    let customer = await Customer.findByPk(CustomerId);
    if (!customer) {
        throw new Error("Customer doesn't exist");
    }
    return true;
}

const productExists = async ({ProductId}) => {
    let product = await Product.findByPk(ProductId);
    if (!product) {
        throw new Error("Customer doesn't exist");
    }
    return true;
}

const inviteValid = async ({token}) => {
    let invitation = await Invitation.findOne({where: {token}});
    // check if invitation was created more than 1 our ago
    if (!invitation || (new Date() - invitation.createdAt) > 3600000) {
        //TODO: do not throw error
        throw new Error("Invitation expired");
    }
    return true;
}

const IdVerifications = {
    employeeExists: employeeExists,
    companyExists: companyExists,
    invoiceExists: invoiceExists,
    invoiceDraftExists: invoiceDraftExists,
    categoryExists: categoryExists,
    customerExists: customerExists,
    inviteValid: inviteValid,
    productExists: productExists
}

module.exports = IdVerifications;