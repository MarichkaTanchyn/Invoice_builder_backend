const validateRequest = require('../middleware/validateRequest');
const Customer = require("../models/customer");
const Person = require("../models/person")
const IdVerifications = require("../middleware/idVerifications");

exports.getCompanyCustomers = [validateRequest(['CompanyId'],[]),  async (req, res, next) => {
    try {
        await IdVerifications.companyExists({CompanyId: req.params.CompanyId});
        const Customers = await Customer.findAll({
            include: [{
                model: Person, required: true, where: {
                    CompanyId: req.params.CompanyId
                }
            }]
        })

        res.status(200).send(Customers)

    } catch (err) {
        next(err);
    }

}]

exports.addCustomer = [validateRequest(['CompanyId', ],[]), async (req, res, next) => {
    try {
        await IdVerifications.companyExists({CompanyId: req.params.CompanyId});

        const customer = await Customer.create({
            name: req.body.name,
            description: req.body.description,
            companyNumber: req.body.companyNumber,
            country: req.body.country,
            city: req.body.city,
            street: req.body.street,
            postalCode: req.body.postalCode,
            nip: req.body.nip,
            address: req.body.address,
            CompanyId: req.params.CompanyId,
            Person: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                middleName: req.body.middleName,
                phoneNumber: req.body.phoneNumber,
                email: req.body.email,
                CompanyId: req.params.CompanyId
            }
        }, {
            include: [Person]
        })
        res.status(200).send(customer)

    } catch (err) {
        next(err);
    }
}]

exports.getCustomer = [validateRequest(['CustomerId', ],[]), async (req, res, next) => {
    try {
        await IdVerifications.customerExists({CustomerId: req.params.CustomerId});
        const customer = await Customer.findByPk(req.params.CustomerId, {
            include: [{
                model: Person, required: true
            }]

        });
        res.status(200).send(customer);
    } catch (err) {
        next(err);
    }
}]

