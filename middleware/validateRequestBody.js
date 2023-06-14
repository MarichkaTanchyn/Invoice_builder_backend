module.exports = (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        res.status(400).json({message: "Request body cannot be empty"});
        return;
    }
    next();
};