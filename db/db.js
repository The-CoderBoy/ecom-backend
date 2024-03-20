const mongoose = require("mongoose");

const product = new mongoose.Schema({
  "product name": String,
  price: Number,
  quantity: Number,
  discription: String,
  images: [String],
});

const Product = mongoose.model("Product", product);

module.exports = { Product };
