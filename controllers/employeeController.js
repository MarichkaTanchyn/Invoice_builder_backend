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

exports.addEmployee = [validateRequest(['id'], ['name', 'surname']), async (req, res, next) => {

    await IdVerifications.companyExists({CompanyId: req.params.id});
    try {
        // let emailExists = Employee.findAll({where: {email: req.body.email}})
        // if (!emailExists.empty) {
        //     res.status(400).send({
        //         message: "Email already exists!"
        //     });
        //     return;
        // }
        let person = {
            CompanyId: req.params.id,
            firstName: req.body.name,
            lastName: req.body.surname,
            middleName: req.body.middleName,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email
        }
        person = await Person.create(person, {validate: true});
        let employee = {
            PersonId: person.id, email: req.body.email, password: bcrypt.hashSync(req.body.password, 8)
        }
        employee = await Employee.create(employee, {validate: true});
        if (req.body.permission) {
            console.log(req.body.permission)
            await permissionOperations.addPermission({EmployeeId: employee.id, permission: req.body.permission});
        }
        res.send(employee);
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

        if (req.body.permission === "none") {
            await permissionOperations.deleteAllPermissions({EmployeeId: req.params.id});
        } else if (req.body.permission) {
            await permissionOperations.updatePermission({EmployeeId: req.params.id, permission: req.body.permission});
        }

        res.status(200).send(employee)
    } catch (err) {
        next(err);
    }
}]

exports.deleteEmployee = [validateRequest(['id'], []), async (req, res, next) => {

    await IdVerifications.employeeExists({EmployeeId: req.params.id});
    try {
        await Employee.destroy({
            where: {
                id: req.params.id
            }
        })
        await Person.destroy({
            where: {
                id: req.params.id
            }
        })
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
}]
