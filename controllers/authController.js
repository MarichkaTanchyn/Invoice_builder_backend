const db = require("../models");
const config = require("../util/auth.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Employee = db.employee;
const Company = db.company;
const Person = db.person;
const Session = db.session;
const Invitation = db.invitation;
const permissionOperations = require("../middleware/permissionCheck");
const validateRequest = require('../middleware/validateRequest');
const verifySignUp = require("../middleware/verifySignUp");
const IdVerifications = require("../middleware/idVerifications");
const nodemailer = require('nodemailer');



exports.companySignup = [validateRequest([], ['email', 'password', 'firmName']), async (req, res) => {

    const emailIsValid = await verifySignUp.checkDuplicateEmail(req.body.email);

    console.log(emailIsValid)
    if (req.body.token) {
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
                    PersonId: person.id,
                    email: req.body.email.toLowerCase(),
                    password: bcrypt.hashSync(req.body.password, 8)
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


exports.employeeSignup = [validateRequest(['token'], ['email', 'password']), async (req, res) => {

    await IdVerifications.inviteValid({token: req.params.token});
    // const emailIsValid = await verifySignUp.checkDuplicateEmail(req.body.email);
    console.log(req.body)
    console.log(req.params)

    try {
        let invitation = await Invitation.findOne({
            where: {
                token : req.params.token
            }
        });

        await IdVerifications.companyExists({CompanyId: invitation.CompanyId});

        let person = {
            CompanyId: invitation.CompanyId,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            middleName: req.body.middleName,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email
        }
        person = await Person.create(person, {validate: true});
        let employee = {
            PersonId: person.id, email: req.body.email, password: bcrypt.hashSync(req.body.password, 8)
        }
        employee = await Employee.create(employee, {validate: true});

        await Invitation.destroy({
            where: {
                id : invitation.id
            }
        });

        res.send("success");
    } catch (err) {
        next(err);
    }
}]


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
        token: token, lastAccess: new Date(), EmployeeId: employee.id
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

exports.createInvite = [validateRequest(['CompanyId'], []), async (req, res, next) => {
    await IdVerifications.companyExists({ CompanyId: req.params.CompanyId });
    try {
        res.json( {token : await generateToken(req.params.CompanyId)});
    } catch (err) {
        next(err);
    }
}]

exports.sendRegisterLinkViaEmail = [validateRequest(['CompanyId'], ['email']), async (req, res, next) => {
    const email = req.body.email;
    await IdVerifications.companyExists({ CompanyId: req.params.CompanyId });

    try {
        const token = await generateToken(req.params.CompanyId);
        const link = `http://localhost:3001/userSignUp/${token}`;

        const company = await Company.findByPk(req.params.CompanyId);

        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'invoice.builder01@gmail.com',
                pass: 'gsdcwojixhrrzxkw'
            },
        });

        let info = await transporter.sendMail({
            from: '"Invoice Builder" <invoice.builder01@gmail.com>', // Make sure to use the correct email here as well
            to: email,
            subject: 'Register Link',
            text: `Register Link to ${company.firmName} company`,
            html: `<b>Register Link to ${company.firmName} company</b><br><a href="${link}">Click to register</a>`,
        });

        res.status(200).send({message: "Email sent, id: " + info.messageId});
    } catch (err) {
        next(err);
    }
}];


const generateToken = async (companyId) => {

    const token = jwt.sign({ companyId }, config.secret, {
        expiresIn: '1h'
    });

    await Invitation.create({
        token,
        CompanyId: companyId
    });

    return token;
}