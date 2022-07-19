const XLSX = require("xlsx");
const readFile = require('../readFromExcel/readExcel');

exports.postFile = (req, res, next) => {
    console.log(req.file);
    if (!req.file) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    const file = req.file;

    let result = readFile.readFile(file.path);
    const data = result[0]
        , headers = result[1];
    console.log('Here')


    // var workbook = XLSX.readFile(file.path);
    // var sheet_name_list = workbook.SheetNames;
    // sheet_name_list.forEach(function (y) {
    //     let worksheet = workbook.Sheets[y];
    //     var data = [];
    //     for (z in worksheet) {
    //         if (z[0] === '!') continue;
    //         //parse out the column, row, and value
    //         var tt = 0;
    //         for (var i = 0; i < z.length; i++) {
    //             if (!isNaN(z[i])) {
    //                 tt = i;
    //                 break;
    //             }
    //         }
    //         ;
    //         var col = z.substring(0, tt);
    //         var row = parseInt(z.substring(tt));
    //         var value = worksheet[z].v;
    //
    //         if (row === 1 && value) {
    //             headerObj.push({"col": col, "name": value})
    //             continue;
    //         }
    //
    //         if (!data[row]) data[row] = {};
    //         data[row][headers[col]] = value;
    //     }
    //
    //     //drop those first two rows which are empty
    //     data.shift();
    //     data.shift();
    //
    // });

    res.send(headers);
}




