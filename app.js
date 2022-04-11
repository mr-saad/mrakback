require("dotenv").config();
require("./connection");
const express = require("express");
const app = express();
const All = require("./allTypes");
const Contacts = require("./contacts");
const cors = require("cors");
const upload = require("./cloudinary");
const port = process.env.PORT || 5555;

//middlewares
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: false, limit: "30mb" }));
app.use(cors());

//routes
app.get("/", (req, res) => {
  res.send("homepage ayan");
});
app.get("/all", async (req, res) => {
  res.send(await All.find());
});

//insert new
app.post("/new", async (req, res) => {
  const uploadImage = await upload.uploader.upload(req.body.insert.image, {
    upload_preset: "ayans",
    transformation: [{ quality: 60 }],
  });

  const insert = new All({
    title: req.body.insert.title,
    image: uploadImage.secure_url,
    post_url: req.body.insert.post_url,
    type: req.body.insert.type,
    desc: req.body.insert.desc,
    public_id: uploadImage.public_id,
  });

  const inserted = await insert.save();
  res.send(inserted);
});

// delete
app.post("/del", async (req, res) => {
  const del = await All.findByIdAndDelete(req.body.id);
  await upload.uploader.destroy(req.body.public_id);
  res.send(del);
});

// update
app.post("/update", async (req, res) => {
  // find
  const finded = req.body.updateId;

  const { image, type, title, post_url, desc } = req.body.update;

  // delele
  req.body.update.image !== "" &&
    (await upload.uploader.destroy(finded.public_id));

  // upload again
  const uploadImage =
    req.body.update.image !== "" &&
    (await upload.uploader.upload(req.body.update.image, {
      upload_preset: "ayans",
      transformation: [{ quality: 60 }],
    }));

  // update fields
  await All.findByIdAndUpdate(req.body.updateId, {
    title: title === "" ? finded.title : title,
    desc: desc === "" ? finded.desc : desc,
    image: image === "" ? finded.image : uploadImage.secure_url,
    post_url: post_url === "" ? finded.post_url : post_url,
    type: type === "" ? finded.type : type,
    public_id: uploadImage.public_id,
  });
});

//contact

app.post("/contact", async (req, res) => {
  const insert = await new Contacts(req.body).save();
  res.send(insert);
});

app.get("/messages", async (req, res) => {
  res.send(await Contacts.find());
});

app.get("/del/:id", async (req, res) => {
  try {
    const del = await Contacts.findByIdAndDelete(req.params.id);
    res.send(del);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

app.listen(port, () => {
  console.log("App Launched at", port);
});
