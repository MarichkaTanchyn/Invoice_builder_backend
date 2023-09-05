const XLSX = require("xlsx");
const fs = require("fs").promises;
const {join} = require("path");

const readFile = async (fileKey) => {
    const file = join(__dirname, "..", "uploads", fileKey);
    const bufferedFile = await fs.readFile(file);
    return XLSX.read(bufferedFile, {type: "buffer"});
};

const getJsonData = (workbook, sheetName, headersRow) => {
    const firstRowToRead = headersRow - 1; // 0 based index
    const lastRowToRead = firstRowToRead + 100; // 100 rows after the header

    // read all columns from A to Z (200 columns)
    const range = {
        s: {c: 0, r: firstRowToRead}, e: {c: 200, r: lastRowToRead},
    };

    if (!workbook.SheetNames.includes(sheetName)) {
        console.error(`Sheet: ${sheetName} not found in the workbook`);
        return null;
    }

    return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {range});
};

const getLargestObject = (jsonData) => {
    return jsonData.reduce((maxObj, currObj) => {
        return Object.keys(currObj).length > Object.keys(maxObj).length ? currObj : maxObj;
    }, {});
};

const getColumnsFromObject = (object) => {
    return Object.keys(object).map((key) => ({column: key}));
};

exports.processData = async (fileKey, headersRow, sheetName) => {
    const workbook = await readFile(fileKey);
    const jsonData = getJsonData(workbook, sheetName, headersRow);

    if (jsonData) {
        const largestObject = getLargestObject(jsonData);
        const columns = getColumnsFromObject(largestObject);

        return {
            [sheetName]: columns
        };
    }

    return null;
};

exports.processSheetData = async (fileKey, fileHeaders, headersRow) => {
    const workbook = await readFile(fileKey);
    let data = [];

    for (let sheetName in fileHeaders) {
        const worksheet = workbook.Sheets[sheetName];
        if (worksheet) {
            const jsonData = XLSX.utils.sheet_to_json(worksheet, {header: headersRow});
            // Assume that the first row is the header
            let headers = jsonData.shift();

            const modifiedData = jsonData.map((row) => {
                let obj = [];
                row.forEach((cell, index) => {
                    const originalColName = headers[index];
                    const newHeader = fileHeaders[sheetName].find((h) => h.originalColName === originalColName);
                    if (newHeader) {
                        obj.push({
                            [newHeader.column]: cell, useInInvoice: newHeader.useInInvoice, type: newHeader.dataType,
                        });
                    } else {
                        obj.push({[originalColName]: cell});
                    }
                });
                return obj;
            });
            data.push(modifiedData);
        }
    }

    return data;
};


const modifyRowData = (row, headers, fileHeadersForSheet) => {
    let obj = [];
    row.forEach((cell, index) => {
        const originalColName = headers[index];
        const newHeader = fileHeaders[sheetName][0].columns.find((h) => h.originalColumn === originalColName);
        if (newHeader) {
            obj.push({
                [newHeader.column]: cell,
                useInInvoice: newHeader.useInInvoice,
                type: newHeader.dataType,
            });
        } else {
            obj.push({[originalColName]: cell});
        }
    });
    return obj;
};

exports.processSheetDataForCategory = async (fileKey, fileHeaders, sheetHeader) => {
    const workbook = await readFile(fileKey);
    let categories = {};

    for (let sheetName in fileHeaders) {
        if (sheetName in sheetHeader) {
            const worksheet = workbook.Sheets[sheetName];
            if (worksheet) {

                const headerValue = sheetHeader[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, {header: headerValue})

                // Assume that the first row is the header
                let headers = jsonData.shift();

                const modifiedData = jsonData.map((row) => {
                    let obj = [];
                    row.forEach((cell, index) => {
                        const originalColName = headers[index];
                        const newHeader = fileHeaders[sheetName][0].columns.find((h) => h.originalColumn === originalColName);
                        if (newHeader) {
                            obj.push({
                                [newHeader.column]: cell,
                                useInInvoice: newHeader.useInInvoice,
                                type: newHeader.dataType,
                            });
                        } else {
                            obj.push({[originalColName]: cell});
                        }
                    });
                    return obj;
                });

                // Use categoryName as the key instead of sheetName
                const categoryName = fileHeaders[sheetName][0].categoryName;
                if (categoryName) {
                    categories[categoryName] = modifiedData;
                }
            }
        }
    }
    return categories;
};


exports.validateSheetData = async (fileKey, fileHeaders, headersRow) => {
    const workbook = await readFile(fileKey);
    console.log("here")
    for (let sheetName in fileHeaders) {
        const worksheet = workbook.Sheets[sheetName];
        if (worksheet) {
            const jsonData = XLSX.utils.sheet_to_json(worksheet, {header: 1});
            const headers = jsonData.shift();

            for (let row of jsonData) {
                const errors = validateRowData(row, headers, fileHeaders[sheetName]);
                if (errors.length > 0) {
                    return errors;
                }
            }
        }
    }
    return null;
};

const validateRowData = (row, headers, fileHeadersForSheet) => {
    let errors = [];
    for (let index in row) {
        const cell = row[index];
        const originalColName = headers[index];
        const newHeader = fileHeadersForSheet.find((h) => h.originalColName === originalColName);

        if (newHeader) {
            try {
                const validationResult = validateDataType(newHeader.dataType, cell, newHeader.column);
                if (validationResult) {
                    errors.push(validationResult);
                }
            } catch (error) {
                errors.push(`Error in row ${Number(index) + 2}, column "${originalColName}": ${error.message}`);
            }
        }
    }
    return errors;
};


function validateDataType(dataType, value, newColumnName) {
    // Check if there's a validator for the specified data type
    if (validators.hasOwnProperty(dataType)) {
        // If there is, use it to validate the value
        if (!validators[dataType](value)) {
            // If the value is not valid, return an error message
            let valueType = typeof value;
            if (valueType === "string") {
                valueType = "text";
            }
            return `Invalid data in column <b>"${newColumnName}"</b> : Expected data type <b>"${dataType}"</b>, but got <b>"${valueType}"</b>`;
        }
        // If the value is valid, return null
        return null;
    } else {
        // If there's no validator for the specified data type, consider it as an error
        return `Invalid data type: <b> ${dataType} </b>`;
    }
}

exports.validateAllSheetsData = async (fileKey, fileHeaders, sheetHeader) => {
    const workbook = await readFile(fileKey);
    let allErrors = [];

    for (let sheetName in fileHeaders) {
        if (sheetName in sheetHeader) {
            const worksheet = workbook.Sheets[sheetName];
            if (worksheet) {
                const headerValue = sheetHeader[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, {header: headerValue});
                const headers = jsonData.shift();

                for (let row of jsonData) {
                    const errors = validateRowData(row, headers, fileHeaders[sheetName]);
                    allErrors = [...allErrors, ...errors];
                }
            }
        }
    }

    if (allErrors.length > 0) {
        return allErrors;
    }
    return null;
};

exports.prepareProductData = (productDataArray, categoryId) => {
    return productDataArray
        .map((productData) => {
            const product = {other: [], CategoryId: categoryId};
            const usedKeys = {name: false, price: false, description: false};

            productData.forEach((item) => {
                const key = Object.keys(item)[0];
                const value = item[key];

                if (["name", "price", "description"].includes(item.type) && (!usedKeys[item.type] || item.useInInvoice)) {
                    product[item.type] = value;
                    product[`${item.type}ColumnName`] = key;
                    usedKeys[item.type] = true;
                } else {
                    product.other.push(item);
                }
            });

            return product;
        })
        .filter(filterIrrelevantProducts)
        .filter(filterEmptyOtherWithCategoryId);
};

const filterIrrelevantProducts = (product) => {
    return (
        product.name !== null ||
        product.price !== null ||
        product.description !== null ||
        product.other.length > 0
    );
};


const filterEmptyOtherWithCategoryId = (product) => {
    return !(product.CategoryId !== null && product.other.length === 0);
};

const validators = {
    name: (value) => typeof value === "string",
    number: (value) => !isNaN(Number(value)) && /^-?\d*(\.\d+)?$/.test(value),
    price: (value) => !isNaN(Number(value)) && /^\d{1,3}(,\d{3})*(\.\d{1,2})?$/.test(value), // e.g. 1,000.00
    date: (value) => !isNaN(Date.parse(value)) && /^(\d{4})-(\d{1,2})-(\d{1,2})$/.test(value), // ISO format: yyyy-mm-dd
    description: (value) => typeof value === "string",
    text: (value) => typeof value === "string",
    other: (value) => true, // no validation for 'other'
};