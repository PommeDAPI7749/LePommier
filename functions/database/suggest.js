const mongoose = require("mongoose");
const { Suggestion } = require("../../models/index");

module.exports = client => {
    client.createSuggestion = async (sugg, author, panel) => {
        const merged = Object.assign({
            _id: mongoose.Types.ObjectId(),
            user: author,
            content: sugg,
            messageSuggestion: panel,
            acceptStatus: 1,
        });
        const createSuggestion = await new Suggestion(merged);
        createSuggestion.save();
    };

    client.getSuggestion = async (message) => {
        const data = await Suggestion.find({ messageSuggestion: message});
        if(data[0]) {
            return data[0]
        } else return false;
    };

    client.acceptSugg = async (message, settings) => {
        let data = await client.getSuggestion(message);
        if(typeof data !== "object") data = {};
        for (const key in settings) {
          if(data[key] !== settings[key]) data[key] = settings[key];
        }
        return data.updateOne(settings);
    };
}