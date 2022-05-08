const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  userID: String,
  username: String,
  staffBot: {
    "type": Boolean,
    "default": false
  },
  blacklisted: {
    "type": Boolean,
    "default": false
  },
});

module.exports = mongoose.model("User", userSchema);