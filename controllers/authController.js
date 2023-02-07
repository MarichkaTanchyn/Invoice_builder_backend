const db = require("../models");
const config = require("../util/auth.js");
const Employee = db.employee;
const Role = db.role;
const Company = db.company;
const Person = db.person;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


exports.signup = async (req, res) => {
    if (!req.body.password || !req.body.email || !req.body.firmName) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    if (req.body.token) {
        //TODO register a new user to existed company
    } else {
        try {
            let company = {
                firmName: req.body.firmName,
            }
            company = await Company.create(company, {validate: true});
            let person = {
                CompanyId: company.id,
                email: req.body.email
            }
            person = await Person.create(person, {validate: true});
            let employee = {
                PersonId: person.id,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 8)
            }
            employee = await Employee.create(employee, {validate: true});
            res.send({
                "company": company,
                "person": person,
                "employee": employee
            });
        } catch (error) {
            console.error(error);
        }
    }
};


exports.signIn = async (req, res) => {
    console.log(req.body)
    let employee = await Employee.findOne({
            where: {
                username: req.body.username
            }
        }
    );

    console.log(employee);
    if (!employee) {
        return res.status(404).send({message: "Employee Not found."});
    }
    let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        employee.password
    );
    if (!passwordIsValid) {
        return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!"
        });
    }
    let token = jwt.sign({id: employee.id}, config.secret, {
        expiresIn: 86400 // 24 hours
    });
    let authorities = [];
    let roles = employee.getRoles();

    for (let i = 0; i < roles.length; i++) {
        authorities.push("ROLE_" + roles[i].name.toUpperCase());
    }
    res.status(200).send({
        id: employee.id,
        email: employee.email,
        roles: authorities,
        accessToken: token
    });


};