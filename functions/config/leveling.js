const { MessageEmbed } = require("discord.js")
const { enCours, validColor } = require("../../util/couleurs")

module.exports = async client => {
    client.addReward = async (message, args, settings, reload) => {
        if(args[1] && !reload) {
            var level = await parseInt(args[1], 10)
            if(!isNaN(level)) {
                var verif = false
                if(settings.leveling.rewards) await settings.leveling.rewards.map(r => {
                    if(r.l == level) verif = true
                })
                if(verif) {
                    await message.reply('il y a déja un rôle récompense pour ce niveau')
                    return client.addReward(message, args, settings, true)
                }
                return getRole(message, args, settings, level)
            }
        }
        const embed = new MessageEmbed()
        .setTitle(`Ajout d'une récompense automatique`)
        .setColor(enCours)
        .setDescription(`A quel niveau le membre doit-il gagner le rôle récompense ?`)
        message.channel.send({embeds: [embed]}).then(embed => {
            const filter1 = msg => msg.author.id === message.author.id
            message.channel.awaitMessages(filter1, { max: 1, time: 60000 }).then(async collected => {
                if(collected.size >= 1) {
                    const annulation = collected.find(m => m.content.toUpperCase() === 'ANNULER')
                    if(annulation) {
                        await client.annulation(message)
                        embed.delete()
                        annulation.delete()
                    } else {
                        const tre = collected.find(m => m.content.toUpperCase() !== 'ANNULER')
                        const level = parseInt(tre.content, 10)
                        if(isNaN(level)) {
                            message.reply('veuillez renseigner un nombre')
                            return client.addReward(message, args, settings)
                        }
                        var verif = false
                        if(settings.leveling.rewards) await settings.leveling.rewards.map(r => {
                            if(r.l == level) verif = true
                        })
                        if(verif) {
                            message.reply('il y a déja un rôle récompense pour ce niveau')
                            return client.addReward(message, args, settings)
                        }
                        await getRole(message, args, settings, level)
                        embed.delete()
                        tre.delete()
                    }
                } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
            })
        })
    }

    getRole = async (message, args, settings, level) => {
        var role = message.mentions.roles.first()
        if(!role) {
            if(args[2]) {
                var role = await message.guild.roles.cache.get(args[2])
            }
        }
        if(role) {
            var san = {}
            san.l = level
            san.r = role.id
            var sss = settings.leveling.rewards
            if(!sss) {
                sss = [san]
            } else sss.push(san)
            var entrie = {}
            entrie.enabled = true
            entrie.rewards = sss
            await client.updateGuild(message.guild, {leveling: entrie})
            const embedmodif = new MessageEmbed()
            .setColor(validColor)
            .setTitle('Récompenses automatiques mises à jour')
            .setDescription(`Les utilisateurs gagneront maintenant le role ${role} si ils atteignent le niveau ${level}`)
            .setFooter(`${client.user.username} by PommeD'API#7749`)
            .setTimestamp();
            const logs = client.channels.cache.get(settings.log.channel)
            if(logs) logs.send({embeds: [embedmodif]})
            return message.reply("récompense automatique ajoutée")            
        }
        const embed = new MessageEmbed()
        .setTitle(`Ajout d'une récompence automatique`)
        .setColor(enCours)
        .setDescription(`Quel rôle voulez vous ajouter au membre lorsqu'il atteindra le niveau ${level}`)
        message.channel.send({embeds: [embed]}).then(embed => {
            const filter1 = msg => msg.author.id === message.author.id
            message.channel.awaitMessages(filter1, { max: 1, time: 60000 }).then(async collected => {
                if(collected.size >= 1) {
                    const annulation = collected.find(m => m.content.toUpperCase() === 'ANNULER')
                    if(annulation) {
                        await client.annulation(message)
                        embed.delete()
                        annulation.delete()
                    } else {
                        const tre = collected.find(m => m.content.toUpperCase() !== 'ANNULER')
                        var role = tre.mentions.roles.first()
                        if(!role) role = message.guild.roles.cache.get(tre.content)
                        if(!role) {
                            await message.reply('rôle introuvable')
                            return getRole(message, args, settings, level)
                        }
                        var san = {}
                        san.l = level
                        san.r = role.id
                        var sss = settings.leveling.rewards
                        if(!sss) {
                            sss = [san]
                        } else sss.push(san)
                        var entrie = await settings.leveling
                        entrie.rewards = await sss
                        await client.updateGuild(message.guild, {leveling: entrie})
                        message.reply("récompense automatique ajoutée")
                        const embedmodif = new MessageEmbed()
                        .setColor(validColor)
                        .setTitle('Récompenses automatiques mises à jour')
                        .setDescription(`Les utilisateurs gagneront maintenant le role ${role} si ils atteignent le niveau ${level}`)
                        .setFooter(`${client.user.username} by PommeD'API#7749`)
                        .setTimestamp();
                        const logs = client.channels.cache.get(settings.log.channel)
                        if(logs) logs.send({embeds: [embedmodif]})
                        embed.delete()
                        tre.delete()
                    }
                } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
            })
        })
    }
}