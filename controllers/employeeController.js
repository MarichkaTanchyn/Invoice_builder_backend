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