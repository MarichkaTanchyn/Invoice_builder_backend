const Category = require("../models/category");
const IdVerifications = require("../middleware/idVerifications");

exports.addCategory = async (req, res) => {
    if (!req.params.CompanyId) {
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
    await IdVerifications.companyExists({CompanyId: req.params.CompanyId});
    try {
        let category = {
            name: req.body.name,
            description: req.body.description,
            CompanyId: req.params.CompanyId
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
    if (!req.params.CompanyId) {
        res.status(400).send({
            message: "ID can not be empty!"
        });
        return;
    }
    await IdVerifications.companyExists({CompanyId: req.params.CompanyId});
    try {
        let categories = await Category.findAll({
            where: {
                CompanyId : req.params.CompanyId
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
    if (!req.params.CategoryId) {
        res.status(400).send({
            message: "ID can not be empty!"
        });
        return;
    }
    await IdVerifications.categoryExists({CategoryId: req.params.CategoryId});
    try {
        await Category.destroy({
            where: {
                id: req.params.id,
                CompanyId: req.params.CategoryId
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
    if (!req.params.CategoryId) {
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
    await IdVerifications.categoryExists({CategoryId: req.params.CategoryId});
    try {
        let category = {
            name: req.body.name,
            description: req.body.description,
        }
        await Category.update(category, {
            where: {
                id: req.params.CategoryId
            }
        })
        res.send({
            message: "Category was updated successfully!"
        });
    } catch (error) {
        console.error(error);
    }

}
