const { MessageEmbed }= require('discord.js');
const { idoui, idnon } = require('../../util/emotes');

module.exports.run = (settings, client, message, args, command) => {
    const ch = message.guild.channels.cache.get(settings.sugg.channel)
    if(ch) {
        const embed = new MessageEmbed()
        .setTitle('NOUVELLE SUGGESTION')
        .setColor('RANDOM')
        .setDescription(args.join(' '))
        .setFooter(`Proposé par : ${message.author.tag}`)
        .setTimestamp();
        const filter = m => message.author.id === m.author.id && (m.content.toUpperCase() === 'OUI' || m.content.toUpperCase() === 'NON')
        message.reply("Cette suggestion va être envoyée dans le salons de suggestions en êtes vous satisfait ?",embed).then(async msg => {
            await message.channel.awaitMessages(filter, { max: 1, time: 60000 }).then(async collected => {
                if(collected.size >= 1) {
                    const annulation = collected.find(m => m.content.toUpperCase() === 'NON')
                    const tre = collected.find(m => m.content.toUpperCase() !== 'NON')
                    if(annulation) {
                        annulation.delete()
                        msg.delete()
                        return message.reply('Action annulée avec succès').then(msg => msg.delete({timeout: 5000}));
                    } else {
                        ch.send({embeds: [embed]}).then(async m => {
                            tre.delete()
                            msg.delete()
                            await m.react(idoui)
                            await m.react('➖')
                            await m.react(idnon)
                        });
                        message.reply('suggestion publiée').then(msg => msg.delete({timeout: 5000}))
                    }
                } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
            });
        });
    } else {
        message.reply("les suggestions sont désactivées sur le serveur (ou le salon de suggestions du serveur est mal défini)")
    }
};

module.exports.help = {
    vanish: true,
    group: 'divers',
    name: "suggestion",
    alliases: ['suggestion', 'sugg'],
    description: "Envoi une suggestion pour le serveur qui sera votée sur le salon prévu a cet effet",
    bug: false,
    precisions: '',
    requireArgs: true,
    argsRequiered: '<suggestion>',
    exemple: 'recruter un modo supplémentaire',
    permissions: [],
    permissionsBot: ["ADMINISTRATOR"],
};