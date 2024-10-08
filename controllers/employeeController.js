const Employee = require("../models/employee");
const Person = require("../models/person");
const Permission = require("../models/permission");
const permissionOperations = require("../middleware/permissionCheck");
const IdVerifications = require("../middleware/idVerifications");
const bcrypt = require("bcryptjs");
const validateRequest = require('../middleware/validateRequest');

exports.getEmployeesInCompany = [validateRequest(['id'], []), async (req, res, next) => {

    await IdVerifications.companyExists({CompanyId: req.params.id});
    try {
        let employees = await Employee.findAll({
            include: [{
                model: Person, required: true, where: {
                    CompanyId: req.params.id
                }
            }, {
                model: Permission, attributes: ['id', 'name'], through: {
                    attributes: []
                }
            }]
        })
        res.status(200).send(employees)
    } catch (err) {
        next(err);
    }
}]

exports.getEmployee = [validateRequest(['id'], []), async (req, res, next) => {

    await IdVerifications.employeeExists({EmployeeId: req.params.id});

    try {
        const employee = await Employee.findByPk(req.params.id, {
            include: [{
                model: Person, required: true
            }]
        });
        res.status(200).send(employee.Person);
    } catch (err) {
        next(err);
    }

}]


exports.updateEmployeePerson = [validateRequest(['id'], []), async (req, res, next) => {

    await IdVerifications.employeeExists({EmployeeId: req.params.id});
    try {

        let person = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            middleName: req.body.middleName,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email
        }

        // Update the Person where id is the associated Person's id.
        await Person.update(person, {
            where: {
                id: req.body.id
            }
        })

        // Retrieve the updated employee and associated person.
       const employee = await Employee.findByPk(req.params.id, {
            include: [{
                model: Person, required: true
            }]
        });

        res.status(200).send(employee)
    } catch (err) {
        next(err);
    }
}]

exports.deleteEmployee = [validateRequest(['EmployeeId'], []), async (req, res, next) => {

    await IdVerifications.employeeExists({EmployeeId: req.params.EmployeeId});
    try {

        const employee = await Employee.findByPk(req.params.EmployeeId)

        await Employee.destroy({
            where: {
                id: req.params.EmployeeId
            }
        })
        await Person.destroy({
            where: {
                id: employee.PersonId
            }
        })
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
}]

exports.updateEmployeePermissions = [validateRequest(['EmployeeId'], ['permissions']), async (req, res, next) => {
    await IdVerifications.employeeExists({EmployeeId: req.params.EmployeeId});
    try {
        if (req.body.permissions === []) {
            await permissionOperations.deleteAllPermissions({EmployeeId: req.params.EmployeeId});
        } else if (req.body) {
            await permissionOperations.updatePermission({EmployeeId: req.params.EmployeeId, permissions: req.body.permissions});
        }
        res.send("success");
    } catch (err) {
        next(err);
    }
}]