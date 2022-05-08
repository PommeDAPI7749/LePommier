const { MessageEmbed } = require("discord.js");
const { enCours, validColor, warningColor, invisible } = require("../../util/couleurs");

module.exports = client => {
    client.suggChannel = async (message, settings) => {
        const embed = new MessageEmbed()
        .setTitle("Salon de suggestions")
        .setColor(enCours)
        .setDescription(`Salon de suggestions actuel: ${message.guild.channels.cache.get(settings.sugg.channel) || 'indéfini'}`)
        .setFooter("Répondez \"MODIFIER\" pour modifier")
        const filter1 = msg => msg.author.id === message.author.id && (msg.content.toUpperCase() === "MODIFIER" || msg.content.toLowerCase().startsWith(settings.prefix));
        message.channel.send({embeds: [embed]}).then(() => {
            message.channel.awaitMessages(filter1, { max: 1, time: 60000 }).then(async collected => {
                if(collected.size >= 1) {
                    const tre = collected.find(m => m.content.toUpperCase() != 'MODIFIER')
                    if(tre) return
                    modifSuggChannel(message, settings)
                } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
            });
        });
    };

    modifSuggChannel = async (message, settings) => {
        const embed2 = new MessageEmbed()
        .setColor(invisible)
        .setTitle('Modification du salon de suggestions')
        .setDescription("Pour modifier le salon de suggestions il vous suffit de le mentionner ou d'envoyer son ID ici dans la minute")
        .setFooter('Répondez "ANNULER" pour annuler')
        const filter1 = msg => msg.author.id === message.author.id;
        message.channel.send({embeds: [embed2]}).then(() => {
            message.channel.awaitMessages(filter1, { max: 1, time: 60000 }).then(async collected => {
                if(collected.size >= 1) {
                    const annulation = collected.find(m => m.content.toUpperCase() === 'ANNULER')
                    if(annulation) {
                        client.annulation(message)
                    } else {
                        const tre = collected.find(m => m.content.toUpperCase() !== 'ANNULER')
                        var newChannel = tre.mentions.channels.first()
                        if(!newChannel) newChannel = message.guild.channels.cache.get(tre.content)
                        if(newChannel) {
                            const embedmodif = new MessageEmbed()
                            .setColor(validColor)
                            .setTitle('Salon de suggestions mis à jour')
                            .setDescription(`Avant : ${message.guild.channels.cache.get(settings.sugg.channel)}\nMaintenant : ${message.guild.channels.cache.get(newChannel)}`)
                            .setFooter(`${client.user.username} by PommeD'API#7749`)
                            .setTimestamp();
                            const embedmodif2 = new MessageEmbed()
                            .setColor(validColor)
                            .setTitle('Confirmation')
                            .setDescription(`Salon de suggestions mis à jour`)
                            .setFooter(`${client.user.username} by PommeD'API#7749`)
                            var sett = {
                                enabled: true,
                                channel: newChannel.id
                            }
                            client.updateGuild(message.guild, { sugg: sett });
                            const logs = client.channels.cache.get(settings.log.channel)
                            if(logs) logs.send({embeds: [embedmodif]})
                            message.channel.send({embeds: [embedmodif2]})
                        } else {
                            errorSuggChannel(message, settings)
                        };
                    };
                        
                } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
            });
        });
    };

    errorSuggChannel = async (message, settings) => {
        const embederror = new MessageEmbed()
        .setColor(warningColor)
        .setTitle('ERREUR')
        .setDescription('Salon introuvable, veuillez utiliser l\'ID du salon')
        .setFooter("vous configurez le salon de suggestions, envoyez \"ANNULER\" pour annuler")
        const filter1 = msg => msg.author.id === message.author.id;
        message.reply(embederror).then(() => {
            message.channel.awaitMessages(filter1, { max: 1, time: 60000 }).then(async collected => {
                if(collected.size >= 1) {
                    const annulation = collected.find(m => m.content.toUpperCase() === 'ANNULER')
                    if(annulation) {
                        client.annulation(message)
                    } else {
                        const tre = collected.find(m => m.content.toUpperCase() !== 'ANNULER')
                        const newChannel = tre.content
                        if(message.guild.channels.cache.get(newChannel)) {
                            const embedmodif = new MessageEmbed()
                            .setColor(validColor)
                            .setTitle(`Salon de suggestions  mis à jour`)
                            .setDescription(`Avant : ${message.guild.channels.cache.get(settings.sugg.channel)}\nMainteant : ${message.guild.channels.cache.get(newChannel)}`)
                            .setFooter(`${client.user.username} by PommeD'API#7749`)
                            .setTimestamp();
                            const embedmodif2 = new MessageEmbed()
                            .setColor(validColor)
                            .setTitle('Confirmation')
                            .setDescription(`Salon de suggestions  mis à jour`)
                            .setFooter(`${client.user.username} by PommeD'API#7749`)
                            var sett = {
                                enabled: true,
                                channel: newChannel.id
                            }
                            client.updateGuild(message.guild, { sugg: sett });
                            const logs = client.channels.cache.get(settings.log.channel)
                            if(logs) logs.send({embeds: [embedmodif]})
                            message.channel.send({embeds: [embedmodif2]})
                        } else errorSuggChannel(message,settings)
                    };
                } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
            });
        });
    };
};