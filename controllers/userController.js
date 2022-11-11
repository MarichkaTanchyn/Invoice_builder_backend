const db = require("../models");
const User = db.user;

exports.allUsers = (req, res) => {
    User.findAll().then(users => {
            res.status(200).send(users)
        }
    )
};