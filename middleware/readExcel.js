const XLSX = require('xlsx');

let hasGuessedName = false;
let hasGuessedPrice = false;
exports.readDataFromExcelSheet = async (data, headersRow, sheetName) => {
    const wb = XLSX.read(data, {type: 'buffer'});

    const mySheetData = {};

    // Check if the workbook has the sheetName
    if (!wb.SheetNames.includes(sheetName)) {
        console.error(`Sheet: ${sheetName} not found in the workbook`);
        return;
    }

    const firstRowToRead = headersRow - 1; // 0 based index
    const lastRowToRead = firstRowToRead + 100; // 100 rows after the header

    // read all columns from A to Z (200 columns)
    const range = {s: {c: 0, r: firstRowToRead}, e: {c: 200, r: lastRowToRead}};

    const jsonData = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], {
        range: range

    });
    let columns = [];
    for (const key in jsonData[0]) {
        if (jsonData[0].hasOwnProperty(key)) {
            // const columnData = jsonData.map(row => row[key]);
            // const dataType = guessDataType(columnData);
            // if (dataType === 'name') {
            //     hasGuessedName = true;
            // }
            // if (dataType === 'price') {
            //     hasGuessedPrice = true;
            // }
            columns.push({"column": key});
        }
    }
    mySheetData[sheetName] = columns;

    hasGuessedName = false;
    return mySheetData;
}


const guessDataType = (columnData) => {
    let typeCounts = {
        name: 0,
        price: 0,
        number: 0,
        date: 0,
        size: 0,
        height: 0,
        weight: 0,
        length: 0,
        description: 0,
        other: 0
    };

    columnData.forEach(data => {
        let dataType;
        if (data instanceof Date) {
            dataType = 'date';
        } else {
            dataType = typeof data;
            switch (dataType) {
                case 'string':
                    if (data.length <= 30) {
                        if (hasGuessedName) {
                            dataType = 'other';
                        } else {
                            dataType = 'name';
                        }
                    } else {
                        dataType = 'description';
                    }
                    break;
                case 'number':
                    // If it's between 0 and 1000, it's likely a price

                    if (data >= 0 && data <= 1000) {
                        if (hasGuessedPrice) {
                            dataType = 'number';
                        } else {
                            dataType = 'price';
                        }
                    }
                    // If it's between 1000 and 100000, it's likely a number
                    else if (data > 1000 && data <= 100000) {
                        dataType = 'number';
                    }
                    // If it's between 1 and 300, it's likely a size
                    else if (data > 0 && data <= 300) {
                        dataType = 'size';
                    } else {
                        dataType = 'number';
                    }
                    break;
                default:
                    dataType = 'other';
            }
        }
        if (dataType in typeCounts) {
            typeCounts[dataType]++;
        } else {
            typeCounts[dataType] = 1;
        }
    });
    let maxCount = 0;
    let guessedType = 'other';
    for (const dataType in typeCounts) {
        if (typeCounts[dataType] > maxCount) {
            maxCount = typeCounts[dataType];
            guessedType = dataType;
        }
    }
    return guessedType;
}