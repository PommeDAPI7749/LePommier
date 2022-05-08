const mongoose = require("mongoose");
const { Member } = require("../../models/index");

module.exports = client => {
    client.createMember = async member => {
        const merged = Object.assign({ _id: mongoose.Types.ObjectId() }, member);
        const createMember = await new Member(merged);
        createMember.save();
    };
    
    client.getMember = async (member) => {
        const data = await Member.findOne({ userID: member.id, guildID: member.guild.id });
        if(data) {
          return data;
        } else {
          await client.createMember({
            userID: member.id,
            guildID: member.guild.id,
          });
          return {
            userID: member.id,
            warns: [],
            guildID: member.guild.id,
            experience: 0,
            level: 0,
          }
        }
    };
    
    client.addExp = async (client, member, exp) => {
        const userToUpdate = await client.getMember(member);
        const updatedExp = userToUpdate.experience + exp;
        await client.updateMember(member, { experience: updatedExp });
    };
      
    client.updateLevel = async (message) => {
        var userToUpdate = await client.getMember(message.member);
        const levelExp = userToUpdate.level*userToUpdate.level*3+20;
        const updatedExp = userToUpdate.experience - levelExp;
        await client.updateMember(message.member, { experience: updatedExp });
        await client.updateMember(message.member, { level: userToUpdate.level + 1 });
        userToUpdate = await client.getMember(message.member);
        message.channel.send(`Bravo ${message.author} ! Tu viens de passer au niveau ${userToUpdate.level} !`).then(m => m.delete({timeout: 5000}))
    };
    
    client.updateMember = async (member, settings) => {
        let data = await client.getMember(member);
        if(typeof data !== "object") data = {};
        for (const key in settings) {
          if(data[key] !== settings[key]) data[key] = settings[key];
        }
        return data.updateOne(settings);
    };
    
    client.deleteMember = async (member) => {
        await Member.deleteOne({ userID: member.id, guildID: member.guild.id });
    };

    client.restartLevels = async (message) => {
      var membres = await Member.find({ guildID: message.guild.id });
      message.channel.send('Je suis en train de remettre tous les niveaux à 0...\nCette opération peut prendre du temps !')
      await membres.forEach(async mem => {
        const member = {}
        member.id = mem.userID
        member.guild = {}
        member.guild.id = mem.guildID
        await client.updateMember(member, {level: 0, experience: 0})
      })
      message.channel.send('Tous les niveaux ont été remis à 0')
    }

    client.removeWarn = async (message, member, num) => {
      const data = await client.getMember(member)
      var warns = await data.warns
      const r = warns[num-1]
      if(!r) return message.reply(`avertissement invalide`)
      await warns.splice(r, 1)
      await client.updateMember(member, {warns: warns})
    }
};