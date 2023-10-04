const validateRequest = require('../middleware/validateRequest');
const Customer = require("../models/customer");
const Person = require("../models/person")
const IdVerifications = require("../middleware/idVerifications");

exports.getCompanyCustomers = [validateRequest(['CompanyId'], []), async (req, res, next) => {
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

exports.addCustomer = [validateRequest(['CompanyId',], []), async (req, res, next) => {
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
                firstName: req.body.Person.firstName,
                lastName: req.body.Person.lastName,
                middleName: req.body.Person.middleName,
                phoneNumber: req.body.Person.phoneNumber,
                email: req.body.Person.email,
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

exports.getCustomer = [validateRequest(['CustomerId',], []), async (req, res, next) => {
    try {
        await IdVerifications.customerExists({CustomerId: req.params.CustomerId});
        const customer = await findCustomerWithPerson(req.params.CustomerId);
        res.status(200).send(customer);
    } catch (err) {
        next(err);
    }
}]


exports.updateCustomer = [
    validateRequest(['CustomerId'], []),
    async (req, res, next) => {

        const { params, body } = req;
        const { CustomerId } = params;
        const { name, description, companyNumber, country, city, street, postalCode, nip, address, Person } = body;
        const { firstName, lastName, middleName, phoneNumber, email } = Person;

        try {
            await IdVerifications.customerExists({ CustomerId });

            // Get the customer instance
            let customerInstance = await findCustomerWithPerson(CustomerId);

            // If no customer instance is found, return an error
            if (!customerInstance) {
                res.status(404).send({ error: 'Customer not found' });
                return;
            }

            // Update the customer and person instance
            await customerInstance.update({ name, description, companyNumber, country, city, street, postalCode, nip, address });
            await customerInstance.Person.update({ firstName, lastName, middleName, phoneNumber, email });

            // Fetch the updated customer
            let updatedCustomer = await findCustomerWithPerson(CustomerId);

            // Send updated customer as the response
            res.status(200).send(updatedCustomer);
        } catch (err) {
            next(err);
        }
    },
];

const findCustomerWithPerson = async (customerId) => {
    return await Customer.findByPk(customerId,{
        include: [Person],
    });
};

exports.deleteCustomer  = [
    validateRequest(['CustomerId'], []),
    async (req, res, next) => {

        try {
            await IdVerifications.customerExists({CustomerId: req.params.CustomerId});
            const customer = await Customer.findByPk(req.params.CustomerId)

            await Customer.destroy({
                where: {
                    id: req.params.CustomerId
                }
            })
            await Person.destroy({
                where: {
                    id: customer.PersonId
                }
            })
            res.sendStatus(200);
        } catch (err) {
            next(err);
        }

    }]