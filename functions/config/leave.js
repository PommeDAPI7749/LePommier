const { MessageEmbed } = require("discord.js");
const { enCours, validColor, warningColor, invisible } = require("../../util/couleurs");

module.exports = client => {
    client.leaveChannel = async (message, settings) => {
        const embed = new MessageEmbed()
        .setTitle("Salon d'au revoir")
        .setColor(enCours)
        .setDescription(`Salon d'au revoir actuel: ${message.guild.channels.cache.get(settings.leave.channel) || 'indéfini'}`)
        .setFooter("Répondez \"MODIFIER\" pour modifier")
        const filter1 = msg => msg.author.id === message.author.id && (msg.content.toUpperCase() === "MODIFIER" || msg.content.toLowerCase().startsWith(settings.prefix));
        message.channel.send({embeds: [embed]}).then(msg => {
            message.channel.awaitMessages(filter1, { max: 1, time: 60000 }).then(async collected => {
                if(collected.size >= 1) {
                    const tre = collected.find(m => m.content.toUpperCase() == 'MODIFIER')
                    if(!tre) return
                    tre.delete()
                    modifLeaveChannel(message, settings)
                } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
                msg.delete()
            });
        });
    };

    modifLeaveChannel = async (message, settings) => {
        const embed2 = new MessageEmbed()
        .setColor(invisible)
        .setTitle('Modification du salon d\'au revoir')
        .setDescription("Pour modifier le salon d'au revoir il vous suffit de le mentionner ou d'envoyer son ID ici dans la minute")
        .setFooter('Répondez "ANNULER" pour annuler')
        const filter1 = msg => msg.author.id === message.author.id;
        message.channel.send({embeds: [embed2]}).then(msg => {
            message.channel.awaitMessages(filter1, { max: 1, time: 60000 }).then(async collected => {
                if(collected.size >= 1) {
                    const annulation = collected.find(m => m.content.toUpperCase() === 'ANNULER')
                    if(annulation) {
                        client.annulation(message)
                        annulation.delete()
                    } else {
                        const tre = collected.find(m => m.content.toUpperCase() !== 'ANNULER')
                        tre.delete()
                        var newChannel = tre.mentions.channels.first()
                        if(!newChannel) newChannel = await message.guild.channels.cache.get(tre.content)
                        if(newChannel) {
                            const embedmodif = new MessageEmbed()
                            .setColor(validColor)
                            .setTitle('Salon d\'au revoir mis à jour')
                            .setDescription(`Avant : ${message.guild.channels.cache.get(settings.leave.channel)}\nMaintenant : ${message.guild.channels.cache.get(newChannel)}`)
                            .setFooter(`${client.user.username} by PommeD'API#7749`)
                            .setTimestamp();
                            const embedmodif2 = new MessageEmbed()
                            .setColor(validColor)
                            .setTitle('Confirmation')
                            .setDescription(`Salon d'au revoir mis à jour`)
                            .setFooter(`${client.user.username} by PommeD'API#7749`)
                            var sett = settings.leave
                            sett.enabled = true
                            sett.channel = newChannel.id
                            await client.updateGuild(message.guild, {leave: sett})
                            const logs = client.channels.cache.get(settings.log.channel)
                            if(logs) logs.send({embeds: [embedmodif]})
                            message.channel.send({embeds: [embedmodif2]})
                        } else {
                            errorLeaveChannel(message, settings)
                        };
                    };
                        
                } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
                msg.delete()
            });
        });
    };

    errorLeaveChannel = async (message, settings) => {
        const embederror = new MessageEmbed()
        .setColor(warningColor)
        .setTitle('ERREUR')
        .setDescription('Salon introuvable, veuillez utiliser l\'ID du salon')
        .setFooter("vous configurez le salon d'au revoir, envoyez \"ANNULER\" pour annuler")
        const filter1 = msg => msg.author.id === message.author.id;
        message.reply(embederror).then(msg => {
            message.channel.awaitMessages(filter1, { max: 1, time: 60000 }).then(async collected => {
                if(collected.size >= 1) {
                    const annulation = collected.find(m => m.content.toUpperCase() === 'ANNULER')
                    if(annulation) {
                        client.annulation(message)
                        annulation.delete()
                    } else {
                        const tre = collected.find(m => m.content.toUpperCase() !== 'ANNULER')
                        tre.delete()
                        const newChannel = tre.content
                        if(message.guild.channels.cache.get(newChannel)) {
                            const embedmodif = new MessageEmbed()
                            .setColor(validColor)
                            .setTitle(`Salon d'au revoir mis à jour`)
                            .setDescription(`Avant : ${message.guild.channels.cache.get(settings.leave.channel)}\nMainteant : ${message.guild.channels.cache.get(newChannel)}`)
                            .setFooter(`${client.user.username} by PommeD'API#7749`)
                            .setTimestamp();
                            const embedmodif2 = new MessageEmbed()
                            .setColor(validColor)
                            .setTitle('Confirmation')
                            .setDescription(`Salon d'au revoir mis à jour`)
                            .setFooter(`${client.user.username} by PommeD'API#7749`)
                            var sett = settings.leave
                            sett.channel = newChannel
                            await client.updateGuild(message.guild, {leave: sett})
                            const logs = client.channels.cache.get(settings.log.channel)
                            if(logs) logs.send({embeds: [embedmodif]})
                            message.channel.send({embeds: [embedmodif2]})
                        } else errorLeaveChannel(message,settings)
                    };
                } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
                msg.delete()
            });
        });
    };

    client.leaveMessage = async (message, settings) => {
        const embed = new MessageEmbed()
        .setTitle("Message d'au revoir")
        .setColor(enCours)
        .setDescription(`Message d'au revoir actuel: \`${settings.leave.message}\``)
        .setFooter("Répondez \"MODIFIER\" pour modifier")
        const filter1 = msg => msg.author.id === message.author.id && (msg.content.toUpperCase() === "MODIFIER" || msg.content.toLowerCase().startsWith(settings.prefix));
        message.channel.send({embeds: [embed]}).then(msg => {
            message.channel.awaitMessages(filter1, { max: 1, time: 60000 }).then(async collected => {
                if(collected.size >= 1) {
                    const tre = collected.find(m => m.content.toUpperCase() != 'MODIFIER')
                    if(tre) return
                    const embed2 = new MessageEmbed()
                    .setColor(enCours)
                    .setTitle("Modification du message d'au revoir")
                    .setDescription("Pour modifier le message d'au revoir il vous suffit de l'envoyer ici dans la minute\nDans votre message vous pouvez utiliser : \`{{userName}}\`, \`{{userTag}}\`, \`{{guildName}}\`, \`{{MC}}\`")
                    .setFooter(`Envoyez "ANNULER" pour annuler`)
                    const filter1 = msg => msg.author.id === message.author.id;
                    message.channel.send({embeds: [embed2]}).then(() => {
                        message.channel.awaitMessages(filter1, { max: 1, time: 60000 }).then(async collected => {
                            if(collected.size >= 1) {
                                const annulation = collected.find(m => m.content.toUpperCase() === 'ANNULER')
                                if(annulation) {
                                    annulation.delete()
                                    client.annulation(message)
                                } else {
                                    const tre = collected.find(m => m.content.toUpperCase() !== 'ANNULER')
                                    tre.delete()
                                    if(tre.content.length > 2048) {
                                        message.reply("Votre message d'au revoir est trop long. Maximum : 2048 caractères")
                                        return client.leaveMessage(message, settings)
                                    }
                                    const newMessage = tre.content
                                    const embedmodif = new MessageEmbed()
                                    .setColor(validColor)
                                    .setTitle(`Message d'au revoir mis à jour`)
                                    .setDescription(`Avant : ${settings.leave.message}\nMaintenant : ${newMessage}`)
                                    .setFooter(`${client.user.username} by PommeD'API#7749`)
                                    .setTimestamp();
                                    const embedmodif2 = new MessageEmbed()
                                    .setColor(validColor)
                                    .setTitle('Confirmation')
                                    .setDescription(`Message d'au revoir mis à jour`)
                                    .setFooter(`${client.user.username} by PommeD'API#7749`)
                                    var sett = settings.leave
                                    sett.message = newMessage
                                    await client.updateGuild(message.guild, {leave: sett})
                                    const logs = client.channels.cache.get(settings.log.channel)
                                    if(logs) logs.send({embeds: [embedmodif]})
                                    message.channel.send({embeds: [embedmodif2]})
                                };
                            } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
                        });
                    });
                } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
                msg.delete()
            });
        });
    };

    client.leaveEnable = async (message, settings) => {
        await client.updateGuild(message.guild, {leave: {enabled: true, message: '', channel: '', image: true}})
        await modifLeaveChannel(message, settings)
    }
}