const Product = require("../models/product");
const Category = require("../models/category");
const IdVerifications = require("../middleware/idVerifications");

const {
    processData,
    processSheetData,
    processSheetDataForCategory,
    validateSheetData,
    validateAllSheetsData,
    prepareProductData, cleanCategories,
} = require("../middleware/readExcel");

const validateRequestBody = require('../middleware/validateRequestBody');
const validateRequest = require('../middleware/validateRequest');

exports.readExcel = [validateRequestBody, validateRequest(['fileKey'], []), async (req, res, next) => {
    try {
        const sheetHeaderJson = req.body;
        const fileId = req.params.fileKey;

        const data = await Promise.all(Object.entries(sheetHeaderJson).map(([key, value]) => processData(fileId, value, key)));

        res.send(data);
    } catch (err) {
        next(err);
    }
}];

exports.preprocessSelectedSheetData = [validateRequestBody, validateRequest(['fileKey'], []), async (req, res, next) => {
    try {
        const {data: fileHeaders, categoryId, headersRow: headers} = req.body;
        const fileId = req.params.fileKey;

        for (let key in headers) {
            const validationError = await validateSheetData(fileId, fileHeaders, headers[key]);
            if (validationError) {
                res.status(200).json({message: validationError});
                return;
            }

            const data = await processSheetData(fileId, fileHeaders, headers[key]);
            const products = data.map((productData) => prepareProductData(productData, categoryId));
            await Product.bulkCreate(products[0]);
        }
        res.send("success");
    } catch (err) {
        next(err);
    }
}];

exports.createNewCategoryFromSheet = [validateRequestBody, validateRequest(['fileKey'], []), async (req, res, next) => {
    try {
        await IdVerifications.categoryExists({CategoryId: req.body.categoryId});

        const {data: fileHeaders, categoryId, headersRow: headers} = req.body;
        const fileId = req.params.fileKey;

        const validationErrors = await validateAllSheetsData(fileId, fileHeaders, headers);
        if (validationErrors) {
            res.status(200).json({message: validationErrors.join("\n")});
            return;
        }

        const tmp = await processSheetDataForCategory(fileId, fileHeaders, headers);
        const categories = await cleanCategories(tmp)
        const category = await Category.findByPk(categoryId);

        for (const [key, value] of Object.entries(categories)) {
            const newCategoryData = {
                name: key, CompanyId: category.CompanyId, parentId: category.parentId || category.id,
            };
            const newCategory = await Category.create(newCategoryData);
            const products = [prepareProductData(value, newCategory.id)];
            await Product.bulkCreate(products[0]);
        }

        res.send("success");
    } catch (err) {
        next(err);
    }
}];