const { MessageEmbed }= require('discord.js');
const { Member } = require("../../models/index");
const moment = require('moment');
const { defaultColor } = require('../../util/couleurs');

module.exports.run = async (settings, client, message, args, command) => {
    const guild = message.guild;
    const nbBots = await guild.members.cache.filter(m => m.user.bot).size;
    const embed = new MessageEmbed()
    .setAuthor(`Fiche du serveur "${guild.name}"`, guild.iconURL())
    .setColor(defaultColor)
    embed.addFields([
        {
            name: '\\👤 Nom :',
            value: guild.name,
            inline: true,
        },
        {
            name: '\\🆔 ID :',
            value: guild.id,
            inline: true,
        },
        {
            name: '\\👑 Propriétaire :',
            value: guild.owner.user.tag,
            inline: true
        },
    ])
    embed.addFields([
        {
            name: '\\🚨 Niveau de vérification :',
            value: client.verifLevel(guild),
            inline: true,
        },
        {
            name: '\\🔞 Filtre anti contenu explicite :',
            value: client.contentExplicit(guild),
            inline: true
        },
        {
            name: '\\🔔 Notifications par défaut',
            value: guild.defaultMessageNotification === 'ALL' ? 'Tous les messages' : 'Mentions uniquement',
            inline: true,
        },
    ])
    embed.addFields([
        {
            name: '\\🕒 Créé le :',
            value: client.tradDate(moment(guild.createdAt).format('dddd DD MMMM YYYY')),
            inline: true,
        },
        {
            name: '\\💬 Salons Textuels :',
            value: guild.channels.cache.filter(ch => ch.type === 'text').size,
            inline: true,
        },
        {
            name: '\\🔊 Salons Vocaux :',
            value: guild.channels.cache.filter(ch => ch.type === 'voice').size,
            inline: true
        },
    ])
    embed.addFields([
        {
            name: '\\👥 Population :',
            value: guild.memberCount,
            inline: true,
        },
        {
            name: '\\👨‍👨‍👦‍👦 Humains :',
            value: guild.memberCount - nbBots,
            inline: true,
        },
        {
            name: '\\🤖 Robots :',
            value: nbBots,
            inline: true
        },
    ])
    embed.addFields([
        {
            name: '\\📥 Salon d\'arrivée :',
            value: message.guild.channels.cache.get(settings.welcome.channel) ? message.guild.channels.cache.get(settings.welcome.channel) : 'Indéfini',
            inline: true,
        },
        {
            name: '\\📦 Salon de logs :',
            value: message.guild.channels.cache.get(settings.log.channel) ? message.guild.channels.cache.get(settings.log.channel) : 'Indéfini',
            inline: true
        },
        {
            name: '\\📤 Salon de départ :',
            value: message.guild.channels.cache.get(settings.leave.channel) ? message.guild.channels.cache.get(settings.leave.channel) : 'Indéfini',
            inline: true,
        },
    ])
    var membres = await Member.find({ guildID: message.guild.id });
    await membres.sort(function (a, b) {
        return b.level - a.level;
    });
    embed.addFields([
        {
            name: '\\🏆 Classement du leveling :',
            value: settings.leveling.enabled ? `\\🥇 ${message.guild.members.cache.get(membres[0].userID).nickname ? message.guild.members.cache.get(membres[0].userID).nickname : client.users.cache.get(membres[0].userID).username} : Niveau ${membres[0].level}\n\\🥈 ${message.guild.members.cache.get(membres[1].userID).nickname ? message.guild.members.cache.get(membres[1].userID).nickname : client.users.cache.get(membres[1].userID).username} : Niveau ${membres[1].level}\n\\🥉 ${message.guild.members.cache.get(membres[2].userID).nickname ? message.guild.members.cache.get(membres[2].userID).nickname : client.users.cache.get(membres[2].userID).username} : Niveau ${membres[2].level}` : 'Système de niveaux désactivé',
            inline: true,
        },
        {
            name: '\u200b',
            value: '\u200b',
            inline: true,
        },
    ])
    var roles = await guild.roles.cache.map(r => r.name)
    roles = roles.filter(item => item !== '@everyone')
    embed.addField(`\\👷 Rôles (${guild.roles.cache.size - 1}) :`, `\`${roles.join('\`, \`')}\``)
    message.channel.send({embeds: [embed]})
};

module.exports.help = {
    group: 'info',
    name: "serverinfo",
    aliases: ["serveurinfo", "si"],
    description: "Renvoi des infos sur le serveur ou la commande a été tapée",
    bug: false,
    precisions: '',
    requireArgs: false,
    argsRequiered: false,
    permissions: [],
    permissionsBot: ["MANAGE_MESSAGES", "SEND_MESSAGES"],
};