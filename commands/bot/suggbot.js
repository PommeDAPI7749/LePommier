const { MessageEmbed }= require('discord.js');
const { idoui, idnon } = require('../../util/emotes')
const { defaultColor } = require('../../util/couleurs')

module.exports.run = (settings, client, message, args, command) => {
    const embed = new MessageEmbed()
    .setTitle('NOUVELLE SUGGESTION')
    .setColor(defaultColor)
    .setDescription(args.join(' '))
    .setFooter(`Proposé par : ${message.author.tag}`)
    .setTimestamp();
    const filter = m => message.author.id === m.author.id && (m.content.toUpperCase() === 'OUI' || m.content.toUpperCase() === 'NON')
    message.reply("Cette suggestion va être envoyée dans le serveur support en êtes vous satisfait ?",embed).then(async msg => {
        await message.channel.awaitMessages(filter, { max: 1, time: 60000 }).then(async collected => {
            if(collected.size >= 1) {
                const annulation = collected.find(m => m.content.toUpperCase() === 'NON')
                const tre = collected.find(m => m.content.toUpperCase() !== 'NON')
                if(annulation) {
                    annulation.delete()
                    msg.delete()
                    return message.reply('Action annulée avec succès').then(msg => msg.delete({timeout: 5000}));
                } else {
                    client.guilds.cache.get('750357695932006492').channels.cache.get('750357696632324140').send({embeds: [embed]}).then(async m => {
                        tre.delete()
                        msg.delete()
                        await m.react(idoui)
                        await m.react('➖')
                        await m.react(idnon)
                        client.createSuggestion(args.join(' '), message.author.tag, m.id)
                    });
                    message.reply('suggestion publiée').then(msg => msg.delete({timeout: 5000}))
                }
            } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
        });
    });
};

module.exports.help = {
    vanish: true,
    group: 'bot',
    name: "suggbot",
    alliases: ['suggbot'],
    description: "Envoi une suggestion pour le bot qui sera votée sur le serveur support",
    bug: false,
    precisions: '',
    requireArgs: true,
    argsRequiered: '<suggestion>',
    exemple: 'créer une système anti-spam',
    permissions: [],
    permissionsBot: ["SEND_MESSAGES"],
};