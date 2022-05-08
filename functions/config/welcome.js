const { MessageEmbed } = require("discord.js");
const { enCours, validColor, warningColor, invisible } = require("../../util/couleurs");

module.exports = client => {
    client.wlcmChannel = async (message, settings) => {
        const embed = new MessageEmbed()
        .setTitle("Salon de bienvenue")
        .setColor(enCours)
        .setDescription(`Salon de bienvenue actuel: ${message.guild.channels.cache.get(settings.welcome.channel) || 'indéfini'}`)
        .setFooter("Répondez \"MODIFIER\" pour modifier")
        const filter1 = msg => msg.author.id === message.author.id && (msg.content.toUpperCase() === "MODIFIER" || msg.content.toLowerCase().startsWith(settings.prefix));
        message.channel.send({embeds: [embed]}).then(msg => {
            message.channel.awaitMessages(filter1, { max: 1, time: 60000 }).then(async collected => {
                if(collected.size >= 1) {
                    const tre = collected.find(m => m.content.toUpperCase() == 'MODIFIER')
                    if(!tre) return
                    tre.delete()
                    modifwlcmChannel(message, settings)
                } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
                msg.delete()
            });
        });
    };

    modifwlcmChannel = async (message, settings) => {
        const embed2 = new MessageEmbed()
        .setColor(invisible)
        .setTitle('Modification du salon de bienvenue')
        .setDescription("Pour modifier le salon de bienvenue il vous suffit de le mentionner ou d'envoyer son ID ici dans la minute")
        .setFooter('Répondez "ANNULER" pour annuler')
        const filter1 = msg => msg.author.id === message.author.id;
        message.channel.send({embeds: [embed2]}).then(msg => {
            message.channel.awaitMessages(filter1, { max: 1, time: 60000 }).then(async collected => {
                if(collected.size >= 1) {
                    const annulation = collected.find(m => m.content.toUpperCase() === 'ANNULER')
                    if(annulation) {
                        client.annulation(message)
                        annulation.delete
                    } else {
                        const tre = collected.find(m => m.content.toUpperCase() !== 'ANNULER')
                        tre.delete()
                        var newChannel = tre.mentions.channels.first()
                        if(!newChannel) newChannel = message.guild.channels.cache.get(tre.content)
                        if(newChannel) {
                            const embedmodif = new MessageEmbed()
                            .setColor(validColor)
                            .setTitle(`Salon de bienvenue mis à jour`)
                            .setDescription(`Avant : ${message.guild.channels.cache.get(settings.welcome.channel)}\nMaintenant : ${newChannel}`)
                            .setFooter(`${client.user.username} by PommeD'API#7749`)
                            .setTimestamp();
                            const embedmodif2 = new MessageEmbed()
                            .setColor(validColor)
                            .setTitle('Confirmation')
                            .setDescription(`Salon de bienvenue mis à jour`)
                            .setFooter(`${client.user.username} by PommeD'API#7749`)
                            var sett = settings.welcome
                            sett.channel = newChannel.id
                            client.updateGuild(message.guild, { welcome: sett });
                            const logs = client.channels.cache.get(settings.log.channel)
                            if(logs) logs.send({embeds: [embedmodif]})
                            message.channel.send({embeds: [embedmodif2]})
                        } else {
                            message.reply("salon introuvable ...").then(m => m.delete({timeout: 5000}))
                            modifwlcmChannel(message, settings)
                        };
                    };
                } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
                msg.delete()
            });
        });
    };

    client.wlcmMessage = async (message, settings) => {
        const embed = new MessageEmbed()
        .setTitle("Message de bienvenue")
        .setColor(enCours)
        .setDescription(`Message de bienvenue actuel: \`${settings.welcome.message}\``)
        .setFooter("Répondez \"MODIFIER\" pour modifier")
        const filter1 = msg => msg.author.id === message.author.id && (msg.content.toUpperCase() === "MODIFIER" || msg.content.toLowerCase().startsWith(settings.prefix));
        message.channel.send({embeds: [embed]}).then(msg => {
            message.channel.awaitMessages(filter1, { max: 1, time: 60000 }).then(async collected => {
                if(collected.size >= 1) {
                    const tre = collected.find(m => m.content.toUpperCase() != 'MODIFIER')
                    if(tre) return
                    const embed2 = new MessageEmbed()
                    .setColor(enCours)
                    .setTitle("Modification du message de bienvenue")
                    .setDescription("Pour modifier le message de bienvenue il vous suffit de l'envoyer ici dans la minute\nDans votre message vous pouvez utiliser : \`{{userMention}}\`, \`{{userName}}\`, \`{{userTag}}\`, \`{{guildName}}\`, \`{{MC}}\`")
                    .setFooter(`Envoyez "ANNULER" pour annuler`)
                    const filter1 = msg => msg.author.id === message.author.id;
                    message.channel.send({embeds: [embed2]}).then(() => {
                        message.channel.awaitMessages(filter1, { max: 1, time: 60000 }).then(async collected => {
                            if(collected.size >= 1) {
                                const annulation = collected.find(m => m.content.toUpperCase() === 'ANNULER')
                                if(annulation) {
                                    client.annulation(message)
                                    annulation.delete()
                                } else {
                                    const tre = collected.find(m => m.content.toUpperCase() !== 'ANNULER')
                                    tre.delete()
                                    if(tre.content.length > 2048) {
                                        message.reply("Votre message de bienvenue est trop long. Maximum : 2048 caractères")
                                        return client.wlcmMessage(message, settings)
                                    }
                                    const newMessage = tre.content
                                    const embedmodif = new MessageEmbed()
                                    .setColor(validColor)
                                    .setTitle('Message de bienvenue mis à jour')
                                    .setDescription(`Avant : ${settings.welcome.message}\nMaintenant : ${newMessage}`)
                                    .setFooter(`${client.user.username} by PommeD'API#7749`)
                                    .setTimestamp();
                                    const embedmodif2 = new MessageEmbed()
                                    .setColor(validColor)
                                    .setTitle('Confirmation')
                                    .setDescription(`Message de bienvenue mis à jour`)
                                    .setFooter(`${client.user.username} by PommeD'API#7749`)
                                    var sett = settings.welcome
                                    sett.message = newMessage
                                    client.updateGuild(message.guild, { welcome: sett });
                                    const logs = client.channels.cache.get(settings.log.channel)
                                    if(logs) logs.send({embeds: [embedmodif]})
                                    message.channel.send({embeds: [embedmodif2]})
                                }
                            } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
                        });
                    });
                } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
                msg.delete()
            });
        });
    };

    client.wlcmEnable = async (message, settings) => {
        await client.updateGuild(message.guild, {welcome: {enabled: true, message: '', channel: '', image: true}})
        settings.welcome = {enabled: true, message: '', channel: '', image: true}
        await modifwlcmChannel(message, settings)
    }
};