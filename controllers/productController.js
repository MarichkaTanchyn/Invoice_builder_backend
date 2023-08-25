const Product = require("../models/product");
const IdVerifications = require("../middleware/idVerifications");
const validateRequest = require("../middleware/validateRequest");
const validateRequestBody = require("../middleware/validateRequestBody");


exports.addProduct = [validateRequest(['CategoryId'], []), validateRequestBody, async (req, res, next) => {
    try {
        await IdVerifications.categoryExists({CategoryId: req.params.CategoryId});
        const newProduct = {
            name: req.body.name,
            nameColumnName: req.body.nameColumnName,
            price: req.body.price,
            priceColumnName: req.body.priceColumnName,
            description: req.body.description,
            descriptionColumnName: req.body.descriptionColumnName,
            CategoryId: req.params.CategoryId,
            other: req.body.other
        };

        await Product.create(newProduct);

        res.send({
            message: "Product was added successfully!",
        });
    } catch (err) {
        next(err);
    }
}]

exports.updateProduct = [validateRequest(['ProductId'], []), validateRequestBody, async (req, res, next) => {

    try {
        await IdVerifications.productExists({ProductId: req.params.ProductId});
        await Product.update(req.body, {
            where: {
                id: req.params.ProductId,
            },
        });
        res.send({
            message: "Product was updated successfully!",
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
            attributes: ['id', 'name', 'nameColumnName', 'price', 'description', 'priceColumnName', 'descriptionColumnName', 'other']
        });
        res.json(products);
    } catch (err) {
        next(err);
    }
}]

exports.getProduct = [validateRequest(['ProductId'], []), async (req, res, next) => {
    try {
        await IdVerifications.productExists({ProductId: req.params.ProductId});
        const products = await Product.findByPk(req.params.ProductId,{
            attributes: ['id', 'name', 'nameColumnName', 'price', 'description', 'priceColumnName', 'descriptionColumnName', 'other']
        });
        res.json(products);
    } catch (err) {
        next(err);
    }
}]

exports.updateProducts = [validateRequestBody , async (req, res, next) => {

    try {
        const products = req.body;
        for (const product of products) {
            await IdVerifications.productExists({ProductId: product.id});
            await Product.update(product, {
                where: {
                    id: product.id,
                },
            });
        }

        res.send({
            message: "Products were updated successfully!",
        });
    } catch (err) {
        next(err);
    }
}]

exports.deleteProducts =[validateRequestBody, async (req, res, next) => {
    try {
        const productIds = req.body;
        for (const productId of productIds) {
            await IdVerifications.productExists({ProductId: productId});
            await Product.destroy({
                where: {
                    id: productId,
                },
            });
        }

        res.send({
            message: "Products were deleted successfully!",
        });
    } catch (err) {
        next(err);
    }
}]

exports.deleteProduct = [validateRequest(['ProductId'], []), async (req, res, next) => {
    await IdVerifications.productExists({ ProductId: req.params.ProductId });
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
