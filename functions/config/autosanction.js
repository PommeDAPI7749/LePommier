const { MessageEmbed } = require("discord.js")
const { enCours } = require("../../util/couleurs")

module.exports = async client => {
    client.getNewAutoSanction = (settings, message) => {
        const embed = new MessageEmbed()
        .setTitle(`Ajout d'une sanction automatique`)
        .setColor(enCours)
        .setDescription(`Au bout de combien d'avertissements voulez vous que le membre soit sanctionné ?`)
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
                        const num = parseInt(tre.content, 10)
                        if(isNaN(num)) {
                            message.reply('veuillez renseigner un nombre')
                            return client.getNewAutoSanction(settings, message)
                        }
                        await client.getNewAutoSanctionType(settings, message, num)
                        embed.delete()
                        tre.delete()
                    }
                } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
            })
        })
    }

    client.getNewAutoSanctionType = async (settings, message, num) => {
        const embed = new MessageEmbed()
        .setTitle(`Ajout d'une sanction automatique`)
        .setColor(enCours)
        .setDescription(`Que voulez vous que je face ?\n\`mute\` => Mute le membre\n\`kick\` => Expulser le membre\n\`ban\` => Bannir le membre`)
        message.channel.send({embeds: [embed]}).then(embed => {
            const filter1 = msg => msg.author.id === message.author.id &&  msg.content.toLowerCase() === ("mute" || "kick" || "ban" || "annuler")
            message.channel.awaitMessages(filter1, { max: 1, time: 60000 }).then(async collected => {
                if(collected.size >= 1) {
                    const annulation = collected.find(m => m.content.toUpperCase() === 'ANNULER')
                    const mute = collected.find(m => m.content.toUpperCase() === 'MUTE')
                    if(annulation) {
                        await client.annulation(message)
                        embed.delete()
                        annulation.delete()
                    } else if(mute) {
                        await client.getTime(settings, message, num)
                        embed.delete()
                        mute.delete()
                    } else {
                        const tre = collected.find(m => m.content.toUpperCase() !== 'ANNULER')
                        var san = {}
                        san.n = num
                        san.s = {}
                        san.s.s = tre.content.toLowerCase()
                        var sss = settings.secu.sanctions
                        if(!sss) {
                            sss = [san]
                        } else sss.push(san)
                        var sett = settings.secu
                        sett.sanctions = sss
                        await client.updateGuild(message.guild, {secu: sett})
                        message.reply("sanction automatique ajoutée")
                        const embedmodif = new MessageEmbed()
                        .setColor(validColor)
                        .setTitle('Sanctions automatiques mises à jour')
                        .setDescription(`Les utilisateurs seront maintenant ${san.s.s === 'kick' ? 'exclus' : 'bannis'} si ils atteignent les ${san.n} warns`)
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

    client.getTime = async (settings, message, num) => {
        const embed = new MessageEmbed()
        .setTitle(`Ajout d'une sanction automatique`)
        .setColor(enCours)
        .setDescription(`Pendant combien de temps voulez vous que le membre soit sanctionné ?\nSous ce format : 1d 1h 1m 1s (<- 1jour 1heure 1minute et 1seconde)`)
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
                        var san = {}
                        san.n = num
                        san.s = {}
                        san.s.s = 'mute'
                        san.s.t = tre.content.toLowerCase()
                        var sss = settings.secu.sanctions
                        if(!sss) {
                            sss = [san]
                        } else sss.push(san)
                        var sett = settings.secu
                        sett.sanctions = sss
                        await client.updateGuild(message.guild, {secu: sett})
                        message.reply("sanction automatique ajoutée")
                        embed.delete()
                        tre.delete()
                    }
                } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
            })
        })
    }

    client.getAutoSanctionToRemove = async (settings, message) => {
        const embed = new MessageEmbed()
        .setTitle(`Retrait d'une sanction automatique`)
        .setColor(enCours)
        var data = `**Veuillez envoyer le numéro de la sanction à retirer** (sa position dans la liste ci dessous)`
        for(s of settings.secu.sanctions) {
            data += `\n- \`${s.s.s}${s.s.s === 'mute' ? ` (${s.s.t})\` :` : '\` : '} au bout de ${s.n} warns`
        }
        embed.setDescription(data)
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
                        const num = parseInt(tre.content, 10)
                        if(isNaN(num)) {
                            message.reply('veuillez renseigner un nombre')
                            return client.getAutoSanctionToRemove(settings, message)
                        }
                        var sss = settings.secu.sanctions
                        if(!sss[num-1]) {
                            message.reply(`il n'y a pas de sanction en position ${num}`)
                            return client.getAutoSanctionToRemove(settings, message)
                        } 
                        sss.splice(num-1, 1)
                        var sett = settings.secu
                        sett.sanctions = sss
                        await client.updateGuild(message.guild, {secu: sett})
                        message.reply("sanction automatique supprimée")
                        embed.delete()
                        tre.delete()
                    }
                } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
            })
        })
    }
}