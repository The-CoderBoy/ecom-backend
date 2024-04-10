const express = require("express");
const app = express();
var cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const upload = multer({ dest: "public/image" });
const fs = require("fs");
const path = require("path");
const rootFolder = __dirname;

//------------------- middelware ----------------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"));

//------------------------ DB --------------------

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/eCom");
  console.log("database connnected");
}

const { Product, Banner, User, Cart, Order } = require("./db/db");

//---------------Routes------------------

app.post("/addProduct", upload.array("images"), async (req, res) => {
  const detail = JSON.parse(req.body.data);
  let images = [];
  const imageData = req.files;

  for (let x = 0; x < imageData.length; x++) {
    images.push(imageData[x].filename);
  }

  try {
    const saveData = await Product.create({ ...detail, images: images });
    console.log(saveData);
    res.json({ msg: true });
  } catch (err) {
    console.log(err);
    res.json({ msg: false });
  }
});

app.post("/viewProduct", async (req, res) => {
  const data = await Product.find({});
  res.json(data);
});

app.post("/productDetails", async (req, res) => {
  const { _id } = req.body;
  try {
    const data = await Product.findById({ _id: _id });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.json({});
  }
});

app.post("/updateProduct", async (req, res) => {
  const { productData, delImage } = req.body;

  try {
    let obj = { ...productData };
    delete obj._id;
    const update = await Product.findOneAndReplace(
      { _id: productData._id },
      obj
    );

    console.log(update);

    if (delImage.length) {
      for (let x = 0; x < delImage.length; x++) {
        const filePath = path.join(rootFolder, "public", "image", delImage[x]);

        fs.unlink(filePath, (err) => console.log(err));
      }
    }

    res.json({ msg: true });
  } catch (err) {
    console.log(err);
    res.json({ msg: false });
  }
});

app.post("/addImages", upload.array("images"), async (req, res) => {
  const { _id } = req.body;
  let images = [];
  const imageData = req.files;

  for (let x = 0; x < imageData.length; x++) {
    images.push(imageData[x].filename);
  }

  try {
    const update = await Product.findByIdAndUpdate(
      { _id },
      { $push: { images: { $each: images } } }
    );

    console.log(update);
    res.json({ msg: true });
  } catch (err) {
    res.json({ msg: false });
  }
});

app.post("/deleteProduct", async (req, res) => {
  const { _id } = req.body;
  try {
    const product = await Product.findById({ _id });

    if (product.images.length) {
      for (let x = 0; x < product.images.length; x++) {
        const filePath = path.join(
          rootFolder,
          "public",
          "image",
          product.images[x]
        );

        fs.unlink(filePath, (err) => console.log(err));
      }
    }

    const deleteProduct = await Product.findByIdAndDelete({ _id });
    console.log(deleteProduct);
    res.json({ msg: true });
  } catch (err) {
    console.log(err);
    res.json({ msg: false });
  }
});

app.post("/adminLogin", async (req, res) => {
  const { userName, password } = req.body;
  if (userName == "admin" && password == "admin") {
    res.json({ msg: true });
  } else {
    res.json({ msg: false });
  }
});

app.post("/addBanner", upload.array("images"), async (req, res) => {
  let images = [];
  const imageData = req.files;

  for (let x = 0; x < imageData.length; x++) {
    images.push(imageData[x].filename);
  }

  try {
    const ban = await Banner.findById({ _id: "banner" });
    if (ban) {
      const update = await Banner.findByIdAndUpdate(
        { _id: "banner" },
        { $push: { images: { $each: images } } }
      );
      console.log(update);
    } else {
      const addImage = await Banner.create({ _id: "banner", images: images });
      console.log(addImage);
    }
    res.json({ msg: true });
  } catch (err) {
    res.json({ msg: false });
  }
});

app.post("/viewBanner", async (req, res) => {
  const data = await Banner.findById({ _id: "banner" });
  res.json(data);
});

app.post("/deleteBanner", async (req, res) => {
  const { remainImage, delImage } = req.body;

  try {
    const data = await Banner.findOneAndReplace(
      { _id: "banner" },
      { images: remainImage }
    );

    if (delImage.length) {
      for (let x = 0; x < delImage.length; x++) {
        const filePath = path.join(rootFolder, "public", "image", delImage[x]);

        fs.unlink(filePath, (err) => console.log(err));
      }
    }

    res.json({ msg: true });
  } catch (err) {
    res.json({ msg: false });
  }
});

app.post("/addUser", async (req, res) => {
  const data = req.body;
  try {
    const addData = await User.create(data);
    console.log(addData);
    res.json({ msg: true });
  } catch (err) {
    console.log(err);
    res.json({ msg: false });
  }
});

app.post("/userLogin", async (req, res) => {
  const { userName, password } = req.body;
  try {
    const data = await User.findOne({ userName: userName });
    if (data && data.password == password) {
      res.json(data);
    } else {
      res.json(false);
    }
  } catch (err) {
    res.json(false);
  }
});

app.post("/userDetail", async (req, res) => {
  const { userName } = req.body;
  try {
    const data = await User.findOne({ userName: userName });
    if (data) {
      res.json(data);
    } else {
      res.json(false);
    }
  } catch (err) {
    res.json(false);
  }
});

app.post("/updateUser", async (req, res) => {
  const data = req.body;
  let obj = data;
  delete obj._id;

  try {
    const update = await User.findOneAndReplace(
      { userName: obj.userName },
      obj
    );
    console.log(update);
    res.json({ msg: true });
  } catch (err) {
    console.log(err);
    res.json({ msg: false });
  }
});

app.post("/addToCart", async (req, res) => {
  const { userName, productName, productId, quantity, price } = req.body;

  try {
    const cart = await Cart.findOne({ _id: userName });
    if (cart) {
      const isItemPresent = await Cart.findOne({
        _id: userName,
        "productDetails.productId": productId,
      });

      if (isItemPresent) {
        const updateCart = await Cart.findOneAndUpdate(
          { _id: userName, "productDetails.productId": productId },
          { $set: { "productDetails.$.quantity": quantity } }
        );
        res.json({ msg: true });
        console.log(updateCart);
      } else {
        const addInCart = await Cart.findOneAndUpdate(
          { _id: userName },
          {
            $push: {
              productDetails: {
                productId: productId,
                productName: productName,
                quantity: quantity,
                price: price,
              },
            },
          }
        );
        console.log(addInCart);
        res.json({ msg: true });
      }
    } else {
      const createCart = await Cart.create({
        _id: userName,
        productDetails: [
          {
            productId: productId,
            productName: productName,
            quantity: quantity,
            price: price,
          },
        ],
      });

      console.log(createCart);
      res.json({ msg: true });
    }
  } catch (err) {
    console.log(err);
    res.json({ msg: false });
  }
});

app.post("/viewCart", async (req, res) => {
  const { _id } = req.body;
  const data = await Cart.findOne({ _id: _id });
  if (data) {
    res.json(data);
  } else {
    res.json(false);
  }
});

app.post("/deleteCartItem", async (req, res) => {
  const { _id, productId } = req.body;
  console.log(typeof _id);
  try {
    const deleteItem = await Cart.findOneAndUpdate(
      { _id: _id },
      {
        $pull: { productDetails: { productId } },
      }
    );
    console.log(deleteItem);
    res.json({ msg: true });
  } catch (err) {
    console.log(err);
    res.json({ msg: false });
  }
});

app.post("/updateCart", async (req, res) => {
  const { _id, productDetails } = req.body;
  try {
    const update = await Cart.findOneAndReplace(
      { _id: _id },
      { productDetails: productDetails }
    );
    console.log(update);
    res.json({ msg: true });
  } catch (err) {
    res.json({ msg: false });
  }
});

app.post("/orderFromCart", async (req, res) => {
  const { userName, data } = req.body;
  let orderData = [];
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;

  try {
    const userData = await User.findOne({ userName: userName });

    if (userData) {
      for (let x = 0; x < data.length; x++) {
        orderData.push({
          userName: userName,
          address: userData.address,
          contactNo: userData.contactNo,
          productId: data[x].productId,
          productName: data[x].productName,
          price: data[x].price,
          quantity: data[x].quantity,
          orderStatus: "pending",
          date: today,
        });
      }

      const takeOrder = await Order.insertMany(orderData);

      const emptyCart = await Cart.findOneAndUpdate(
        { _id: userName },
        { $set: { productDetails: [] } }
      );

      res.json({ msg: true });
    }
  } catch (err) {
    console.log(err);
    res.json({ msg: false });
  }
});

app.post("/buyNow", async (req, res) => {
  const { userName, productId, productName, price, quantity } = req.body;

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;

  try {
    const userData = await User.findOne({ userName: userName });
    console.log(userData);
    const order = await Order.create({
      userName: userName,
      address: userData.address,
      contactNo: userData.contactNo,
      productId: productId,
      productName: productName,
      price: price,
      quantity: quantity,
      orderStatus: "Pending",
      date: today,
    });

    console.log(order);
    res.json({ msg: true });
  } catch (err) {
    console.log(err);
    res.json({ msg: false });
  }
});

app.post("/viewOrder", async (req, res) => {
  try {
    const data = await Order.find({});
    console.log(data);
    res.json(data);
  } catch (err) {
    res.json(false);
  }
});

app.post("/updateOrder", async (req, res) => {
  const { _id, orderStatus } = req.body;
  try {
    const updata = await Order.findOneAndUpdate(
      { _id: _id },
      { $set: { orderStatus: orderStatus } }
    );
    console.log(updata);
    res.json({ msg: true });
  } catch (err) {
    res.json({ msg: false });
  }
});

app.post("/viewUserOrder", async (req, res) => {
  const { _id } = req.body;
  try {
    const data = await Order.find({ userName: _id });
    console.log(data);
    res.json(data);
  } catch (err) {
    console.log(err);
    res.json(false);
  }
});

app.listen(3001, () => {
  console.log("Server is up on port 3001");
});
