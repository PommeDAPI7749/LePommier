const { enCours, validColor } = require("../../util/couleurs")
const { MessageEmbed } = require('discord.js')

module.exports.run = (settings, client, message, args, command) => {
    const pom = client.users.cache.get('539510339713105950')
    const valid = new MessageEmbed()
    .setTitle("Report d'un Bug")
    .setColor(validColor)
    .setDescription(`Merci pour ton aide ${message.author.username} ! \nJe vais peut être te contacter en MP si j'ai besoin de précisions ;)`) 
    .setTimestamp()
    .setFooter(`PommeD'API#7749`)
    const reportch = client.channels.cache.get("762755997574889482")
    if(!args[0]) {
        const jber = new MessageEmbed()
        .setTitle("Report")
        .setColor(enCours)
        .setDescription(`Vous avez 60 secondes pour envoyer un message qui décrit le bug repéré dans ce salon`)
        const filter1 = msg => msg.author.id === message.author.id;
        message.channel.send({embeds: [jber]}).then(() => {
            message.channel.awaitMessages(filter1, { max: 1, time: 60000 }).then(async collected => {
                if(collected.size >= 1) {
                    const m = collected.find(m => m.author === message.author)
                    const embed = new MessageEmbed()
                    .setTitle("Report d'un bug")
                    .setColor("#2f3136")
                    .setDescription(m.content) 
                    .setTimestamp()
                    .setFooter(`Bug trouvé par ${message.author.tag}`)
                    message.channel.send({content: 'Cet embed va etre envoyé a PommeD\'API#7749 en êtes vous satisfait ?', embeds: [embed]}).then(() => {
                        const filter1 = msg => msg.author.id === message.author.id && (msg.content.toLowerCase() === 'oui' || msg.content.toLowerCase() === 'non');
                        message.channel.awaitMessages(filter1, { max: 1, time: 60000 }).then(async collected => {
                            if(collected.size >= 1) {
                                const annulation = collected.find(m => m.content.toLowerCase() === 'non')
                                if(!annulation) {
                                    reportch.send({content : `${pom}`, embeds: [embed]})
                                    message.reply(valid);
                                } else {
                                    message.reply('report annulé avec succès')
                                }
                            } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
                        });
                    });
                } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
            });
        });
    } else {
        const embed = new MessageEmbed()
        .setTitle("Report d'un bug")
        .setColor("#2f3136")
        .setDescription(args.join(" ")) 
        .setTimestamp()
        .setFooter(`Bug trouvé par ${message.author.tag}`)
        message.channel.send({content: 'Cet embed va etre envoyé a PommeD\'API#7749 êtes vous satisfait ?', embeds: [embed]}).then(() => {
            const filter1 = msg => msg.author.id === message.author.id && (msg.content.toLowerCase() === 'oui' || msg.content.toLowerCase() === 'non');
            message.channel.awaitMessages(filter1, { max: 1, time: 60000 }).then(async collected => {
                if(collected.size >= 1) {
                    const annulation = collected.find(m => m.content.toLowerCase() === 'non')
                    if(!annulation) {
                        reportch.send({content: `[](@everyone)`, embeds: [embed]})
                        message.reply(valid);
                    } else {
                        message.reply('report annulé avec succès')
                    }
                } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
            });
        });
    }
    
}

module.exports.help = {
    group: 'bot',
    name: "reportbug",
    aliases: ["reportbug"],
    description: "Permet de contacter le développeur pour lui signaler un bug",
    bug: false,
    precisions: '',
    requireArgs: true,
    argsRequiered: '<bug_repéré>',
    exemple: 'le bot de réponds pas sur mon serveur',
    permissions: [],
    permissionsBot: ["SEND_MESSAGES"],
};