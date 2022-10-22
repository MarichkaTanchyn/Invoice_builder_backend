const db = require("../models");
const config = require("../util/auth.js");
const User = db.user;
const Role = db.role;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = (req, res) => {

    if (!req.body.username || !req.body.email) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    const user = {
        username: req.body.username,
        firmName: req.body.firmName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    }

    User.create(user)
        .then(user => {
            if (req.body.roles) {
                Role.findAll({
                    where: {
                        name : req.body.roles
                    }
                }).then(roles => {
                    user.setRoles(roles).then(() => {
                        res.send(user);
                        // res.send({message: "User was registered successfully!"});
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
    User.findOne({
        where: {
            username: req.body.username
        }
    }

    )
        .then(user => {
            console.log(user);
            if (!user) {
                return res.status(404).send({message: "User Not found."});
            }
            let passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );
            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }
            let token = jwt.sign({id: user.id}, config.secret, {
                expiresIn: 86400 // 24 hours
            });
            let authorities = [];
            user.getRoles().then(roles => {
                for (let i = 0; i < roles.length; i++) {
                    authorities.push("ROLE_" + roles[i].name.toUpperCase());
                }
                res.status(200).send({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    roles: authorities,
                    accessToken: token
                });
            });
        })
        .catch(err => {
            res.status(500).send({message: err.message});
        });
};