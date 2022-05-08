const mongoose = require("mongoose");

const rulesSchema = mongoose.Schema({
    channelID: String,
    guildID: String,
    messageReglement: String,
    role: String,
    title: String,
    description: String,
    rules: Array,
});

module.exports = mongoose.model("Rules", rulesSchema);