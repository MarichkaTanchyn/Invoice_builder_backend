const Employee = require("../models/employee");
const Person = require("../models/person");
const {where} = require("sequelize");

exports.getEmployeesInCompany = async (req, res) => {
    if (!req.params.id) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    try {
        let employees = await Employee.findAll({
            include: {
                model: Person,
                required: true,
                where: {
                    CompanyId : req.params.id
                }},
        })
        res.status(200).send(employees)
    }catch (error) {
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
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    try {
        let employee = {
            name: req.body.name,
            surname: req.body.surname,
            CompanyId: req.params.id
        }
        employee = await Employee.create(employee)
        res.send(employee);
    } catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while creating the Employee."
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
    try {
        let employee = await Employee.destroy({
            where: {
                id : req.params.id
            }
        })
        res.status(200).send(employee)
    } catch (error) {
        res.status(500).send({
            message:
                error.message || "Some error occurred while delete request"
        });
    }
}
exports.updateEmployee = async (req, res) => {
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
    try {
        let employee = {
            name: req.body.name,
            surname: req.body.surname,
        }
        employee = await Employee.update(employee, {
            where: {
                id : req.params.id
            }
        })
        res.status(200).send(employee)
    } catch (error) {
        res.status(500).send({
            message:
                error.message || "Some error occurred while update request"
        });
    }
}