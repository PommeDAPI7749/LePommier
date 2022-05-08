const { MessageEmbed } = require("discord.js");
const { enCours, validColor, warningColor, invisible } = require("../../util/couleurs");

module.exports = client => {
    client.logChannel = async (message, settings) => {
        const embed = new MessageEmbed()
        .setTitle("Salon de logs")
        .setColor(enCours)
        .setDescription(`Salon de logs actuel: ${message.guild.channels.cache.get(settings.log.channel) || 'indéfini'}`)
        .setFooter("Répondez \"MODIFIER\" pour modifier")
        const filter1 = msg => msg.author.id === message.author.id && (msg.content.toUpperCase() === "MODIFIER" || msg.content.toLowerCase().startsWith(settings.prefix));
        message.channel.send({embeds: [embed]}).then(msg => {
            message.channel.awaitMessages(filter1, { max: 1, time: 60000 }).then(async collected => {
                if(collected.size >= 1) {
                    const tre = collected.find(m => m.content.toUpperCase() == 'MODIFIER')
                    if(!tre) return
                    tre.delete()
                    client.modifLogChannel(message, settings)
                };
                msg.delete()
            });
        });
    };

    client.modifLogChannel = async (message, settings) => {
        const embed2 = new MessageEmbed()
        .setColor(invisible)
        .setTitle('Modification du salon d\'au revoir')
        .setDescription("Pour modifier le salon de logs il vous suffit de le mentionner ou d'envoyer son ID ici dans la minute")
        .setFooter('Répondez "ANNULER" pour annuler')
        const filter1 = msg => msg.author.id === message.author.id;
        message.channel.send({embeds: [embed2]}).then(msg => {
            message.channel.awaitMessages(filter1, { max: 1, time: 60000 }).then(async collected => {
                if(collected.size >= 1) {
                    const annulation = collected.find(m => m.content.toUpperCase() === 'ANNULER')
                    if(annulation) {
                        annulation.delete()
                        client.annulation(message)
                    } else {
                        const tre = collected.find(m => m.content.toUpperCase() !== 'ANNULER')
                        tre.delete()
                        var newChannel = tre.mentions.channels.first()
                        if(!newChannel) newChannel = message.guild.channels.cache.get(tre.content)
                        if(newChannel) {
                            const embedmodif = new MessageEmbed()
                            .setColor(validColor)
                            .setTitle(`Salon de logs mis à jour`)
                            .setDescription(`Avant : ${message.guild.channels.cache.get(settings.log.channel)}\nMaintenant : ${newChannel}`)
                            .setFooter(`${client.user.username} by PommeD'API#7749`)
                            .setTimestamp();
                            const embedmodif2 = new MessageEmbed()
                            .setColor(validColor)
                            .setTitle('Confirmation')
                            .setDescription(`Salon de logs mis à jour`)
                            .setFooter(`${client.user.username} by PommeD'API#7749`)
                            var sett = settings.log
                            sett.enabled = true
                            sett.channel = newChannel.id
                            await client.updateGuild(message.guild, {log: sett})
                            const logs = client.channels.cache.get(settings.log.channel)
                            if(logs) logs.send({embeds: [embedmodif]})
                            message.channel.send({embeds: [embedmodif2]})
                        } else {
                            errorLogChannel(message, settings)
                        };
                    };
                } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
                msg.delete()
            });
        });
    };

    errorLogChannel = async (message,settings) => {
        const embederror = new MessageEmbed()
        .setColor(warningColor)
        .setTitle("ERREUR")
        .setDescription('Salon introuvable, veuillez utiliser l\'ID du salon')
        .setFooter("Vous configurez le salon de logs, envoyez \"ANNULER\" pour annuler")
        const filter1 = msg => msg.author.id === message.author.id;
        message.reply(embederror).then(msg => {
            message.channel.awaitMessages(filter1, { max: 1, time: 60000 }).then(async collected => {
                if(collected.size >= 1) {
                    const annulation = collected.find(m => m.content.toUpperCase() === 'ANNULER')
                    if(annulation) {
                        annulation.delete()
                        client.annulation(message)
                    } else {
                        const tre = collected.find(m => m.content.toUpperCase() !== 'ANNULER')
                        tre.delete()
                        var newChannel = tre.mentions.channels.first()
                        if(!newChannel) newChannel = message.guild.channels.cache.get(tre.content)
                        if(newChannel) {
                            const embedmodif = new MessageEmbed()
                            .setColor(validColor)
                            .setTitle(`Salon de logs mis à jour`)
                            .setDescription(`Avant : ${message.guild.channels.cache.get(settings.log.channel)}\nMaintenant : ${message.guild.channels.cache.get(newChannel)}`)
                            .setFooter(`${client.user.username} by PommeD'API#7749`)
                            .setTimestamp();
                            const embedmodif2 = new MessageEmbed()
                            .setColor(validColor)
                            .setTitle('Confirmation')
                            .setDescription(`Salon de logs mis à jour`)
                            .setFooter(`${client.user.username} by PommeD'API#7749`)
                            var sett = settings.log
                            sett.enabled = true
                            sett.channel = newChannel.id
                            await client.updateGuild(message.guild, {log: sett})
                            const logs = client.channels.cache.get(settings.log.channel)
                            if(logs) logs.send({embeds: [embedmodif]})
                            message.channel.send({embeds: [embedmodif2]})
                        } else errorLogChannel(message, settings)
                    };
                } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
                msg.delete()
            });
        });
    };
}