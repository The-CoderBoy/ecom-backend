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

const user = new mongoose.Schema({
  userName: { type: String, unique: true },
  password: String,
  contactNo: String,
  address: String,
});

const cart = new mongoose.Schema({
  _id: String,
  productDetails: [
    {
      productId: String,
      productName: String,
      quantity: String,
      price: String,
    },
  ],
});

const Product = mongoose.model("Product", product);
const Banner = mongoose.model("Banner", banner);
const User = mongoose.model("User", user);
const Cart = mongoose.model("Cart", cart);

module.exports = { Product, Banner, User, Cart };
