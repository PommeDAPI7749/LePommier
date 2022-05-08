const { MessageEmbed } = require("discord.js");
const { warningColor, validColor, enCours } = require("../../util/couleurs");

function getTwitchChannel(client,message, settings) {
    const embed = new MessageEmbed()
    .setTitle("Annonces Twitch")
    .setColor(enCours)
    .setDescription(`Quelle chaine désirez vous suivre ?\n*Veuillez envoyer le nom figurant à la fin du lien de la chaine*`)
    .setFooter("Répondez \"ANNULER\" pour annuler")
    const filter1 = msg => msg.author.id === message.author.id;
    message.channel.send({embeds: [embed]}).then(embed => {
        message.channel.awaitMessages(filter1, { max: 1, time: 60000 }).then(async collected => {
            if(collected.size >= 1) {
                const annulation = collected.find(m => m.content.toUpperCase() === "ANNULER")
                if(annulation) {
                    embed.delete()
                    annulation.delete()
                    return client.annulation(message)
                }
                const tre = collected.find(m => m.content.toUpperCase() !== "ANNULER")
                getAnnouncementChannel(client, message, settings, tre.content)
                embed.delete()
                tre.delete()
            } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
        })
    })
}
function getAnnouncementChannel(client, message, settings, twitchChannel) {
    const embed = new MessageEmbed()
    .setTitle("Annonces Twitch")
    .setColor(enCours)
    .setDescription(`Dans quel salon voulez vous envoyer les annonces (quand \`${twitchChannel}\` sera en live)`)
    .setFooter("Répondez \"ANNULER\" pour annuler")
    const filter1 = msg => msg.author.id === message.author.id;
    message.channel.send({embeds: [embed]}).then(embed => {
        message.channel.awaitMessages(filter1, { max: 1, time: 60000 }).then(async collected => {
            if(collected.size >= 1) {
                const annulation = collected.find(m => m.content.toUpperCase() === "ANNULER")
                if(annulation) {
                    embed.delete()
                    annulation.delete()
                    return client.annulation(message)
                }
                const tre = collected.find(m => m.content.toUpperCase() !== "ANNULER")
                var announcementChannel = tre.mentions.channels.first()
                if(!announcementChannel) announcementChannel = message.guild.channels.cache.get(tre.content)
                if(!announcementChannel) {
                    message.reply('salon introuvable essayez encore')
                    return getAnnouncementChannel(client, message, settings, twitchChannel)
                }
                getMessageAnnouncement(client, message, settings, twitchChannel, announcementChannel)
                embed.delete()
                tre.delete()
            } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
        });
    });
};
function getMessageAnnouncement(client, message, settings, twitchChannel, announcementChannel) {
    const embed = new MessageEmbed()
    .setTitle("Message d'annonce")
    .setColor(enCours)
    .setDescription(`Voulez vous mentionner un role a chaque live ? si oui lequel ?`)
    .setFooter("Répondez \"ANNULER\" pour annuler ou \"NON\" pour ne pas mentionner")
    const filter1 = msg => msg.author.id === message.author.id;
    message.channel.send({embeds: [embed]}).then(embed => {
        message.channel.awaitMessages(filter1, { max: 1, time: 60000 }).then(async collected => {
            if(collected.size >= 1) {
                const annulation = collected.find(m => m.content.toUpperCase() === 'ANNULER')
                if(annulation) {
                    embed.delete()
                    annulation.delete()
                    return client.annulation(message)
                }
                const tre = collected.find(m => m.content.toUpperCase() !== 'ANNULER')
                if(tre.content.toLowerCase() != 'non') {
                    var newRole = tre.mentions.roles.first
                    if(!newRole) newRole = await message.guild.roles.cache.get(tre.content).id
                    if(!newRole) {
                        message.reply('rôle introuvable')
                        return getMessageAnnouncement(client, message, settings, twitchChannel, announcementChannel)
                    }
                }
                const embedmodif = new MessageEmbed()
                .setColor(validColor)
                .setTitle(`Annonces twitch activées`)
                .setDescription(`Chaine suivie : ${twitchChannel} \nSalon : ${announcementChannel}\nRôle mentionné : ${newRole ? newRole : 'aucun'}`)
                .setFooter(`${client.user.username} by PommeD'API#7749`)
                .setTimestamp();
                const embedmodif2 = new MessageEmbed()
                .setColor(validColor)
                .setTitle('Confirmation')
                .setDescription(`Annonces twitch activées`)
                .setFooter(`${client.user.username} by PommeD'API#7749`)
                var objet = {}
                objet.chaineTwitch = twitchChannel
                objet.channel = announcementChannel.id
                objet.role = newRole
                client.updateGuild(message.guild, {lives: objet});
                let data = await client.getData();
                var globalChannels = data.twitchChannels
                if(globalChannels.indexOf(twitchChannel) == -1) globalChannels.push(twitchChannel)
                client.addChannel(twitchChannel)
                var links = data.linkWithGuilds
                var objet2 = {}
                objet2.chaineTwitch = twitchChannel
                objet2.guild = announcementChannel.guild.id
                links.push(objet2)
                client.updateGlobalData({twitchChannels: globalChannels, linkWithGuilds: links})
                const logs = client.channels.cache.get(settings.log.channel)
                if(logs) logs.send({embeds: [embedmodif]})
                message.channel.send({embeds: [embedmodif2]})
                embed.delete()
                tre.delete()
            } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
        });
    });
};

module.exports.run = async (settings, client, message, args, command) => {
    if(args[0].toLowerCase() === 'créer' || args[0].toLowerCase() === 'creer' || args[0].toLowerCase() === 'create') {
        if(!settings.lives) {
            getTwitchChannel(client, message, settings)
        } else message.reply('veuillez désactiver le système existant avant d\'en créer un nouveau').then(m => m.delete({timeout: 5000}))
    } else if(args[0].toLowerCase() === 'supprimer'|| args[0].toLowerCase() === 'delete') {
        if(settings.lives) {
            client.updateGuild(message.guild, {lives: false});
            const twitchChannel = settings.lives.chaineTwitch
            let data = await client.getData();
            var links = data.linkWithGuilds
            var count = 0
            for(link of links) {
                if(link.chaineTwitch === twitchChannel) count+=1
                if(link.guild === settings.guildID) links.splice(links.indexOf(link), 1)
            }
            client.updateGlobalData({linkWithGuilds: links})
            if(count <= 1) {
                data.twitchChannels.splice(data.twitchChannels.indexOf(twitchChannel), 1)
                client.updateGlobalData({twitchChannels: data.twitchChannels})
                client.supprChannel(twitchChannel)
            }
            const embedmodif = new MessageEmbed()
            .setColor(warningColor)
            .setTitle(`Annonces twitch désactivées`)
            .setDescription(`Par : ${message.author.tag}`)
            .setFooter(`${client.user.username} by PommeD'API#7749`)
            .setTimestamp();
            const embedmodif2 = new MessageEmbed()
            .setColor(validColor)
            .setTitle('Confirmation')
            .setDescription(`Annonces twitch désactivées`)
            .setFooter(`${client.user.username} by PommeD'API#7749`)
            const logs = client.channels.cache.get(settings.log.channel)
            if(logs) logs.send({embeds: [embedmodif]})
            message.channel.send({embeds: [embedmodif2]})

        } else message.reply('il n\'y a pas de message automatique à supprimer').then(m => m.delete({timeout: 5000}))
    } else {
        const help =  await client.sendHelpCmd(command, settings, message)
        message.reply('argument invalide, voici un message d\'aide :', help).then(msg => msg.delete({timeout: 5000}))
    }
};

module.exports.help = {
    group: 'administration',
    name: "notiftwitch",
    aliases: ["notiftwitch"],
    description: "Configure les annonces twitch sur le serveur",
    bug: false,
    precisions: '',
    requireArgs: true,
    argsRequiered: '<créer/supprimer>',
    permissions: ["ADMINISTRATOR"],
    permissionsBot: ["ADMINISTRATOR"],
};