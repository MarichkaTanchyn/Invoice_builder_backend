const Product = require('../models/product');
const IdVerifications = require('../middleware/idVerifications');

exports.addProducts = async (req, res) => {

    console.log(req.params);
    console.log(req.body);
}
