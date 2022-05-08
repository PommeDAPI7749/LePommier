const {MessageEmbed}= require('discord.js');
const { warningColor } = require('../../util/couleurs');

module.exports.run = async (settings, client, message, args, command) => {
    var user = message.mentions.users.last()
    if(!user || user.id === client.user.id) user = client.users.cache.get(args[0])
    if(!user || user.id === client.user.id) return message.reply('utilisateur introuvable')
    message.guild.members.unban(user)

    const embed = new MessageEmbed()
        .setAuthor(`${user.username} (${user.id})`, user.avatarURL())
        .setColor(warningColor)
        .setDescription(`**Action :** Unban `)
        .setFooter(`par ${message.author.username}`, message.author.avatarURL())
        .setTimestamp();
    const log = client.channels.cache.get(settings.log.channel)
    if(log) log.send({embeds: [embed]})

};

module.exports.help = {
    vanish: true,
    group: 'moderation',
    name: "unban",
    aliases: ['unban'],
    description: "Unbannis un utilisateur",
    bug: false,
    precisions: '',
    requireArgs: true,
    argsRequiered: "<user_id>",
    exemple: '539510339713105950',
    permissions: ["BAN_MEMBERS"],
    permissionsBot: ["BAN_MEMBERS"],
};