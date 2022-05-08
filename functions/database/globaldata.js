const mongoose = require("mongoose");
const { globalData } = require("../../models/index");

module.exports = client => {
    client.createGlobalData = async () => {
        const merged = Object.assign({
            twitchChannels: [],
            linkWithGuilds: [],
        });
        const createGlobalData = await new globalData(merged);
        createGlobalData.save();
    };
  
    client.getData = async () => {
      const data = await globalData.find({});
      if(data) {
        return data[0]
      } else {
        await client.createGlobalData()
        return {
          twitchChannels: [],
          linkWithGuilds: [],
        };
      }
    };

    client.updateGlobalData = async (settings) => {
      let data = await client.getData();
      if(typeof data !== "object") data = {};
      for (const key in settings) {
        if(data[key] !== settings[key]) data[key] = settings[key];
      }
      return data.updateOne(settings);
    };
}