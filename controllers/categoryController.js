const Category = require("../models/category");
const Company = require("../models/company");

exports.addCategory = async (req, res) => {
    if (!req.params.id) {
        res.status(400).send({
            message: "ID can not be empty!"
        });
        return;
    }
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    try {
        let category = {
            name: req.body.name,
            description: req.body.description,
            CompanyId: req.params.id
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
    console.log("me")
    console.log(req.params.id)
    if (!req.params.id) {
        res.status(400).send({
            message: "ID can not be empty!"
        });
        return;
    }
    try {
        let categories = await Category.findAll({
            where: {
                CompanyId : req.params.id
            }
        })
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(categories));
        return res;
    } catch (error) {
        console.error(error);
    }
};
