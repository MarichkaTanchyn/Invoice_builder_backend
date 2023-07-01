const db = require("../models");
const config = require("../util/auth.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Employee = db.employee;
const Company = db.company;
const Person = db.person;
const permissionOperations = require("../middleware/permissionCheck");
const validateRequest = require('../middleware/validateRequest');
const verifySignUp = require("../middleware/verifySignUp");


exports.signup = [validateRequest([], ['email', 'password', 'firmName']), async (req, res) => {

    const emailIsValid = await verifySignUp.checkDuplicateEmail(req.body.email);

    console.log(emailIsValid)
    if (req.body.token) {
        //TODO register a new user to existed company
    } else {
        try {
            if (!emailIsValid) {
                let company = {
                    firmName: req.body.firmName,
                }
                company = await Company.create(company, {validate: true});

                let person = {
                    CompanyId: company.id, email: req.body.email
                }
                person = await Person.create(person, {validate: true});

                let employee = {
                    PersonId: person.id, email: req.body.email, password: bcrypt.hashSync(req.body.password, 8)
                }
                employee = await Employee.create(employee, {validate: true});

                await permissionOperations.setAllPermissions(employee.PersonId)

                let permissions = await permissionOperations.getEmployeePermissions(employee.PersonId)
                // res.send({
                //     "company": company, "person": person, "employee": [employee, permissions]
                // });
                res.send({"message": "success"})
            } else {
                res.send(emailIsValid);
            }
        } catch (err) {
            next(err);
        }
    }
}];


exports.signIn = async (req, res) => {
    console.log(req.body)
    let employee = await Employee.findOne({
        where: {
            username: req.body.username
        }
    });

    console.log(employee);
    if (!employee) {
        return res.status(404).send({message: "Employee Not found."});
    }
    let passwordIsValid = bcrypt.compareSync(req.body.password, employee.password);
    if (!passwordIsValid) {
        return res.status(401).send({
            accessToken: null, message: "Invalid Password!"
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
        id: employee.id, email: employee.email, roles: authorities, accessToken: token
    });
};