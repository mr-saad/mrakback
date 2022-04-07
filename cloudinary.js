require("dotenv").config();

const cloudinary = require("cloudinary").v2;
const { api_key, api_secret, cloud_name } = process.env;

cloudinary.config({
  api_key: api_key,
  api_secret: api_secret,
  cloud_name: cloud_name,
});

module.exports = cloudinary;
