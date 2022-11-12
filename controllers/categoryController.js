const Category = require("../models/category");

exports.addCategory = async (req, res) => {
    if (!req.body.name || !req.body.description) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    try {
        let category = {
            name: req.body.name,
            description: req.body.description,
        }
        category = await Category.create(category)
        res.send(category);
    } catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while creating the Tutorial."
        });
    }
}


exports.getCategories = async (req, res, next) => {
    try {
        let categories = await Category.findAll()
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(categories));
        return res;
    } catch (error) {
        console.error(error);
    }
};
