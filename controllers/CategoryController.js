const Category = require("../models/category");

exports.addCategory = (req, res) => {
    if (!req.body.name || !req.body.description) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    const category = {
        name: req.body.name,
        description: req.body.description,
        imageUrl: req.body.imageUrl
    }

    Category.create(category)
        .then(data => {
            console.log(data);
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Tutorial."
            });
        });

}


exports.getCategories = (req, res, next) => {
    Category.findAll()
        .then((categories) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(categories));
            return res;
        })
        .catch(err => console.log("err"));
};
