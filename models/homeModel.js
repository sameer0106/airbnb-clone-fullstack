const mongoose = require("mongoose");

const homeSchema = new mongoose.Schema({
  homename: {
    type: String,
    required: true,
  },
  rentprice: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  houseImage: String,
  description: String,

  // defining usertype for home too for authorizing home auth.
  host: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "userCollection",
    required: true,
  }
});

module.exports = mongoose.model("HomeCollection", homeSchema);