const db = require("../models");
const config = require("../util/auth.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Employee = db.employee;
const Company = db.company;
const Person = db.person;
const Session = db.session;
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
                    CompanyId: company.id, email: req.body.email.toLowerCase()
                }
                person = await Person.create(person, {validate: true});

                let employee = {
                    PersonId: person.id, email: req.body.email.toLowerCase(), password: bcrypt.hashSync(req.body.password, 8)
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
            email: req.body.email
        }
    });

    let person = await Person.findAll({
        where: {
            email: req.body.email
        }
    })

    if (!employee) {
        return res.status(404).send({message: "Employee Not found."});
    }
    let passwordIsValid = bcrypt.compareSync(req.body.password, employee.password);
    if (!passwordIsValid) {
        return res.status(401).send({
            accessToken: null, message: "Invalid Password!"
        });
    }

    // JWT Token generation
    let token = jwt.sign({id: employee.id}, config.secret, {
        expiresIn: 86400 // 24 hours
    });

    // Session creation and storage in database
    let session = await Session.create({
        token: token,
        lastAccess: new Date(),
        EmployeeId: employee.id
    });

    if (!session) {
        return res.status(500).send({message: "Failed to create session."});
    }

    let authorities = [];
    let permissions = await permissionOperations.getEmployeePermissions(employee.id)

    for (let i = 0; i < permissions.length; i++) {
        authorities.push("PERMISSION_" + permissions[i].name.toUpperCase());
    }

    res.status(200).send({
        employeeId: employee.id,
        companyId: person[0].CompanyId,
        email: employee.email,
        roles: authorities,
        accessToken: token
    });
};