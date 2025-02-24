const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  bio: { type: String, default: "" },
});

userSchema.index({ username: 1 }); // Index for search optimization

module.exports = mongoose.model("User", userSchema);