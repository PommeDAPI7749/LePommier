const mongoose = require("mongoose");
const { Guild } = require("../../models/index");

module.exports = client => {
    client.createGuild = async guild => {
      const merged = Object.assign({ _id: mongoose.Types.ObjectId() }, guild);
      const createGuild = await new Guild(merged);
      await createGuild.save().then(g => console.log(`Nouveau serveur -> ${g.guildName}`));
    };
  
    client.getGuild = async guild => {
      const data = await Guild.findOne({ guildID: guild.id });
      if(data) {
        return data
      } else {
        await client.createGuild({
          guildID: guild.id,
          guildName: guild.name,
        })
        return {
          guildID: guild.id,
          guildName: guild.name,
          prefix: "lp:",
          log: {
              enabled: false,
              channel: ""
          },
          welcome: {
              enabled: false,
              message: "",
              channel: ""
          },
          leave: {
              enabled: false,
              message: "",
              channel: ""
          },
          memberCount: {
              enabled: false,
              text: "",
              channel: ""
          },
          captcha: {
              enabled: false,
              role: "",
              channel: ""
          },
          lock: {
              enabled: false,
              role: "",
          },
          autorole: {
              enabled: false,
              role: "",
          },
          sugg: {
              enabled: false,
              channel: "",
          },
          leveling: {
              enable : false,
              rewards: [],
          },
          secu: {
              antiInvite: false,
              antiLien: false,
              antiMention: 0,
              sanctions: [],
              muteRole: '',
          },
        }
      }
    };
  
    client.updateGuild = async (guild, settings) => {
      let data = await client.getGuild(guild);
      if(typeof data !== "object") data = {};
      for (const key in settings) {
        if(data[key] !== settings[key]) data[key] = settings[key];
      }
      return data.updateOne(settings);
    };

    client.deleteGuild = async (guild) => {
      const verif = await client.getGuild(guild.id)
      if(verif) {
        await Guild.deleteOne({ guildID: guild.id });
      } else return
    };
}