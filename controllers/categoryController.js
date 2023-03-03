const Category = require("../models/category");


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
                err.message || "Some error occurred while creating the Category."
        });
    }
}


exports.getCategories = async (req, res, next) => {
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

exports.deleteCategory = async (req, res) => {
    if (!req.params.id, !req.params.companyId) {
        res.status(400).send({
            message: "ID can not be empty!"
        });
        return;
    }
    try {
        await Category.destroy({
            where: {
                id: req.params.id,
                CompanyId: req.params.companyId
            }
        })
        res.send({
            message: "Category was deleted successfully!"
        });
    } catch (error) {
        console.error(error);
    }
}

exports.updateCategory = async (req, res) => {
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
        }
        await Category.update(category, {
            where: {
                id: req.params.id
            }
        })
        res.send({
            message: "Category was updated successfully!"
        });
    } catch (error) {
        console.error(error);
    }

}
