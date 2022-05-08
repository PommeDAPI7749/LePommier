const mongoose = require("mongoose");

const ticketSystemSchema = mongoose.Schema({
    guildID: String,
    messageOpenTicketID: String,
    roleID: String,
    objet: String,
    category: String,
    pannelChannel: String,
    messageWelcome: String,
});

module.exports = mongoose.model("TicketSystem", ticketSystemSchema);