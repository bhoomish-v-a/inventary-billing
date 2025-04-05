const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: String,
});

const User = mongoose.model("users", userSchema); // Collection name: userdetails

module.exports = User;
