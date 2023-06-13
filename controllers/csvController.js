const { join } = require("path");
const fs = require("fs").promises;
const {
  readDataFromExcelSheet,
  processSheetData,
  processSheetDataForCategory,
  validateSheetData,
  validateAllSheetsData,
} = require("../middleware/readExcel");

exports.readExcel = async (req, res, next) => {
  if (!req.params.fileKey) {
    res.status(400).json({ message: "No fileKey" });
    return;
  }
  if (!req.body) {
    res.status(400).json({ message: "No body" });
    return;
  }
  try {
    const sheetHeaderJson = req.body;
    const fileId = req.params.fileKey;
    const file = join(__dirname, "..", "uploads", fileId);
    const bufferedFile = await fs.readFile(file);

    let data = [];
    for (let key in sheetHeaderJson) {
      const sheetData = await readDataFromExcelSheet(
        bufferedFile,
        sheetHeaderJson[key],
        key
      );
      data.push(sheetData);
    }
    res.send(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.preprocessSelectedSheetData = async (req, res, next) => {
  if (!req.params.fileKey) {
    res.status(400).json({ message: "No fileKey" });
    return;
  }

  if (!req.body) {
    res.status(400).json({ message: "No body" });
    return;
  }

  try {
    const fileHeaders = req.body.data;
    const fileId = req.params.fileKey;

    console.log(fileHeaders);
    console.log(fileId);

    const validationError = await validateSheetData(fileId, fileHeaders);
    if (validationError) {
      console.log("here", validationError);
      res.status(200).json({ message: validationError });
      return;
    }

    const data = await processSheetData(fileId, fileHeaders);
    console.log(data);
    res.send(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.createNewCategoryFromSheet = async (req, res, next) => {
  if (!req.params.fileKey) {
    res.status(400).json({ message: "No fileKey" });
    return;
  }

  if (!req.body) {
    res.status(400).json({ message: "No body" });
    return;
  }

  try {
    const fileHeaders = req.body.data;
    const fileId = req.params.fileKey;

    const validationErrors = await validateAllSheetsData(fileId, fileHeaders);
    if (validationErrors) {
      console.log("here", validationErrors);
      res.status(200).json({ message: validationErrors.join("\n") });
      return;
    }
    const categories = await processSheetDataForCategory(fileId, fileHeaders);
    res.send("success");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
