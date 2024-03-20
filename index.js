const express = require("express");
const app = express();
var cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const upload = multer({ dest: "public/image" });

//------------------- middelware ----------------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());

//------------------------ DB --------------------

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/eCom");
  console.log("database connnected");
}

const { Product } = require("./db/db");

//---------------------------------

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
  } catch (err) {
    console.log(err);
  }

  res.json({ msg: true });
});

app.post("/viewProduct", async (req, res) => {
  console.log("hello");
  const data = await Product.find({});
  res.json(data);
});

app.listen(3001, () => {
  console.log("Server is up on port 3001");
});
