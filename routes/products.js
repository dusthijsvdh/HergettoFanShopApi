const express = require("express");

const Product = require("../models/product");
const checkAuth = require("../middleware/check-auth")

const router = express.Router();

// router.post("", checkAuth, (req, res, next ) => {
router.post("", (req, res, next) => {
  const product = new Product({
    productId: req.autosan.body.productId,
    title: req.autosan.body.title,
    price: req.autosan.body.price,
    description: req.autosan.body.description,
    imageUrl: req.autosan.body.imageUrl,
    sizes: req.autosan.body.sizes,
    colors: req.autosan.body.colors,
  });
  product.save().then(createdProduct => {
    res.status(201).json({
      message: 'Product added successfully',
      productId: createdProduct._id
    });
  }).catch(error => {
    console.error(error);
    res.status(401).json({
      success: false,
      message: 'Product wasn not added'
    })
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
      res.status(200).json({
        message: 'Product fetched successfully',
        product: product
      });
    }
  }).catch(err => {
    res.status(404).json({message: 'Product not found!'});
  });
});


module.exports = router;