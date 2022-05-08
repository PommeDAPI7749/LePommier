const { MessageEmbed } = require("discord.js")
const { enCours, defaultColor } = require("../../util/couleurs")

module.exports = async client => {
    client.createRoleReact = (message, settings) => {
        const embed = new MessageEmbed()
        .setTitle(`Création d'un réaction rôle`)
        .setColor(enCours)
        .setDescription(`Dans quel salon souhaitez vous que le panel apparaisse`)
        .setFooter(`Envoyez "ANNULER" pour annuler`)
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
                        message.reply('salon introuvable ...').then(m => m.delete({timeout: 5000}))
                        client.createRoleReact(message, settings)
                    } else {
                        reactionRoleGetTitre(message, settings, salon)
                    }
                    embed.delete()
                    tre.delete()
                } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
            })
        })
    }

    reactionRoleGetTitre = (message, settings, salon) => {
        const embed = new MessageEmbed()
        .setTitle(`Création d'un réaction rôle`)
        .setColor(enCours)
        .setDescription(`Veuillez envoyer le titre de votre reaction role`)
        .setFooter(`Envoyez "ANNULER" pour annuler`)
        message.channel.send({embeds: [embed]}).then(embed => {
            const filter1 = msg => msg.author.id === message.author.id
            message.channel.awaitMessages(filter1, { max: 1, time: 60000 }).then(async collected => {
                if(collected.size >= 1) {
                    const annulation = collected.find(m => m.content.toUpperCase() == 'ANNULER')
                    if(annulation) {
                        await client.annulation(message)
                        embed.delete()
                        annulation.delete()
                    } else {
                        const tre = collected.find(m => m.content.toUpperCase() != 'ANNULER')
                        if(tre.content.toLowerCase().startsWith(settings.prefix)) return
                        if(tre.content.length > 256) {
                            message.reply("Votre titre est trop long. Maximum : 256 caractères")
                            return reactionRoleGetTitre(message, settings, salon)
                        }
                        reactionRoleGetDescription(message, settings, salon, tre.content)
                        embed.delete()
                        tre.delete()
                    }
                } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
            })
        })
    }

    reactionRoleGetDescription = (message, settings, salon, titre) => {
        const embed = new MessageEmbed()
        .setTitle(`Création d'un réaction rôle`)
        .setColor(enCours)
        .setDescription(`Veuillez envoyer le texte qui servira de description à votre réaction role`)
        .setFooter(`Envoyez "ANNULER" pour annuler`)
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
                        if(tre.content.toLowerCase().startsWith(settings.prefix)) return
                        if(tre.content.length > 2048) {
                            message.reply("Votre description est trop longue. Maximum : 2048 caractères")
                            return reactionRoleGetDescription(message, settings, salon, titre)
                        }
                        const panel = new MessageEmbed()
                        .setTitle(titre)
                        .setDescription(tre.content)
                        .setColor(defaultColor)
                        panel.setFooter(`Il n'y a pas de rôles disponibles pour le moment`)
                        salon.send(panel).then(m => {
                            client.createRoleReactDB(message, salon, titre, tre.content, m)
                        })
                        embed.delete()
                        tre.delete()
                    }
                } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
            })
        })
    }

    client.getNewRole = (message, settings, rolemenu) => {
        const embed = new MessageEmbed()
        .setTitle(`Ajout d'un role`)
        .setColor(enCours)
        .setDescription(`Veuillez mentionner ou rensegner l'ID du nouveau rôle`)
        .setFooter(`Envoyez "ANNULER" pour annuler`)
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
                        if(tre.content.toLowerCase().startsWith(settings.prefix)) return
                        var role = tre.mentions.roles.first()
                        if(!role) role = await tre.guild.roles.cache.get(tre.content)
                        if(!role) {
                            message.reply('role introuvable ...')
                        } else {
                            const data = await client.RoleReactAlreadyExistMsg(rolemenu)
                            const ver = data.roles.indexOf(role.id)
                            if(ver == -1) {
                                const clientMember = await message.guild.members.cache.get(client.user.id)
                                if(role.permissions.has('MANAGE_MESSAGES' || 'MANAGE_CHANNELS' || 'MANAGE_GUILD')) {
                                    message.reply('Vous ne pouvez pas ajouter un role ayant des permissions dans un role réact').then(m => m.delete({timeout: 5000}))
                                    return client.getNewRole(message, rolemenu)
                                }
                                if((message.member.roles.highest.position < role.position || message.member.roles.highest.position == role.position) && message.author.id !== message.guild.owner.user.id) {
                                    message.reply('Ce rôle est plus haut que les votres, vous ne pouvez pas l\'ajouter au role react').then(m => m.delete({timeout: 5000}))
                                    return client.getNewRole(message, rolemenu)
                                }
                                if(clientMember.roles.highest.position < role.position || clientMember.roles.highest.position == role.position) {
                                    message.reply('Ce rôle est plus haut que les miens, je ne pourrai pas le donner').then(m => m.delete({timeout: 5000}))
                                    return client.getNewRole(message, rolemenu)
                                }
                                getNewRoleEmoji(message, settings, rolemenu, role)
                            } else {
                                message.reply('Vous avez déja une réaction pour ce rôle').then(m => m.delete({timeout: 5000}))
                                client.getNewRole(message, settings, rolemenu)
                            }
                            embed.delete()
                            tre.delete()
                        }
                    }
                } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
            })
        })
    }

    getNewRoleEmoji = (message, settings, rolemenu, role) => {
        const em = new MessageEmbed()
        .setTitle(`Ajout d'un role`)
        .setColor(enCours)
        .setDescription(`Veuillez réagir avec l'emoji à relier au nouveau rôle`)
        .setFooter(`réagissez avec ❌ pour annuler`)
        message.channel.send({embeds: [em]}).then(embed => {
            const filter = (reaction, user) => user.id === message.author.id;
            embed.awaitReactions(filter, {max: 1, time: 60000, errors: ['time']}).then(async collected => {
                if(collected.size >= 1) {
                    const annulation = collected.find(reaction => reaction.emoji.name === '❌')
                    if(annulation) {
                        await client.annulation(message)
                        embed.delete()
                    } else {
                        const tre = collected.find(reaction => reaction.emoji.name !== '❌')
                        const emoteName = tre.emoji.name
                        const emoteID = tre.emoji.id || false
                        var emote = ''
                        if(!emoteID) {
                            emote = emoteName
                        } else  {
                            emote = `<:${emoteName}:${emoteID}>`
                        }
                        const data = await client.RoleReactAlreadyExistMsg(rolemenu)
                        const ver = data.emojis.indexOf(emote)
                        if(ver == -1) {
                            client.addReact(message, rolemenu, role.id, emote, emoteID)
                        } else {
                            message.reply('Vous avez déja choisis cette réaction sur votre panel').then(m => m.delete({timeout: 5000}))
                            getNewRoleEmoji(message, settings, rolemenu, role)
                        }
                        embed.delete()
                    }
                } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
            })
        })
    }

    client.getRoleToRemove = (message, settings, rolemenu) => {
        const embed = new MessageEmbed()
        .setTitle(`Retrait d'une réaction`)
        .setColor(enCours)
        .setDescription(`Veuillez envoyer le role lié à la réaction à retirer à retirer`)
        .setFooter(`Envoyez "ANNULER" pour annuler`)
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
                        if(tre.content.toLowerCase().startsWith(settings.prefix)) return
                        var role = tre.mentions.roles.first()
                        if(!role) role = await tre.guild.roles.cache.get(tre.content)
                        if(!role) {
                            message.reply('role introuvable ...')
                        } else {
                            const data = await client.RoleReactAlreadyExistMsg(rolemenu)
                            const ver = data.roles.indexOf(role.id)
                            if(ver != -1) {
                                client.removeReactDB(message, rolemenu, role.id)
                            } else {
                                message.reply('Vous n\'avez pas réaction pour ce rôle').then(m => m.delete({timeout: 5000}))
                                client.getRoleToRemove(message, rolemenu)
                            }
                            embed.delete()
                            tre.delete()
                        }
                    }
                } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
            })
        })
    }

    
    client.deleteRoleReact = async (message, settings, rolemenu) => {
        const verif = await client.RoleReactAlreadyExistMsg(rolemenu)
        if(!verif) {
            message.channel.send('Ce message n\'est pas un rôle menu').then(m => m.delete({timeout: 5000}))
        } else {
            const embed = new MessageEmbed()
            .setTitle(`Vous êtes sur le point de supprimer le menu de réaction ...`)
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
                            await message.guild.channels.cache.get(verif.channelID).messages.fetch(verif.messageReact).then(m => m.delete())
                            await client.deleteRoleReactDB(rolemenu)
                            message.channel.send('Rolereact supprimé').then(m => m.delete({timeout: 5000}))
                            embed.delete()
                            tre.delete()
                        }
                    } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
                })
            })
        }
    }
}