const mongoose = require("mongoose");

const ticketSchema = mongoose.Schema({
  userID: String,
  channelID: String,
  guildID: String,
  messageCloseID: String,
  ticketObject: String,
  lock: Boolean,
});

module.exports = mongoose.model("Ticket", ticketSchema);