const {join} = require("path");
const fs = require("fs").promises;
const Product = require("../models/product");
const Category = require("../models/category");
const IdVerifications = require("../middleware/idVerifications");

const {
    readDataFromExcelSheet,
    processSheetData,
    processSheetDataForCategory,
    validateSheetData,
    validateAllSheetsData,
    prepareProductData,
} = require("../middleware/readExcel");

exports.readExcel = async (req, res, next) => {
    if (!req.params.fileKey) {
        res.status(400).json({message: "No fileKey"});
        return;
    }
    if (!req.body) {
        res.status(400).json({message: "No body"});
        return;
    }
    try {
        const sheetHeaderJson = req.body;
        const fileId = req.params.fileKey;
        const file = join(__dirname, "..", "uploads", fileId);
        const bufferedFile = await fs.readFile(file);

        let data = [];
        for (let key in sheetHeaderJson) {
            const sheetData = await readDataFromExcelSheet(bufferedFile, sheetHeaderJson[key], key);
            data.push(sheetData);
        }
        res.send(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Internal Server Error"});
    }
};

exports.preprocessSelectedSheetData = async (req, res, next) => {
    if (!req.params.fileKey) {
        res.status(400).json({message: "No fileKey"});
        return;
    }

    if (!req.body) {
        res.status(400).json({message: "No body"});
        return;
    }

    try {
        const fileHeaders = req.body.data;
        const categoryId = req.body.categoryId;
        const fileId = req.params.fileKey;
        const headers = req.body.headersRow;

        for (let key in headers) {
            const validationError = await validateSheetData(fileId, fileHeaders, headers[key]);
            if (validationError) {
                console.log("here", validationError);
                res.status(200).json({message: validationError});
                return;
            }

            const data = await processSheetData(fileId, fileHeaders, headers[key]);
            const products = data.map((productData) => prepareProductData(productData, categoryId));
            await Product.bulkCreate(products[0]);
        }
        res.send("success");
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Internal Server Error"});
    }
};

exports.createNewCategoryFromSheet = async (req, res, next) => {
    if (!req.params.fileKey) {
        res.status(400).json({message: "No fileKey"});
        return;
    }

    if (!req.body) {
        res.status(400).json({message: "No body"});
        return;
    }

    try {
        await IdVerifications.categoryExists({CategoryId: req.body.categoryId});

        const fileHeaders = req.body.data;
        const categoryId = req.body.categoryId;
        const fileId = req.params.fileKey;
        const headers = req.body.headersRow;



        const validationErrors = await validateAllSheetsData(fileId, fileHeaders, headers);
        if (validationErrors) {
            res.status(200).json({message: validationErrors.join("\n")});
            return;
        }
        const categories = await processSheetDataForCategory(fileId, fileHeaders, headers);

        console.log(categories)
        const category = await Category.findByPk(categoryId);


        //create  the new categories as sub of the parent category
        for (const key of Object.keys(categories)) {
            console.log(key);
            console.log(categories[key])
            let products;

            if (category.parentId) {
                let newCategory = await Category.create({
                    name: key, CompanyId: category.CompanyId, parentId: category.parentId,
                });

                products = [categories[key]].map((productData) => prepareProductData(productData, newCategory.id));
            } else {
                let newCategory = await Category.create({
                    name: key, CompanyId: category.CompanyId, parentId: category.id,
                });

                products = [categories[key]].map((productData) => prepareProductData(productData, newCategory.id));
            }
            console.log(products[0])
            await Product.bulkCreate(products[0]);
        }

        res.send("success");
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Internal Server Error"});
    }
};
