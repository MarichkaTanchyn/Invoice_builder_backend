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
const Permission = require("../models/permission");
const {transporter} = require("../util/nodemailer");


exports.companySignup = [validateRequest([], ['email', 'password', 'firmName']), async (req, res, next) => {

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
                    password: bcrypt.hashSync(req.body.password, 8),
                    accepted: true
                }
                employee = await Employee.create(employee, {validate: true});

                await permissionOperations.setAllPermissions(employee.PersonId)

                res.send({"message": "success"})
            } else {
                res.send({"message": "Email is not valid"});
            }
        } catch (err) {
            next(err);
        }
    }
}];


exports.employeeSignup = [validateRequest(['token'], ['email', 'password']), async (req, res, next) => {
    await IdVerifications.inviteValid({token: req.params.token});
    const emailVerified = await verifySignUp.checkDuplicateEmail(req.body.email);

    try {
        if (!emailVerified) {
            let invitation = await Invitation.findOne({
                where: {
                    token: req.params.token
                }
            });

            await IdVerifications.companyExists({CompanyId: invitation.CompanyId});

            const company = await Company.findByPk(invitation.CompanyId);

            const person = await Person.create({
                CompanyId: invitation.CompanyId,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                middleName: req.body.middleName,
                phoneNumber: req.body.phoneNumber,
                email: req.body.email
            }, {validate: true});

            await Employee.create({
                PersonId: person.id,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 8),
                accepted: false
            }, {validate: true});


            let employees = await Employee.findAll({
                include: [{
                    model: Person, where: {CompanyId: invitation.CompanyId}, attributes: [], // Exclude person attributes if not necessary.
                }, {
                    model: Permission, attributes: ['id', 'name'], through: {
                        attributes: []
                    }
                }]
            });

            employees.map(employee => {
                employee.Permissions.map(async permission => {
                    if (permission.name === "admin") {
                        await transporter.sendMail({
                            from: '"Invoice Builder" <invoice.builder01@gmail.com>',
                            to: employee.email,
                            subject: 'New Employee Approval Request',
                            text: `Dear Manager,

                        A new employee, ${person.firstName} ${person.lastName} with the email ${person.email}, is requesting to join your ${company.firmName} company account.
                        
                        Please log in to your account settings to review and approve this request: http://localhost:3001/settings
                        
                        Once there, navigate to the 'Accounts' tab and click the 'Accept' button next to the user's information.
                        
                        Best regards,
                        The Invoice Builder Team`,
                            html: `
                            <div style="font-family: Arial, sans-serif; color: #333;">
                                <h2 style="color: #2a7ae2;">New Employee Approval Request</h2>
                                <p>Dear Manager,</p>
                                <p>A new employee, <strong>${person.firstName} ${person.lastName}</strong> with the email <strong>${person.email}</strong>, is requesting to join your ${company.firmName} company account.</p>
                                <p>Please log in to your account settings to review and approve this request by clicking the button below:</p>
                                <a href="http://localhost:3001/settings" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #2a7ae2; text-decoration: none; border-radius: 5px;">Go to Settings</a>
                                <p>Once there, navigate to the 'Accounts' tab and click the 'Accept' button next to the user's information.</p>
                                <p>If you have any questions or require further assistance, please do not hesitate to contact us.</p>
                                <p>Best regards,</p>
                                <p><strong>The Invoice Builder Team</strong></p>
                            </div>`,
                        });
                    }
                })
            })

            await Invitation.destroy({
                where: {
                    id: invitation.id
                }
            });

            res.send("success");
        } else {
            res.send(emailVerified);
        }

    } catch (err) {
        next(err);
    }
}]


exports.signIn = [validateRequest([], ['email', 'password']), async (req, res, next) => {
    console.log(req.body)
    try {

        let employee = await Employee.findOne({
            where: {
                email: req.body.email
            }
        });

        if (!employee) {
            return res.status(404).send({message: "Employee Not found."});
        }

        if (employee.accepted) {
            let person = await Person.findAll({
                where: {
                    email: req.body.email
                }
            })

            if (!bcrypt.compareSync(req.body.password, employee.password)) {
                return res.send({
                    accessToken: null, message: "Invalid login or password!"
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
        } else {
            res.status(200).send({message: "Employee not accepted yet."});
        }
    } catch (err) {
        next(err);
    }
}];

exports.createInvite = [validateRequest(['CompanyId'], []), async (req, res, next) => {
    await IdVerifications.companyExists({CompanyId: req.params.CompanyId});
    try {
        res.json({token: await generateToken(req.params.CompanyId)});
    } catch (err) {
        next(err);
    }
}]

exports.sendRegisterLinkViaEmail = [validateRequest(['CompanyId'], ['email']), async (req, res, next) => {
    const email = req.body.email;
    await IdVerifications.companyExists({CompanyId: req.params.CompanyId});

    try {
        const token = await generateToken(req.params.CompanyId);
        const link = `http://localhost:3001/userSignUp/${token}`;

        const company = await Company.findByPk(req.params.CompanyId);

        const info = await transporter.sendMail({
            from: '"Invoice Builder" <invoice.builder01@gmail.com>',
            to: email,
            subject: 'Registration Invitation',
            text: `Dear User,
            We're excited to invite you to register at the ${company.firmName} company portal. 
            
            You can get started with your registration by following this link: ${link}
            
            Best regards,
            The Invoice Builder Team`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2 style="color: #2a7ae2;">Registration Invitation</h2>
                    <p>Dear User,</p>
                    <p>We're excited to invite you to register at the <strong>${company.firmName}</strong> company portal. </p>
                    <p>You can get started with your registration by clicking the button below:</p>
                    <a href="${link}" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #2a7ae2; text-decoration: none; border-radius: 5px;">Register Now</a>
                    <p>If you have any questions or require further assistance, please do not hesitate to contact us.</p>
                    <p>Best regards,</p>
                    <p><strong>The Invoice Builder Team</strong></p>
                </div>`,
        });
        res.status(200).send({message: "Email sent, id: " + info.messageId});
    } catch (err) {
        next(err);
    }
}];

exports.acceptEmployee = [validateRequest(['EmployeeId'], []), async (req, res, next) => {
    try {
        await IdVerifications.employeeExists({EmployeeId: req.params.EmployeeId});

        await Employee.update({
            accepted: true
        }, {
            where: {
                id: req.params.EmployeeId
            },
        });

        const employee = await Employee.findByPk(req.params.EmployeeId, {
            include: [{
                model: Person, required: true,
            }]
        });

        const company = await Company.findByPk(employee.Person.CompanyId);

        await transporter.sendMail({
            from: '"Invoice Builder" <invoice.builder01@gmail.com>',
            to: employee.email,
            subject: 'Account Activation Successful',
            text: `Dear ${employee.Person.firstName} ${employee.Person.lastName},

            We are pleased to inform you that your account linked to ${company.firmName} has been successfully activated. 

            You can now access your account by following this link: http://localhost:3001/login

            Best regards,
            The Invoice Builder Team`,
            html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #2a7ae2;">Dear ${employee.firstName} ${employee.lastName},</h2>
                <p>We are pleased to inform you that your account linked to <strong>${company.firmName}</strong> has been successfully activated.</p>
                <p>You can now access your account by clicking the button below:</p>
                <a href="http://localhost:3001/login" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #2a7ae2; text-decoration: none; border-radius: 5px;">Login to Your Account</a>
                <p>If you have any questions or require further assistance, please do not hesitate to contact us.</p>
                <p>Best regards,</p>
                <p><strong>The Invoice Builder Team</strong></p>
            </div>`,
        });

        res.status(200).send({message: "Employee accepted"});

    } catch (err) {
        next(err);
    }
}]

const generateToken = async (companyId) => {

    const token = jwt.sign({companyId}, config.secret, {
        expiresIn: '1h'
    });

    await Invitation.create({
        token, CompanyId: companyId
    });

    return token;
}