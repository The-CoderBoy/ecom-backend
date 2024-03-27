const mongoose = require("mongoose");

const product = new mongoose.Schema({
  "product name": String,
  price: String,
  quantity: String,
  discription: String,
  images: [String],
});

const banner = new mongoose.Schema({
  _id: String,
  images: [String],
});

const Product = mongoose.model("Product", product);
const Banner = mongoose.model("Banner", banner);

module.exports = { Product, Banner };
