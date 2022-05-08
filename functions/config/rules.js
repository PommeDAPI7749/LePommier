const { MessageEmbed } = require("discord.js")
const { enCours, validColor } = require("../../util/couleurs")

module.exports = async client => {
    client.createRules = (message, settings) => {
        const embed = new MessageEmbed()
        .setTitle(`Création d'un réglement avec réaction`)
        .setColor(enCours)
        .setDescription(`Dans quel salon souhaitez vous que le règlement apparaisse`)
        const filter1 = msg => msg.author.id === message.author.id;
        message.channel.send({embeds: [embed]}).then(embed => {
            message.channel.awaitMessages(filter1, { max: 1, time: 60000 }).then(async collected => {
                if(collected.size >= 1) {
                    const newCmd = collected.find(m => m.content.toLowerCase().startsWith(settings.prefix))
                    if(newCmd) return
                    const tre = collected.find(m => m.content.toUpperCase() !== 'ANNULER')
                    var salon = tre.mentions.channels.first()
                    if(!salon) salon = await tre.guild.channels.cache.get(tre.content)
                    if(!salon) {
                        message.reply('salon introuvable ...')
                        client.createRules(message)
                    } else {
                        var eve = await message.guild.roles.cache.find(r => r.name === "@everyone")
                        eve = eve.id
                        salon.overwritePermissions([
                            {
                                id: eve,
                                deny: ["SEND_MESSAGES", "ADD_REACTIONS"],
                                allow: ["VIEW_CHANNEL"]
                            }
                        ])
                        rulesGetRole(message, salon)
                        const embedmodif = new MessageEmbed()
                        .setColor(validColor)
                        .setTitle('Règlement activé')
                        .setDescription(`Salon : ${salon}`)
                        .setFooter(`${client.user.username} by PommeD'API#7749`)
                        .setTimestamp();
                        const logs = client.channels.cache.get(settings.log.channel)
                        if(logs) logs.send({embeds: [embedmodif]})
                    }
                    embed.delete()
                    tre.delete()
                } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
            })
        })
    }

    rulesGetRole = (message, salon) => {
        const embed = new MessageEmbed()
        .setTitle(`Création d'un réglement avec réaction`)
        .setColor(enCours)
        .setDescription(`Quel rôle voulez vous donner à vos membres lorsqu'ils réagiront au règlement ?`)
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
                        if(!role) role = await tre.guild.roles.cache.get(tre.content)
                        if(!role) {
                            message.reply('role introuvable ...')
                            rulesGetRole(message, salon)
                        } else {
                            rulesGetTitre(message, salon, role)
                        }
                        embed.delete()
                        tre.delete()
                    }
                } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
            })
        })
    }

    rulesGetTitre = (message, salon, role) => {
        const embed = new MessageEmbed()
        .setTitle(`Création d'un réglement avec réaction`)
        .setColor(enCours)
        .setDescription(`Veuillez envoyer le titre de votre règlement`)
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
                        if(tre.content.length > 256) {
                            message.reply("Votre titre est trop long. Maximum : 256 caractères")
                            return rulesGetTitre(message, salon, role)
                        }
                        rulesGetDescription(message, salon, role, tre.content)
                        embed.delete()
                        tre.delete()
                    }
                } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
            })
        })
    }

    rulesGetDescription = (message, salon, role, titre) => {
        const embed = new MessageEmbed()
        .setTitle(`Création d'un réglement avec réaction`)
        .setColor(enCours)
        .setDescription(`Veuillez envoyer le texte qui servira de préambule à votre règlement (avant la première règle)`)
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
                        if(tre.content.length > 2048) {
                            message.reply("Votre description est trop longue. Maximum : 2048 caractères")
                            return rulesGetDescription(message, salon, role, titre)
                        }
                        client.createRulesDB(message, salon, role, titre, tre.content)
                        embed.delete()
                        tre.delete()
                    }
                } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
            })
        })
    }

    client.getNewRule = message => {
        const embed = new MessageEmbed()
        .setTitle(`Ajout d'une règle`)
        .setColor(enCours)
        .setDescription(`Veuillez envoyer le contenu de la nouvelle règle`)
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
                        if(tre.content.length > 1024) {
                            message.reply("Votre règle est trop longue. Maximum : 1024 caractères")
                            return rulesGetDescription(message, salon, role, titre)
                        }
                        client.addRule(message.guild, tre.content)
                        embed.delete()
                        tre.delete()
                    }
                } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
            })
        })
    }

    client.getRuleToRemove = message => {
        const embed = new MessageEmbed()
        .setTitle(`Retrait d'une règle`)
        .setColor(enCours)
        .setDescription(`Veuillez envoyer le numéro de la règle à retirer`)
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
                            return client.getRuleToRemove(message)
                        }
                        client.removeRule(message, num)
                        embed.delete()
                        tre.delete()
                    }
                } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
            })
        })
    }

    client.deleteRules = async message => {
        const verif = await client.getRules(message.guild)
        if(!verif) {
            message.channel.send('Il n\'y a pas de règlement actif sur le serveur').then(m => m.delete({timeout: 5000}))
        } else {
            const embed = new MessageEmbed()
            .setTitle(`Vous êtes sur le point de supprimer le règlement ...`)
            .setColor(enCours)
            .setDescription(`Êtes vous sur de vouloir le faire ?`)
            message.channel.send({embeds: [embed]}).then(embed => {
                const filter1 = msg => msg.author.id === message.author.id && (msg.content.toUpperCase() === 'OUI' || msg.content.toUpperCase() === 'NON')
                message.channel.awaitMessages(filter1, { max: 1, time: 60000 }).then(async collected => {
                    if(collected.size >= 1) {
                        const annulation = collected.find(m => m.content.toUpperCase() === 'NON')
                        if(annulation) {
                            await client.annulation(message)
                            embed.delete()
                            annulation.delete()
                        } else {
                            const tre = collected.find(m => m.content.toUpperCase() === 'OUI')
                            client.deleteRulesDB(message)
                            embed.delete()
                            tre.delete()
                        }
                    } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
                })
            })
        }
    }
}