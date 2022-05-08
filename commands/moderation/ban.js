const {MessageEmbed}= require('discord.js');
const { warningColor } = require('../../util/couleurs');

module.exports.run = async (settings, client, message, args, command) => {
    var member = message.mentions.members.last()
    if(!member || member.user.id === client.user.id) member = message.guild.members.cache.get(args[0])
    if(!member || member.user.id === client.user.id) return message.reply('utilisateur introuvable')
    if(!member || member.user.id === client.user.id) {
        var user = message.mentions.users.last()
        if(!user || user.id === client.user.id) user = client.users.cache.get(args[0])
        if(!user || user.id === client.user.id) return message.reply('utilisateur introuvable')
    } else user = member.user
    const reason = (args.splice(1).join(' ') || 'Aucune raison spécifiée.');
    if(member) {
        if(!member.bannable) return message.reply('je ne peux pas bannir ce membre')
        if(!member.manageable) return message.reply('je ne peux pas bannir ce membre')
     }
    message.guild.members.ban(user, {
        reason: `${reason}`
    })

    const embed = new MessageEmbed()
        .setAuthor(`${user.username} (${user.id})`, user.avatarURL())
        .setColor(warningColor)
        .setDescription(`**Action :** bannissement \n**Raison :** ${reason}`)
        .setFooter(`par ${message.author.username}`, message.author.avatarURL())
        .setTimestamp();
    const log = client.channels.cache.get(settings.log.channel)
    if(log) log.send({embeds: [embed]})
};

module.exports.help = {
    vanish: true,
    group: 'moderation',
    name: "ban",
    aliases: ['ban'],
    description: "Bannis un utilisateur",
    bug: false,
    precisions: '',
    requireArgs: true,
    argsRequiered: "<@user> <raison>",
    exemple: '@PommeD\'API#7749 Spam et récidive',
    permissions: ["BAN_MEMBERS"],
    permissionsBot: ["BAN_MEMBERS"],
};