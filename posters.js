const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  desc: {
    type: String,
    required: true,
  },
  post_url: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  public_id: {
    type: String,
    required: true,
  },
});

const Posters = new mongoose.model("Poster", Schema);

module.exports = Posters;
