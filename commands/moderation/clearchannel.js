const {MessageEmbed}= require('discord.js');
const { warningColor, enCours } = require('../../util/couleurs');

module.exports.run = (settings, client, message, args, command) => {
    const embed = new MessageEmbed()
    .setAuthor(`Vous êtes sur le point de supprimer tous les messages de ce salon`)
    .setColor(enCours)
    .setDescription(`Êtes vous sur de vouloir le faire ?`)
    message.channel.send({embeds: [embed]}).then(embed => {
        const filter1 = msg => msg.author.id === message.author.id && (msg.content.toUpperCase() === 'OUI' || msg.content.toUpperCase() === 'NON')
        message.channel.awaitMessages(filter1, { max: 1, time: 60000 }).then(async collected => {
            if(collected.size >= 1) {
                const annulation = collected.find(m => m.content.toUpperCase() === 'NON')
                if(annulation) {
                    await client.annulation(message)
                    embed.delete()
                    annulation.delete()
                } else {
                    message.channel.clone().then(ch => ch.send(`${message.author}, le salon a été purgé !`).then(msg => msg.delete({timeout : 5000})))
                    message.channel.delete()
                    const embed = new MessageEmbed()
                    .setAuthor(`${message.author.username} (${message.author.id})`, message.author.avatarURL())
                    .setColor(warningColor)
                    .setDescription(`A vidé le salon \`${message.channel.name}\``)
                    .setFooter()
                    .setTimestamp();
                    const log = client.channels.cache.get(settings.log.channel)
                    if(log) log.send({embeds: [embed]})
                };
            } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
        });
    });
};

module.exports.help = {
    vanish: true,
    group: 'moderation',
    name: "clearchannel",
    aliases: ['clearchannel'],
    description: "Vide un salon",
    bug: false,
    precisions: '',
    requireArgs: false,
    argsRequiered: "",
    permissions: ['MANAGE_MESSAGES', 'MANAGE_CHANNELS'],
    permissionsBot: ["MANAGE_MESSAGES", "MANAGE_CHANNELS"],
};