const db = require("../models");
const User = db.user;

exports.allUsers = (req, res) => {
    User.findAll().then(users => {
            res.status(200).send(users)
        }
    )
};
exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
};
exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
};
exports.moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content.");
};