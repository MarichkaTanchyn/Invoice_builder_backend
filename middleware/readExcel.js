const XLSX = require("xlsx");
const fs = require("fs").promises;
const { join } = require("path");

exports.readDataFromExcelSheet = async (data, headersRow, sheetName) => {
  const wb = XLSX.read(data, { type: "buffer" });

  const mySheetData = {};

  // Check if the workbook has the sheetName
  if (!wb.SheetNames.includes(sheetName)) {
    console.error(`Sheet: ${sheetName} not found in the workbook`);
    return;
  }

  const firstRowToRead = headersRow - 1; // 0 based index
  const lastRowToRead = firstRowToRead + 100; // 100 rows after the header

  // read all columns from A to Z (200 columns)
  const range = {
    s: { c: 0, r: firstRowToRead },
    e: { c: 200, r: lastRowToRead },
  };

  const jsonData = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], {
    range: range,
  });
  // Find the object with the most keys
  const largestObject = jsonData.reduce((maxObj, currObj) => {
    return Object.keys(currObj).length > Object.keys(maxObj).length
      ? currObj
      : maxObj;
  }, {});

  // Create an array of objects from the keys of the largest object
  const columns = Object.keys(largestObject).map((key) => ({ column: key }));

  // Assign columns array to mySheetData
  mySheetData[sheetName] = columns;

  return mySheetData;
};

exports.processSheetData = async (fileKey, fileHeaders) => {
  const file = join(__dirname, "..", "uploads", fileKey);
  const bufferedFile = await fs.readFile(file);
  let data = [];

  const workbook = XLSX.read(bufferedFile, { type: "buffer" });

  for (let sheetName in fileHeaders) {
    const worksheet = workbook.Sheets[sheetName];
    if (worksheet) {
      //TODO: get header from ui
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      // Assume that the first row is the header
      let headers = jsonData.shift();

      const modifiedData = jsonData.map((row) => {
        let obj = [];
        row.forEach((cell, index) => {
          const originalColName = headers[index];
          const newHeader = fileHeaders[sheetName].find(
            (h) => h.originalColName === originalColName
          );
          if (newHeader) {
            obj.push({
              [newHeader.column]: cell,
              useInInvoice: newHeader.useInInvoice,
              type: newHeader.dataType,
            });
          } else {
            obj.push({ [originalColName]: cell });
          }
        });
        return obj;
      });
      data.push(modifiedData);
    }
  }

  return data;
};

exports.processSheetDataForCategory = async (fileKey, fileHeaders) => {
  const file = join(__dirname, "..", "uploads", fileKey);
  const bufferedFile = await fs.readFile(file);

  let categories = {};

  // Read the file using xlsx
  const workbook = XLSX.read(bufferedFile, { type: "buffer" });

  console.log(fileHeaders);
  for (let sheetName in fileHeaders) {
    const worksheet = workbook.Sheets[sheetName];
    if (worksheet) {
      //TODO: get header from ui
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Assume that the first row is the header
      let headers = jsonData.shift();

      const modifiedData = jsonData.map((row) => {
        let obj = [];
        row.forEach((cell, index) => {
          const originalColName = headers[index];
          const newHeader = fileHeaders[sheetName][0].columns.find(
            (h) => h.originalColumn === originalColName
          );
          if (newHeader) {
            obj.push({
              [newHeader.column]: cell,
              useInInvoice: newHeader.useInInvoice,
              type: newHeader.dataType,
            });
          } else {
            obj.push({ [originalColName]: cell });
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
  return categories;
};

exports.validateSheetData = async (fileKey, fileHeaders) => {
  const file = join(__dirname, "..", "uploads", fileKey);
  const bufferedFile = await fs.readFile(file);
  const workbook = XLSX.read(bufferedFile, { type: "buffer" });

  for (let sheetName in fileHeaders) {
    const worksheet = workbook.Sheets[sheetName];
    if (worksheet) {
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      let headers = jsonData.shift();

      for (let row of jsonData) {
        for (let index in row) {
          const cell = row[index];
          const originalColName = headers[index];
          const newHeader = fileHeaders[sheetName].find(
            (h) => h.originalColName === originalColName
          );

          if (newHeader) {
            try {
              const validationResult = validateDataType(
                newHeader.dataType,
                cell,
                newHeader.column
              );
              if (validationResult) {
                // If there's an error, stop the processing and return the error message
                return validationResult;
              }
            } catch (error) {
              // If there's an exception, stop the processing and return the error message
              return `Error in sheet "${sheetName}", row ${
                Number(index) + 2
              }, column "${originalColName}": ${error.message}`;
            }
          }
        }
      }
    }
  }

  // If all cells are valid, return null
  return null;
};

const validators = {
  name: (value) => typeof value === "string",
  number: (value) => !isNaN(Number(value)) && /^-?\d*(\.\d+)?$/.test(value),
  price: (value) =>
    !isNaN(Number(value)) && /^\d{1,3}(,\d{3})*(\.\d{1,2})?$/.test(value), // e.g. 1,000.00
  date: (value) =>
    !isNaN(Date.parse(value)) && /^(\d{4})-(\d{1,2})-(\d{1,2})$/.test(value), // ISO format: yyyy-mm-dd
  description: (value) => typeof value === "string",
  text: (value) => typeof value === "string",
  other: (value) => true, // no validation for 'other'
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

exports.validateAllSheetsData = async (fileKey, fileHeaders) => {
  const file = join(__dirname, "..", "uploads", fileKey);
  const bufferedFile = await fs.readFile(file);
  const workbook = XLSX.read(bufferedFile, { type: "buffer" });

  let errors = [];

  for (let sheetName in fileHeaders) {
    const worksheet = workbook.Sheets[sheetName];
    if (worksheet) {
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      let headers = jsonData.shift();

      for (let row of jsonData) {
        for (let index in row) {
          const cell = row[index];
          const originalColName = headers[index];
          const newHeader = fileHeaders[sheetName].find(
            (h) => h.originalColName === originalColName
          );

          if (newHeader) {
            try {
              const validationResult = validateDataType(
                newHeader.dataType,
                cell,
                newHeader.column
              );
              if (validationResult) {
                // If there's an error, add it to the errors array
                errors.push(
                  `Error in sheet <b> "${sheetName}" </b>, row <b> ${
                    Number(index) + 3
                  } </b>, column <b> "${
                    newHeader.column
                  }" </b> :  ${validationResult}`
                );
              }
            } catch (error) {
              // If there's an exception, add it to the errors array
              errors.push(
                `Error in sheet <b> "${sheetName}" </b>, row <b> ${
                  Number(index) + 3
                } </b>, column <b> "${newHeader.column}" </b> : ${
                  error.message
                }`
              );
            }
          }
        }
      }
    }
  }
  // If there are any errors, return them
  if (errors.length > 0) {
    return errors;
  }

  // If all cells are valid, return null
  return null;
};
