const readFile = require('../middleware/readExcel');


exports.uploadFile = (req, res, next) => {
    if (!req.params.CompanyId) {
        res.status(400).json({ message: 'No CompanyId' });
        return;
    }

    if (!req.file ) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
    }
    try {
        const fileId = req.file.filename;  // multer automatically generates a unique filename
        res.send(fileId);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}




