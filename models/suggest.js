const mongoose = require("mongoose");

const suggSchema = mongoose.Schema({
    user: String,
    content: String,
    messageSuggestion: String,
    acceptStatus: Number,
});

module.exports = mongoose.model("Suggestion", suggSchema);