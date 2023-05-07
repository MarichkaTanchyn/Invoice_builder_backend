const Category = require("../models/category");
const IdVerifications = require("../middleware/idVerifications");

exports.addCategories = async (req, res) => {

    if (!req.params.CompanyId) {
        res.status(400).send({
            message: "ID can not be empty!"
        });
        return;
    }

    console.log(req.params);
    // await IdVerifications.companyExists({CompanyId: req.params.CompanyId});
    try {
        const { withSubcategories, categories } = req.body;

        // Create the categories and subcategories
        if (withSubcategories) {
            await Promise.all(categories.map(async (categoryData) => {
                const category = await Category.create({
                    name: categoryData.name,
                    description: categoryData.description,
                    CompanyId: req.params.CompanyId
                });

                if (categoryData.subcategories && categoryData.subcategories.length > 0) {
                    await Promise.all(categoryData.subcategories.map(async (subcategoryData) => {
                        await Category.create({
                            name: subcategoryData.name,
                            description: subcategoryData.description,
                            parentId: category.id,
                            CompanyId: req.params.CompanyId
                        });
                    }));
                }
            }));
        } else {
            await Category.bulkCreate(categories.map((categoryData) => ({
                name: categoryData.name,
                description: categoryData.description,
                CompanyId: req.params.CompanyId
            })));
        }
        res.status(201).json({ message: 'Categories and subcategories created successfully.' });

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
