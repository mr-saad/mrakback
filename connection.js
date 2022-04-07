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

const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1254705",
  key: "d45ee330ac2261b51eef",
  secret: "e3e7d29ec9c763320f9c",
  cluster: "ap2",
  useTLS: true,
});

const db = mongoose.connection;

db.once("open", () => {
  console.log("Watching Collections...");

  const posterCollection = db.collection("posters");
  const thumbnailCollection = db.collection("thumbnails");
  const contactCollection = db.collection("contacts");

  const thumbnails = posterCollection.watch();
  const posters = thumbnailCollection.watch();
  const contacts = contactCollection.watch();

  thumbnails.on("change", (change) => {
    if (
      change.operationType === "insert" ||
      change.operationType === "delete" ||
      change.operationType === "update"
    ) {
      pusher.trigger("ayans", "my-event", {});
    }
  });
  posters.on("change", (change) => {
    if (
      change.operationType === "insert" ||
      change.operationType === "delete" ||
      change.operationType === "update"
    ) {
      pusher.trigger("ayans", "my-event", {});
    }
  });
  contacts.on("change", (change) => {
    if (
      change.operationType === "insert" ||
      change.operationType === "delete"
    ) {
      pusher.trigger("ayans", "my-event", {});
    }
  });
});

module.exports = mongoose;
