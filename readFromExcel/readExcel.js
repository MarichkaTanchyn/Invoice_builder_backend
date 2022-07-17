var XLSX = require('xlsx');
var wb = XLSX.readFile("./data/rex.xlsx");

var sheet_name_list = wb.SheetNames;
// console.log("here");
console.log(XLSX.utils.sheet_to_json(wb.Sheets[sheet_name_list[0]]));
// console.log(worksheet[`A${1}`].v);
