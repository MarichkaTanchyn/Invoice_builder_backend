const Category = require("../models/category");
const IdVerifications = require("../middleware/idVerifications");
const validateRequest = require('../middleware/validateRequest');


exports.addCategories = [validateRequest(['CompanyId'], []), async (req, res, next) => {

    console.log(req.params);
    // await IdVerifications.companyExists({CompanyId: req.params.CompanyId});
    try {
        const {withSubcategories, categories} = req.body;

        // Create the categories and subcategories
        if (withSubcategories) {
            await Promise.all(categories.map(async (categoryData) => {
                const category = await Category.create({
                    name: categoryData.name, description: categoryData.description, CompanyId: req.params.CompanyId
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
                name: categoryData.name, description: categoryData.description, CompanyId: req.params.CompanyId
            })));
        }
        res.status(201).json({message: 'Categories and subcategories created successfully.'});

    } catch (err) {
        next(err);
    }
}];


exports.getCategories = [validateRequest(['CompanyId'], []), async (req, res, next) => {
    await IdVerifications.companyExists({CompanyId: req.params.CompanyId});
    try {
        const categories = await Category.findAll({
            where: {
                CompanyId: req.params.CompanyId
            },
            order: [
                ['name', 'ASC']
            ]
        });

        const sortedCategories = sortCategories(categories);

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(sortedCategories));
        return res;
    } catch (err) {
        next(err);
    }
}];


function sortCategories(categories) {
    const categoriesWithNoParents = categories.filter(category => category.parentId === null);
    const categoriesWithParents = categories.filter(category => category.parentId !== null);

    return categoriesWithNoParents.sort(compareByName).flatMap(category => [
        category,
        ...categoriesWithParents
            .filter(subCategory => subCategory.parentId === category.id)
            .sort(compareByName)
    ]);
}

function compareByName(a, b) {
    return a.name.localeCompare(b.name);
}

exports.deleteCategory = [validateRequest(['CompanyId'], []), async (req, res, next) => {
    await IdVerifications.categoryExists({CategoryId: req.params.CategoryId});
    try {
        await Category.destroy({
            where: {
                id: req.params.CategoryId,
            }
        })

        res.send({
            message: "Category was deleted successfully!"
        });
    } catch (err) {
        next(err);
    }
}]

exports.updateCategory = [validateRequest(['CompanyId'], ['name']), async (req, res, next) => {
    await IdVerifications.categoryExists({CategoryId: req.params.CategoryId});
    try {
        let category = {
            name: req.body.name, description: req.body.description,
        }
        await Category.update(category, {
            where: {
                id: req.params.CategoryId
            }
        })
        res.send({
            message: "Category was updated successfully!"
        });
    } catch (err) {
        next(err);
    }

}]
