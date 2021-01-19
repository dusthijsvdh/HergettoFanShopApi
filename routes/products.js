const express = require("express");

const Product = require("../models/product");
const checkAuth = require("../middleware/check-auth")

const router = express.Router();

// router.post("", checkAuth, (req, res, next ) => {
router.post("", (req, res, next) => {
  const product = new Product({
    productId: req.body.productId,
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    sizes: req.body.sizes,
    colors: req.body.colors,
  });
  product.save().then(createdProduct => {
    res.status(201).json({
      message: 'Product added successfully',
      productId: createdProduct._id
    });
  });
});

router.get("", (req, res, next) => {
  Product.find().then(products => {
    res.status(200).json({
      message: 'Products fetched successfully!',
      products: products
    });
  });
});

router.get("/:id", (req, res, next) => {
  Product.findById(req.params.id).then(product => {
    if (product) {
      res.status(200).json(product)
    }
  }).catch(err => {
    res.status(404).json({message: 'Product not found!'});
  });
});


module.exports = router;