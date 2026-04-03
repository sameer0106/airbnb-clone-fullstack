const mongoose = require("mongoose");
const HomeCollection = require("../models/homeModel");

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, "fullname is required"],
  },
  username: {
    type: String,
    required: [true, "username is required"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: [true, "email already exist"],
  },
  gender: {
    type: String,
    required: [true, "gender is required"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  usertype: {
    type: String,
    enum: ["guest", "host"],
    default: "guest",
  },
  favourite: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: HomeCollection,
    },
  ],
});

module.exports = mongoose.model("userCollection", userSchema);
