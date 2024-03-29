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

const { Product, Banner, User } = require("./db/db");

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

app.listen(3001, () => {
  console.log("Server is up on port 3001");
});
