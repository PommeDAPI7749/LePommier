const { MessageEmbed } = require("discord.js");
const { defaultColor } = require('../../util/couleurs')

module.exports.run = async (settings, client, message, args, command) => {
    var member = message.mentions.members.last()
    if(!member || member.user.id === client.user.id) member = message.guild.members.cache.get(args[0])
    if(!member || member.user.id === client.user.id) return message.reply('membre introuvable')
    if(!member) return message.reply('membre introuvable')
    const user = member.user
    const memberDB = await client.getMember(member)
    const embed = new MessageEmbed()
    .setAuthor(`${user.username} (${user.id})`, user.displayAvatarURL())
    .setColor(defaultColor)
    .setFooter(`demandé par : ${message.author.tag}`)
    .setTimestamp();
    if(args[1] && args[1].toLowerCase() == 'detail') {
        const warns = memberDB.warns
        if(warns[0]) {
            c = 1
            d = 0
            for(w of warns) {
                if(c <= 24) {
                    await embed.addField(`Avertisement ${c}`, `${w.moderator} \nRaison : \`${w.reason}\``, true)
                } else await d++
                await c++
            }
            if(d > 0) embed.addField(`${d} avertissements supplémentaires`, '\u200b', true)
        } else embed.setDescription(`N'a pas d'avertissements dans ce serveur pour le moment.`)
    } else {
        if(memberDB.warns[0]) {
            embed.setDescription(`${user} a été avertis à ${memberDB.warns.length} reprise.s,\npour plus de précisions : \`${settings.prefix}seewarns <@member> details\``)
        } else embed.setDescription(`N'a pas d'avertissements dans ce serveur pour le moment.`)
    }
    message.channel.send({embeds: [embed]})
};

module.exports.help = {
    vanish: true,
    group: 'moderation',
    name: "seewarns",
    aliases: ['seewarns'],
    description: "Renvoi le nombre d'avertissements adressés au membre défini en arguments",
    bug: false,
    precisions: '',
    requireArgs: true,
    argsRequiered: "<@member> (detail)",
    exemple: '@PommeD\'API#7749',
    permissions: ["MANAGE_MESSAGES"],
    permissionsBot: ["MANAGE_MESSAGES", "SEND_MESSAGES"],
};