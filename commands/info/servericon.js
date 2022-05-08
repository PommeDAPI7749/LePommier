const { MessageEmbed }= require('discord.js');
const { defaultColor } = require('../../util/couleurs');

module.exports.run = async (settings, client, message, args, command) => {
    const embed = new MessageEmbed()
    .setTitle(`Image du serveur ${message.guild.name}`)
    .setColor(defaultColor)
    .setImage(message.guild.iconURL({ dynamic: true }))
    message.channel.send({embeds: [embed]})
};
module.exports.help = {
    group: 'info',
    name: "serveuricon",
    aliases: ["serveuricon", "guildicon", "icon"],
    description: "Renvoi l'icone du serveur",
    bug: false,
    precisions: '',
    requireArgs: false,
    argsRequiered: '',
    exemple: '',
    permissions: [],
    permissionsBot: ["MANAGE_MESSAGES", "SEND_MESSAGES"],
};