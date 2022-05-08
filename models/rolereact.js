const mongoose = require("mongoose");

const roleReactSchema = mongoose.Schema({
    channelID: String,
    guildID: String,
    messageReact: String,
    title: String,
    description: String,
    roles: Array,
    emojis: Array,
    emojisID: Array,
});

module.exports = mongoose.model("RoleReact", roleReactSchema);