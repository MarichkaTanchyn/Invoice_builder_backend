const {join} = require("path");
const fs = require('fs').promises;
const {readDataFromExcelSheet, processSheetData, processSheetDataForCategory} = require("../middleware/readExcel");

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

exports.preprocessSelectedSheetData = async (req, res, next) => {
    if (!req.params.fileKey) {
        res.status(400).json({message: 'No fileKey'});
        return;
    }

    if (!req.body) {
        res.status(400).json({message: 'No body'});
        return;
    }

    const fileHeaders = req.body.data;
    const fileId = req.params.fileKey;

    try {
        const data = await processSheetData(fileId, fileHeaders);
    } catch (err) {
    }
}

exports.createNewCategoryFromSheet = async (req, res, next) => {
    if (!req.params.fileKey) {
        res.status(400).json({message: 'No fileKey'});
        return;
    }

    if (!req.body) {
        res.status(400).json({message: 'No body'});
        return;
    }

    const fileHeaders = req.body.data;
    const fileId = req.params.fileKey;

    try {
        const categories = await processSheetDataForCategory(fileId, fileHeaders);

        // console.log(categories)
    } catch (err) {
    }

}