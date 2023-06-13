const Product = require('../models/product');
const IdVerifications = require('../middleware/idVerifications');

exports.addProducts = async (req, res) => {
    if (!req.params.CategoryId) {
        res.status(400).send({
            message: "ID can not be empty!"
        });
        return;
    }
    if (!req.body) {
        res.status(400).json({ message: "No body" });
        return;
    }

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
            message: "Products were added successfully!"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
