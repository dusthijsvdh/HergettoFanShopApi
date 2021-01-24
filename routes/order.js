const express = require("express");

const Product = require("../models/product");
const ProductOrder = require("../models/productOrder");
const Order = require("../models/order");
const User = require("../models/user");
const checkAuth = require("../middleware/check-auth");
const product = require("../models/product");
const { route } = require("./user");

const router = express.Router();

router.get("/:id", checkAuth, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
    if (req.user.id !== order.userId && !req.user.admin) {
      return res.status(401).json({
          success: false,
          message: 'Not your order'})
    }
    const user = await User.findById(order.userId)
    res.json({
      order, user
    })
  } catch (e) {
    res.status(400).json({succes: false, message: 'couldnt fetch order' })
  }
})

router.get("", checkAuth, async (req, res, next) => {
  try {
    if (!req.user.admin) { 
      return  res.status(401).json({
        success: false,
        message: 'You are not registered as an admin'
      })}
    Order.find().populate("ProductOrder").lean().then(documents => {
      res.status(200).json({
        message: 'Orders fetched successfully!',
        orders: documents
      });
    });
  } catch (err) {
    res.send ({
      success: false,
      message: 'Couldnt fetch orders'
    })
  }
});

router.post("", checkAuth, async (req, res, next ) => {
  const { orderProducts } = req.autosan.body
  if(!orderProducts || orderProducts.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'you forgot to give an array of orderProducts with id/amount' 
    })
  }

  try {
    const productDocuments = []
    for (let i = 0; i < orderProducts.length; i++ ) {
      const item = await orderProducts[i];
      const productOrder = await new ProductOrder({
        id: item.product.id,
        title: item.product.title,
        price: item.product.price,
        description: item.product.description,
        imageUrl: item.product.imageUrl,
        amount: item.amount
      });
      productOrder.save()
      productDocuments.push(await productOrder)
    }

      const order = await new Order({
        products: productDocuments,
        userId: req.user.id,
        createdAt: Date.now()
      })

      await order.save().catch(e =>{
        console.log(e)
        return res.send({ success: false, message: 'couldnt create order' })
      })
      res.json(await order)
    } catch (e) {
      console.log(e)
      return res.send({ success: false, message: 'couldnt create order' })
    }
  })

router.patch("/toggledelivery/:id", checkAuth, async (req, res, next ) => {
  const orderId = req.params.id
  console.log(orderId)
  if (!req.user.admin) { 
    return res.status(401).json({ 
      success: false, 
      message: 'You are not allowed to change delivery status'
    })
  }
  if (!orderId) { 
    return res.status(400).json({
      success: false,
      message: 'your forgot to give the order id' 
    }) 
  }
  try {
    const order = await Order.findById(orderId)
    await order.updateOne({
      delivered: !order.delivered
    })

    await order.save()
    res.json(await order)
  } catch (e) {
    console.log(e)
    res.send({ success: false, message: 'couldnt update order' })
  }
})

router.patch("/togglepaid/:id", checkAuth, async (req, res, next ) => {
  const orderId = req.params.id
  if (!req.user.admin) { 
    return res.status(401).json({ 
      success: false, 
      message: 'You are not allowed to change delivery status'
    })
  }
  if (!orderId) { 
    return res.status(400).json({
      success: false,
      message: 'your forgot to give the order id' 
    }) 
  }
  try {
    const order = await Order.findById(orderId)
    await order.updateOne({
      paid: !order.paid
    })

    await order.save()
    res.json(await order)
  } catch (e) {
    console.log(e)
    res.send({ success: false, message: 'couldnt update order' })
  }
})

router.delete("/:id", checkAuth, async (req, res, next) => {
  const orderId = req.params.id;
  try {
    if(!req.user.admin) {
      return res.status(401).json({
        success: false,
        message: 'You are not autherized to delete a order?'
      })
    }
    const order = await Order.findById(orderId)
    order.deleteOne()
    res.json(await order)
  } catch (e) {
    res.send({ success: false, message: 'couldnt fetch order' })
  }
})

module.exports = router;