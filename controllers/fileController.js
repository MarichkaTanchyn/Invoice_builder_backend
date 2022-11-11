const readFile = require('../middleware/readExcel');

// this gets csv file and send headers as response

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
    const data = result[0],
         headers = result[1];

    res.send(headers);
}




