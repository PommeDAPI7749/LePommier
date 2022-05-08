const { MessageEmbed } = require("discord.js");
const { invisible, defaultColor } = require("../../util/couleurs");
const moment = require("moment")

module.exports = client => {
	client.annonce = (channelID, message) => {
        const embed2 = new MessageEmbed()
        .setColor(invisible)
        .setTitle('Titre de l\'annonce')
        .setDescription("Envoyez le titre de l'annonce apres ce message (vous avez 60 secondes)")
        .setFooter('Répondez "ANNULER" pour annuler')
        const filter1 = msg => msg.author.id === message.author.id;
        message.channel.send({embeds: [embed2]}).then(m => {
            message.channel.awaitMessages(filter1, { max: 1, time: 60000 }).then(async collected => {
                if(collected.size >= 1) {
                    const annul = collected.find(m => m.content === 'ANNULER')
                    if(annul) {
                        annul.delete()
                        m.delete()
                        return client.annulation(message)
                    } 
                    const tre = collected.find(m => m.content !== 'ANNULER')
                    tre.delete()
                    m.delete()
                    const title = tre.content
                    client.annonceStep2(channelID, message, title)
                } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
            });
        });
    }

    client.annonceStep2 = (channelID, message, title) => {
        const embed2 = new MessageEmbed()
        .setColor(invisible)
        .setTitle('Contenu de l\'annonce')
        .setDescription("Envoyez le contenu de l'annonce apres ce message (vous avez 60 secondes)")
        .setFooter('Répondez "ANNULER" pour annuler')
        const filter1 = msg => msg.author.id === message.author.id;
        message.channel.send({embeds: [embed2]}).then(m => {
            message.channel.awaitMessages(filter1, { max: 1, time: 60000 }).then(async collected => {
                if(collected.size >= 1) {
                    const annul = collected.find(m => m.content.toUpperCase() === 'ANNULER')
                    if(annul) {
                        annul.delete()
                        m.delete()
                        return client.annulation(message)
                    } 
                    const tre = collected.find(m => m.content !== 'ANNULER')
                    tre.delete()
                    m.delete()
                    const description = tre.content
                    client.sendAnnonce(channelID, message, title, description)
                } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
            });
        });
    }

    client.sendAnnonce = (channelID, message, title, description) => {
        const embed = new MessageEmbed()
        .setTitle(title.toUpperCase())
        .setDescription(description)
        .setColor(invisible)
        .setFooter(`${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp()
        const channel = message.guild.channels.cache.get(channelID)
        channel.createWebhook('Annonce', {
            avatar: client.user.displayAvatarURL({format: 'png'}),
        }).then(async webhook => {
            await webhook.send({embeds: [embed]})
            webhook.delete()
        })
    }

    client.annonceLive = async (live) => {
        let data = await client.getData();
        for(link of data.linkWithGuilds) {
            if(link.chaineTwitch.toLowerCase() == live.name.toLowerCase()) {
                const guild = await client.guilds.cache.get(link.guild)
                const settings = await client.getGuild(guild);
                const ch = await guild.channels.cache.get(settings.lives.channel)
                if(ch) {
                    var msg = settings.lives.role
                    if(msg) var role = await guild.roles.cache.get(msg)
                    const embed = new MessageEmbed()
                    .setTitle(`${live.name} est en live !`)
                    .setURL(`https://twitch.tv/${live.name}`)
                    .setColor(defaultColor)
                    .addFields([
                        {
                            name: 'Titre du live',
                            value: live.title,
                            inline: false
                        },
                        {
                            name: 'Jeu',
                            value: live.game,
                            inline: true
                        },
                        {
                            name: 'Viewers',
                            value: live.viewers,
                            inline: true
                        },
                    ])
                    .setImage(live.thumbnail)
                    .setThumbnail(live.profile)
                    .setFooter('')
                    .setTimestamp();
                    if(role) return ch.send({content:`${role}`, embeds:[embed]})
                    ch.send({embeds: [embed]})
                }
            }
        }
    }
}