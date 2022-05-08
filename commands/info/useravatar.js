const { MessageEmbed }= require('discord.js');
const { defaultColor } = require('../../util/couleurs');

module.exports.run = async (settings, client, message, args, command) => {
    var member = await message.member;
    if(args[0]) {
        if(message.guild.members.fetch(args[0])) {
            if(message.guild.members.fetch(args[0])) {
                member = await message.guild.members.fetch(args[0]);
            }
        } else {
            const t = await message.mentions.users.last()
            if(t.id != client.id) member = await message.mentions.members.last()
        }
    } 
    const user = member.user
    const embed = new MessageEmbed()
    .setTitle(`Avatar de ${member.nickname ? member.nickname : user.username}`)
    .setColor(defaultColor)
    .setImage(user.displayAvatarURL({ dynamic: true }))
    message.channel.send({embeds: [embed]})
};
module.exports.help = {
    group: 'info',
    name: "useravatar",
    aliases: ["useravatar", "avatar", "pp", "pdp"],
    description: "Renvoi l'avatar d'un utilisateur",
    bug: false,
    precisions: '',
    requireArgs: false,
    argsRequiered: '(@user)',
    exemple: '@PommeD\'API#7749',
    permissions: [],
    permissionsBot: ["MANAGE_MESSAGES", "SEND_MESSAGES"],
};