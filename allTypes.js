const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  desc: {
    type: String,
    required: true,
    trim: true,
  },
  post_url: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  public_id: {
    type: String,
    required: true,
  },
});

const All = new mongoose.model("AllType", Schema);

module.exports = All;
