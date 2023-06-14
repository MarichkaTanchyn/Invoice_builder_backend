module.exports = (requiredParams, requiredBody) => {
    return (req, res, next) => {
        const missingParams = requiredParams.filter(param => !req.params[param]);
        const missingBody = requiredBody.filter(body => !req.body[body]);

        if (missingParams.length > 0) {
            res.status(400).json({message: `Missing required parameters: ${missingParams.join(', ')}`});
            return;
        }

        if (missingBody.length > 0) {
            res.status(400).json({message: `Missing required body content: ${missingBody.join(', ')}`});
            return;
        }

        next();
    };
};