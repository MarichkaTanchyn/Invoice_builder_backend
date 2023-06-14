const Product = require("../models/product");
const IdVerifications = require("../middleware/idVerifications");
const validateRequest = require("../middleware/validateRequest");
const validateRequestBody = require("../middleware/validateRequestBody");


exports.addProducts = [validateRequest(['CategoryId'], []), validateRequestBody, async (req, res, next) => {

    try {
        // let products = req.body;
        // products.forEach(async (product) => {
        //     await Product.create({
        //         name: product.name,
        //         description: product.description,
        //         price: product.price,
        //         CategoryId: req.params.CategoryId
        //     })
        // })
        res.send({
            message: "Products were added successfully!",
        });
    } catch (err) {
        next(err);
    }
}]

exports.getProducts = [validateRequest(['CategoryId'], []), async (req, res, next) => {

    try {
        await IdVerifications.categoryExists({CategoryId: req.params.CategoryId});
        const products = await Product.findAll({
            where: {
                CategoryId: req.params.CategoryId,
            },
        });
        res.json(products);
    } catch (err) {
        next(err);
    }
}]

exports.deleteProduct = [validateRequest(['ProductId'], []), async (req, res, next) => {

    // await IdVerifications.productExists({ ProductId: req.params.ProductId });
    try {
        await Product.destroy({
            where: {
                id: req.params.ProductId,
            },
        });

        res.send({
            message: "Product was deleted successfully!",
        });
    } catch (err) {
        next(err);
    }
}]

exports.deleteAllProducts = async (req, res) => {

    try {
        await Product.destroy({where: {},});
        res.send({
            message: "All Products were deleted successfully!",
        });
    } catch (err) {
        next(err);
    }
}

exports.deleteCategoryProducts = [validateRequest(['CategoryId'], []), async (req, res, next) => {

    await IdVerifications.categoryExists({CategoryId: req.params.CategoryId});

    try {
        await Product.destroy({
            where: {
                CategoryId: req.params.CategoryId,
            },
        });
        res.send({
            message: "Products were deleted successfully!",
        });
    } catch (err) {
        next(err);
    }
}]
