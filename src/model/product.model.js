const mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    _id: Object,
    name: String,
    price: String,
    color: String,
    size: Number,
    category: String,
    url: String
});

var product = mongoose.model('products', productSchema);

module.exports = product;