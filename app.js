require("dotenv").config();
require("./connection");
const express = require("express");
const app = express();
const Thumbnails = require("./thumbnails");
const Posters = require("./posters");
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
app.get("/thumbnails", async (req, res) => {
  const thumbnails = await Thumbnails.find();
  console.log(thumbnails);
  res.send(thumbnails);
});
app.get("/posters", async (req, res) => {
  const posters = await Posters.find();
  res.send(posters);
});

//insert new
app.post("/new", async (req, res) => {
  const uploadImage = await upload.uploader.upload(req.body.insert.image, {
    upload_preset: "ayans",
    transformation: [{
      quality: "70"
    }]
  });

  const insert =
    req.body.isPoster === true
      ? new Posters({
          title: req.body.insert.title,
          image: uploadImage.secure_url,
          post_url: req.body.insert.post_url,
          likes: req.body.insert.likes,
          desc: req.body.insert.desc,
          public_id: uploadImage.public_id,
        })
      : new Thumbnails({
          title: req.body.insert.title,
          image: uploadImage.secure_url,
          post_url: req.body.insert.post_url,
          likes: req.body.insert.likes,
          desc: req.body.insert.desc,
          public_id: uploadImage.public_id,
        });

  const inserted = await insert.save();
  res.send(inserted);
});

// // delete
app.post("/del", async (req, res) => {
  const del = req.body.id;

  const find = req.body.poster
    ? await Posters.findByIdAndDelete(del)
    : await Thumbnails.findByIdAndDelete(del);

  await upload.uploader.destroy(find.public_id);
});

// update
app.post("/update", async (req, res) => {
  // find
  const finded = req.body.isUpdatePoster
    ? await Posters.findById(req.body.updateId)
    : await Thumbnails.findById(req.body.updateId);

  const { image, likes, title, post_url, desc } = req.body.update;

  // delele
  req.body.update.image !== "" &&
    (await upload.uploader.destroy(finded.public_id));

  // upload again
  const uploadImage =
    req.body.update.image !== "" &&
    (await upload.uploader.upload(req.body.update.image, {
      upload_preset: "ayans",
    }));

  // update fields
  const updated = req.body.isUpdatePoster
    ? await Posters.findByIdAndUpdate(req.body.updateId, {
        title: title === "" ? finded.title : title,
        desc: desc === "" ? finded.desc : desc,
        image: image === "" ? finded.image : uploadImage.secure_url,
        post_url: post_url === "" ? finded.post_url : post_url,
        likes: likes === 0 || "" ? finded.likes : likes,
        public_id: uploadImage.public_id,
      })
    : await Thumbnails.findByIdAndUpdate(req.body.updateId, {
        title: title === "" ? finded.title : title,
        desc: desc === "" ? finded.desc : desc,
        image: image === "" ? finded.image : image,
        post_url: post_url === "" ? finded.post_url : post_url,
        likes: likes === 0 || "" ? finded.likes : likes,
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
