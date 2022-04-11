const mongoose = require("mongoose");

mongoose
  .connect(process.env.mongo_uri, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected!"))
  .catch((err) => console.log(err));

module.exports = mongoose;
