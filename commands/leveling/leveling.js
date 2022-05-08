const { MessageEmbed } = require("discord.js");
const { defaultColor } = require("../../util/couleurs");

module.exports.run = async (settings, client, message, args, command) => {
    if((!message.member.permissions.has('MANAGE_GUILD') && message.author.id !== message.guild.owner.user.id)) return message.reply(new MessageEmbed({
        description: `le leveling est actuellement ${settings.leveling.enabled ? 'activé' : 'désactivé'} sur le serveur`,
        color: defaultColor
    }))
    if(!args[0]) return message.reply(new MessageEmbed({
        description: `le leveling est actuellement ${settings.leveling.enabled ? 'activé' : 'désactivé'} sur le serveur`,
        color: defaultColor
    }).setFooter(settings.leveling.enabled ? `Pour désactiver : ${settings.prefix}leveling off` : `Pour activer/réinitialiser : ${settings.prefix}leveling on/restart`))
    if(args[0].toLowerCase() === 'on') {
        if(!settings.leveling.enabled) {
            var obj = {
                enabled: true,
                rewards: []
            }
            await client.updateGuild(message.guild, {leveling: obj})
            return message.reply("le leveling vient d'être activé sur le serveur")
        } else {
            return message.reply("le leveling est déja activé sur le serveur")
        }
    } else if(args[0].toLowerCase() === 'off') {
        if(settings.leveling.enabled) {
            const em = new MessageEmbed()
            .setTitle('Alerte !')
            .setColor(warningColor)
            .setDescription('Vous êtes sur le point de désactiver le systeme de niveaux.\nLes niveaux de tous les membres du serveur seront remis a 0.\nEtes vous certain de ce que vous faites ?')
            .setFooter('Repondez par "OUI" ou par "NON"')
            const filter1 = msg => msg.author.id === message.author.id && (msg.content.toUpperCase() === "OUI" || msg.content.toUpperCase() === "NON");
            message.channel.send({embeds: [em]}).then(() => {
                message.channel.awaitMessages(filter1, { max: 1, time: 60000 }).then(async collected => {
                    if(collected.size >= 1) {
                        const annulation = collected.find(m => m.content.toUpperCase() === 'NON')
                        if(annulation) {
                            return message.reply('action annulée')
                        } else {
                            await client.restartLevels(message)
                            var obj = {
                                enabled: false,
                                rewards: []
                            }
                            await client.updateGuild(message.guild, {leveling: obj})
                            return message.reply("le leveling vient d'être désactivé sur le serveur")
                        }
                    } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
                });
            });
        } else {
            return message.reply("le leveling est déja désactivé sur le serveur")
        }
    } else if(args[0].toLowerCase() === 'restart') {
        if(settings.leveling.enabled) {
            const em = new MessageEmbed()
            .setTitle('Alerte !')
            .setColor(warningColor)
            .setDescription('Vous êtes sur le point de remettre les niveaux de tous les membres du serveur à 0.\nÊtes vous certain de ce que vous faites ?')
            .setFooter('Repondez par "OUI" ou par "NON"')
            const filter1 = msg => msg.author.id === message.author.id && (msg.content.toUpperCase() === "OUI" || msg.content.toUpperCase() === "NON");
            message.channel.send({embeds: [em]}).then(() => {
                message.channel.awaitMessages(filter1, { max: 1, time: 60000 }).then(async collected => {
                    if(collected.size >= 1) {
                        const annulation = collected.find(m => m.content.toUpperCase() === 'NON')
                        if(annulation) {
                            return message.reply('action annulée')
                        } else {
                            client.restartLevels(message)
                        }
                    } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
                });
            });
        } else {
            return message.reply("le leveling est désactivé sur le serveur")
        }
    } else {
        const help =  await client.sendHelpCmd(command, settings, message)
        message.reply('argument invalide, voici un message d\'aide :', help)
    }
};

module.exports.help = {
    group: 'leveling',
    name: "leveling",
    aliases: ['leveling'],
    description: "Reseigne l'utilisateur sur le status actuel du leveling",
    bug: false,
    precisions: '',
    requireArgs: false,
    argsRequiered: '(on/off/restart)',
    permissions: [],
    permissionsBot: ["MANAGE_MESSAGES", "SEND_MESSAGES"],
};