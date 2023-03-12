const Employee = require("../models/employee");
const Person = require("../models/person");
const Permission = require("../models/Permission");
const permissionOperations = require("../middleware/permissionCheck");
const IdVerifications = require("../middleware/idVerifications");
const bcrypt = require("bcryptjs");

exports.getEmployeesInCompany = async (req, res) => {
    if (!req.params.id) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    await IdVerifications.companyExists({CompanyId: req.params.id});
    try {
        let employees = await Employee.findAll({
            include: [
                {
                    model: Person,
                    required: true,
                    where: {
                        CompanyId: req.params.id
                    }
                },
                {
                    model: Permission,
                    attributes: ['id', 'name'],
                    through: {
                        attributes: []
                    }
                }
            ]
        })
        res.status(200).send(employees)
    } catch (error) {
        res.status(500).send({
            message:
                error.message || "Some error occurred"
        });
    }
}

exports.addEmployee = async (req, res) => {
    if (!req.params.id) {
        res.status(400).send({
            message: "ID can not be empty!"
        });
        return;
    }
    if (!req.body.name || !req.body.surname) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
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
            PersonId: person.id,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8)
        }
        employee = await Employee.create(employee, {validate: true});
        if (req.body.permission) {
            console.log(req.body.permission)
            await permissionOperations.addPermission({EmployeeId: employee.id, permission: req.body.permission});
        }
        res.send(employee);
    } catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while creating the Employee."
        });
    }
}

exports.updatePerson = async (req, res) => {
    if (!req.params.id) {
        res.status(400).send({
            message: "ID can not be empty!"
        });
        return;
    }
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    await IdVerifications.userExists({EmployeeId: req.params.id});
    try {
        let person = {
            CompanyId: req.body.id,
            firstName: req.body.name,
            lastName: req.body.surname,
            middleName: req.body.middleName,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email

        }
        await Person.update(person, {
            where: {
                id: req.params.id
            }
        })
        let employee = await Employee.findAll({
            include: {
                model: Person,
                required: true,
                where: {
                    CompanyId: req.params.id,
                    id: req.params.id
                }
            },
        })
        //TODO: decide do I need to send fro update all permission which person should have or only additional ones.
        if (req.body.permission === "none") {
            await permissionOperations.deleteAllPermissions({EmployeeId: req.params.id});
        } else if (req.body.permission) {
            await permissionOperations.updatePermission({EmployeeId: req.params.id, permission: req.body.permission});
        }
        res.status(200).send(employee)
    } catch (error) {
        res.status(500).send({
            message:
                error.message || "Some error occurred while update request"
        });
    }
}

exports.deleteEmployee = async (req, res) => {
    if (!req.params.id) {
        res.status(400).send({
            message: "ID can not be empty!"
        });
        return;
    }
    await IdVerifications.userExists({EmployeeId: req.params.id});
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
    } catch (error) {
        res.status(500).send({
            message:
                error.message || "Some error occurred while delete request"
        });
    }
}
