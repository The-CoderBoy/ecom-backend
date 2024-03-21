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
app.use(express.static("public"));
app.use(cors());
app.use(express.static("public"));

//------------------------ DB --------------------

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/eCom");
  console.log("database connnected");
}

const { Product } = require("./db/db");

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

app.listen(3001, () => {
  console.log("Server is up on port 3001");
});
