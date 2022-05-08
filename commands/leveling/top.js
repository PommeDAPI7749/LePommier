const { MessageEmbed } = require("discord.js");
const { Member } = require("../../models/index");
const { defaultColor } = require('../../util/couleurs')

module.exports.run = async (settings, client, message, args, command) => {
    if(settings.leveling.enabled) {
        var membres = await Member.find({ guildID: message.guild.id });
        await membres.sort(function (a, b) {
            return a.level == b.level ? b.experience - a.experience : b.level - a.level;
        });
        const embed = new MessageEmbed()
        .setTitle(`Classement du serveur :`)
        .setColor(defaultColor)
        var c = 0
        for(memDB of membres) {
            var member = await message.guild.members.cache.get(memDB.userID)
            c+=1
            if(c<=9 && member && !member.user.bot) {
                if(member) {
                    member = member.nickname
                }
                if(!member) member = await client.users.cache.get(memDB.userID).username
                    if(c === 1) {
                        embed.addField(`\\🥇 ${member}`, `Niveau : ${memDB.level} (${memDB.experience}/${memDB.level*memDB.level*3+20})`, true)
                    } else if(c === 2) {
                        embed.addField(`\\🥈 ${member}`, `Niveau : ${memDB.level} (${memDB.experience}/${memDB.level*memDB.level*3+20})`, true)
                    } else if(c === 3) {
                        embed.addField(`\\🥉 ${member}`, `Niveau : ${memDB.level} (${memDB.experience}/${memDB.level*memDB.level*3+20})`, true)
                    } else if(memDB) {
                        embed.addField(`${member}`, `Niveau : ${memDB.level} (${memDB.experience}/${memDB.level*memDB.level*3+20})`, true)
                    }
            }
        }
        message.channel.send({embeds: [embed]})
    }
};

module.exports.help = {
    group: 'leveling',
    name: "top",
    aliases: ["top"],
    description: "Renvoie le classement des membres du serveur",
    bug: false,
    precisions: '',
    requireArgs: false,
    argsRequiered: '',
    permissions: [],
    permissionsBot: ["MANAGE_MESSAGES", "SEND_MESSAGES"],
};