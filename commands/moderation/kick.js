const {MessageEmbed}= require('discord.js');
const { enCours } = require('../../util/couleurs');

module.exports.run = async (settings, client, message, args, command) => {
    var member = message.mentions.members.last()
    if(!member || member.user.id === client.user.id) member = message.guild.members.cache.get(args[0])
    if(!member || member.user.id === client.user.id) return message.reply('membre introuvable')
    if(!member.kickable) return message.reply('je ne peux pas exclure ce membre')
    if(!member.manageable) return message.reply('je ne peux pas exclure ce membre')
    const reason = (args.splice(1).join(' ') || 'Aucune raison spécifiée.');

    const embed = new MessageEmbed()
        .setAuthor(`${member.username} (${member.id})`, member.avatarURL())
        .setColor(enCours)
        .setDescription(`**Action :** expulsion \n**Raison :** ${reason}`)
        .setFooter(`par ${message.author.username}`, message.author.avatarURL())
        .setTimestamp();

    member ? message.guild.member(member).kick(reason) : message.channel.send(`Cet utilisateur n'existe pas`)
    const log = client.channels.cache.get(settings.log.channel)
    if(log) log.send({embeds: [embed]})


};

module.exports.help = {
    vanish: true,
    group: 'moderation',
    name: "kick",
    aliases: ['kick'],
    description: "Kick un utilisateur",
    bug: false,
    precisions: '',
    requireArgs: true,
    argsRequiered: "<@user> <raison>",
    exemple: '@PommeD\'API#7749 Spam et récidive',
    permissions: ["KICK_MEMBERS"],
    permissionsBot: ["KICK_MEMBERS"],
};