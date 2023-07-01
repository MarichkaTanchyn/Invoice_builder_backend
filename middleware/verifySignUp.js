const db = require("../models");
const User = db.employee;



checkDuplicateEmail = async (email) => {
    return await User.findOne({
        where: {
            email: email
        }
    }).then(user => {
        if (user) {
            return ({
                message: "Email is already in use!"
            });
        } else {
            return null;
        }
    });
};

const verifySignUp = {
    checkDuplicateEmail: checkDuplicateEmail,
}

module.exports = verifySignUp;