const validateRequest = require('../middleware/validateRequest');

exports.uploadFile = [validateRequest(['CompanyId'], []), async (req, res, next) => {
    if (!req.file) {
        res.status(400).json({message: 'No file uploaded'});
        return;
    }
    try {
        const fileId = req.file.filename;  // multer automatically generates a unique filename
        res.send(fileId);
    } catch (err) {
        next(err);
    }
}]

