const jwt = require("jsonwebtoken");
const config = require("../util/auth");
const db = require("../models");
const Session = db.session;

const authorize = async (req, res, next) => {
    // Get the token from the 'Authorization' header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }

    jwt.verify(token, config.secret, async (err, decoded) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).send({ message: "Token expired!" });
            } else {
                return res.status(401).send({ message: "Token is invalid!" });
            }
        }

        // Check if the token exists in the Session table
        const session = await Session.findOne({ where: { token: token } });
        if (!session) {
            return res.status(401).send({ message: "Session not found in database!" });
        }

        // Call the next middleware function
        next();
    });

};
const authJwt = {
    authorize: authorize,
};
module.exports = authJwt;