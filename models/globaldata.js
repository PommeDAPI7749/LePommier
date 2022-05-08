const mongoose = require("mongoose");

const globalDataSchema = mongoose.Schema({
    twitchChannels: Array,
    linkWithGuilds: Array,
});

module.exports = mongoose.model("globalData", globalDataSchema);