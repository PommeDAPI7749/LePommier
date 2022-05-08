const { MessageEmbed }= require('discord.js');
const moment = require('moment');
const { defaultColor } = require('../../util/couleurs');
const { Member } = require("../../models/index");

module.exports.run = async (settings, client, message, args, command) => {
    async function position(member) {
        var membres = await Member.find({ guildID: message.guild.id });
        await membres.sort(function (a, b) {
            return a.level == b.level ? b.experience - a.experience : b.level - a.level;
        });
        var membres2 = []
        await membres.map(m => membres2.push(m.toString()))
        const mem = member.toString()
        var pos = await membres2.indexOf(mem)
        pos = pos+1
        if(pos === 1) return "\\🥇 1er"
        if(pos === 2) return "\\🥈 2ème"
        if(pos === 3) return "\\🥉 3ème"
        return `${pos}ème`
    };
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
    const dbMember = await client.getMember(member)
    const user = member.user
    const dbUser = await client.getUser(user)
    const embed = new MessageEmbed()
    .setAuthor(`Fiche ${user.bot ? 'du bot' : "de l'utilisateur"} ${member.nickname ? member.nickname : user.username}`, user.displayAvatarURL())
    .setColor(defaultColor);
    embed.addFields([
        {
            name: '\\👤 Nom :',
            value: user.tag,
            inline: true,
        },
        {
            name: '\\🆔 ID :',
            value: user.id,
            inline: true,
        },
        {
            name: '\\🤖 Bot :',
            value: user.bot ? 'Oui' : 'Non',
            inline: true,
        },
    ])
    var statusValue =  member.presence.status
    if(statusValue.includes('dnd')) statusValue = statusValue.replace("dnd", 'Ne pas déranger')
    if(statusValue.includes('online')) statusValue = statusValue.replace("online", 'En ligne')
    if(statusValue.includes('idle')) statusValue = statusValue.replace("idle", 'Absent')
    if(statusValue.includes('offline')) statusValue = statusValue.replace("offline", 'Hors ligne')
    var activitiesValue = member.presence.activities.map(a => `${a.type} ${a.name}`).join(',\n')
    for(let i = 0 ; i < member.presence.activities.length ; i++) {
        if(activitiesValue.includes('PLAYING')) activitiesValue = activitiesValue.replace("PLAYING", 'Joue à')
        if(activitiesValue.includes('STREAMING')) activitiesValue = activitiesValue.replace("STREAMING", 'Streame')
        if(activitiesValue.includes('LISTENING')) activitiesValue = activitiesValue.replace("LISTENING", 'Ecoute')
        if(activitiesValue.includes('WATCHING')) activitiesValue = activitiesValue.replace("WATCHING", 'Regarde')
        if(activitiesValue.includes('CUSTOM_STATUS')) activitiesValue = activitiesValue.replace("CUSTOM_STATUS", ' ')
        if(activitiesValue.includes('COMPETING')) activitiesValue = activitiesValue.replace("COMPETING", 'En compétition')
    }
    embed.addFields([
        {
            name: statusValue === 'Ne pas déranger' ? '\\🔴 Status :' : (statusValue === 'En ligne' ? '\\🟢 Status :' : (statusValue === 'Absent' ? '\\🟡 Status :' : '\\⚫ Status :' )),
            value: statusValue,
            inline: true,
        },
        {
            name: member.presence.activities[1] ? '\\🏃‍♂️ Activités :' :'\\🏃‍♂️ Activité :',
            value: member.presence.activities[0] ? activitiesValue : "Aucune activité détecté",
            inline: true,
        },
        {
            name: '\u200b',
            value: '\u200b',
            inline: true,
        },
    ])
    embed.addFields([
        {
            name: '\\🕒 Compte créé le :',
            value: client.tradDate(moment(user.createdAt).format('dddd DD MMMM YYYY')),
            inline: true,
        },
        {
            name: '\\👔 STAFF du bot :',
            value: dbUser.staffBot ? 'Oui' : 'Non',
            inline: true,
        },
        {
            name: '\\⛔ Blacklisté :',
            value: dbUser.blacklisted ? 'Oui' : 'Non',
            inline: true,
        },
    ])
    var roles = await member.roles.cache.map(r => r)
    roles = roles.filter(item => item.name !== '@everyone')
    embed.addFields([
        {
            name: `\\🏁 Arrivée :`,
            value: client.tradDate(moment(member.joinedAt).format('dddd DD MMMM YYYY')),
            inline: true,
        },
        {
            name: '\\🏅 Niveau :',
            value: settings.leveling.enabled ? dbMember.level : 'Leveling désactivé',
            inline: true,
        },
        {
            name: '\\🏆 Rang :',
            value: settings.leveling.enabled ? await position(dbMember) : 'Leveling désactivé',
            inline: true,
        },
    ])
    embed.addFields([
        {
            name: `\\🦺 STAFF du serveur :`,
            value: member.hasPermission('MANAGE_MESSAGES') ? 'Oui' : 'Non',
            inline: true,
        },
        {
            name: '\\👮‍♂️ Administrateur :',
            value: member.hasPermission('ADMINISTRATOR') ? 'Oui' : 'Non',
            inline: true,
        },
        {
            name: '\\👑 Propriétaire du serveur :',
            value: user.id === member.guild.owner.id ? 'Oui' : 'Non',
            inline: true,
        },
    ])
    embed.addField(roles[1] ? '\\👷 Possède les rôles :' : (roles[0] ? '\\👷 Possède le rôle :' : '\\👷 Membre sans rôle'), roles[0] ? roles.join(', ') : '\u200b')
    message.channel.send({embeds: [embed]})
};
module.exports.help = {
    group: 'info',
    name: "userinfo",
    aliases: ["userinfo", "ui"],
    description: "Renvoi des infos sur un utilisateur",
    bug: false,
    precisions: '',
    requireArgs: false,
    argsRequiered: '<@user>',
    exemple: '@PommeD\'API#7749',
    permissions: [],
    permissionsBot: ["MANAGE_MESSAGES", "SEND_MESSAGES"],
};