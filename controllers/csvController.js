const {join} = require("path");
const fs = require('fs').promises;
const {readDataFromExcelSheet} = require("../middleware/readExcel");

exports.readExcel = async (req, res, next) => {
    if (!req.params.fileKey) {
        res.status(400).json({message: 'No fileKey'});
        return;
    }
    if (!req.body) {
        res.status(400).json({message: 'No body'});
        return;
    }
    try {
        const sheetHeaderJson = req.body;
        const fileId = req.params.fileKey;
        const file = join(__dirname, '..', 'uploads', fileId);
        const bufferedFile = await fs.readFile(file);

        let data = [];
        for (let key in sheetHeaderJson) {
            const sheetData = await readDataFromExcelSheet(bufferedFile, sheetHeaderJson[key], key);
            data.push(sheetData);
        }
        res.send(data);

    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Internal Server Error'});
    }
}

exports.preprocessData = async (req, res, next) => {

    if (!req.params.fileKey) {
        res.status(400).json({message: 'No fileKey'});
        return;
    }

    if (!req.body) {
        res.status(400).json({message: 'No body'});
        return;
    }

    for (let key in req.body) {
        // if it contains a originalSheetName then it is -> create new category from sheet
        // else it is upload products to category
    }

    try {

    } catch (err) {

    }

    // got data edited by the user, change needed columns names or smth else, then check data fromat and push to database
}