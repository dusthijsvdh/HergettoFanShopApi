const mongoose = require('mongoose');

const productOrderSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    productId: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    sizes: [{
        type: String,
        required: true
    }],
    colors: [{
        type: String,
        required: true
    }],
    amount: {
        type: Number,
        required: true
    }
})
module.exports = mongoose.model('ProductOrder', productOrderSchema);