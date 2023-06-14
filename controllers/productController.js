const Product = require("../models/product");
const IdVerifications = require("../middleware/idVerifications");

exports.addProducts = async (req, res) => {
  if (!req.params.CategoryId) {
    res.status(400).send({
      message: "ID can not be empty!",
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
      message: "Products were added successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getProducts = async (req, res) => {
  if (!req.params.CategoryId) {
    res.status(400).send({
      message: "ID can not be empty!",
    });
    return;
  }
  try {
    await IdVerifications.categoryExists({ CategoryId: req.params.CategoryId });
    const products = await Product.findAll({
      where: {
        CategoryId: req.params.CategoryId,
      },
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteProduct = async (req, res) => {
  if (!req.params.ProductId) {
    res.status(400).send({
      message: "ID can not be empty!",
    });
    return;
  }
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteAllProducts = async (req, res) => {

    try {
        Product.destroy({where: {},});
        res.send({
          message: "All Products were deleted successfully!",
        });
      } catch (error) {
        console.error(error);
      }
}

exports.deleteCategoryProducts = async (req, res) => {
  if (!req.params.CategoryId) {
    res.status(400).send({
      message: "ID can not be empty!",
    });
    return;
  }
  await IdVerifications.categoryExists({ CategoryId: req.params.CategoryId });

  try {
    Product.destroy({
      where: {
        CategoryId: req.params.CategoryId,
      },
    });
    res.send({
      message: "Products were deleted successfully!",
    });
  } catch (error) {
    console.error(error);
  }
};
