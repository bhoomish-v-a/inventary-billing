const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: String,
});

//const User = mongoose.model("users", userSchema); // Collection name: userdetails
const User = mongoose.models.users || mongoose.model("users", userSchema);
module.exports = User;
