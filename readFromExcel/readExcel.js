var XLSX = require('xlsx');
// var wb = XLSX.readFile("./data/rex.xlsx");


// var sheet_name_list = wb.SheetNames;
// console.log(XLSX.utils.sheet_to_json(wb.Sheets[sheet_name_list[0]]));

// var obj = XLSX.utils.sheet_to_json(wb.Sheets[sheet_name_list[0]]);


function readFile(filePath){
    let workbook = XLSX.readFile(filePath);
    let sheet_name_list = workbook.SheetNames;
    let headerObj = [];
    let headers = {'columns': headerObj};
    let data = [];
    sheet_name_list.forEach(function (y) {
        let worksheet = workbook.Sheets[y];
        for (z in worksheet) {
            if (z[0] === '!') continue;
            //parse out the column, row, and value
            let tt = 0;
            for (let i = 0; i < z.length; i++) {
                if (!isNaN(z[i])) {
                    tt = i;
                    break;
                }
            };
            let col = z.substring(0, tt);
            let row = parseInt(z.substring(tt));
            let value = worksheet[z].v;

            if (row === 1 && value) {
                headerObj.push({"col": col, "name": value})
                continue;
            }

            if (!data[row]) data[row] = {};
            data[row][headers[col]] = value;
        }

        //drop those first two rows which are empty
        data.shift();
        data.shift();
        // console.log(data);
        console.log(headers);
    });

    return [data, headers];
}


module.exports.readFile = readFile;
