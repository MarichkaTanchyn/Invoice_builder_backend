const db = require("../models");
const config = require("../util/auth.js");
const Employee = db.employee;
const Role = db.role;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const companyController = require('./companyController');

exports.signupNewCompany = (req, res) => {


}


exports.signupToExistingCompany = (req, res) => {
    if (!req.body.username || !req.body.email) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    const employee = {
        //TODO: take firm token to check firm
        firmName: req.body.firmName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    }
    Employee.create(employee)
        .then(employee => {
            if (req.body.roles) {
                Role.findAll({
                    where: {
                        name : req.body.roles
                    }
                }).then(roles => {
                    employee.setRoles(roles).then(() => {
                        res.send(employee);
                        // res.send({message: "Employee was registered successfully!"});
                    });
                });
            }
        })
        .catch(err => {
            res.status(500).send({message: err.message});
        });
};


exports.signIn = (req, res) => {
    console.log(req.body)
    Employee.findOne({
        where: {
            username: req.body.username
        }
    }
    )
        .then(employee => {
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
            employee.getRoles().then(roles => {
                for (let i = 0; i < roles.length; i++) {
                    authorities.push("ROLE_" + roles[i].name.toUpperCase());
                }
                res.status(200).send({
                    id: employee.id,
                    email: employee.email,
                    roles: authorities,
                    accessToken: token
                });
            });
        })
        .catch(err => {
            res.status(500).send({message: err.message});
        });
};