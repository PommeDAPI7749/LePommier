const mongoose = require("mongoose");
const { defaultColor } = require("../util/couleurs");

const memberSchema = mongoose.Schema({
  userID: String,
  username: String,
  guildID: String,
  warns: Array,
  experience: {
    "type": Number,
    "default": 0
  },
  level: {
    "type": Number,
    "default": 1
  },
  color: {
    "type": String,
    "default": defaultColor,
  }
});

module.exports = mongoose.model("Member", memberSchema);