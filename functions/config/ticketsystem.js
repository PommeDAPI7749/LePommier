const { MessageEmbed } = require("discord.js");
const { enCours, warningColor, defaultColor, validColor } = require("../../util/couleurs");
const { idticket } = require("../../util/emotes");

module.exports = client => {
    client.createTicketSystemStep1 = (message, settings, args) => {
        const wantObj = new MessageEmbed()
        .setColor(enCours)
        .setAuthor('Object du système de tickets')
        .setDescription('Vous avez une minute pour donner un titre à ce système de tickets\nExemple : `Recrutements`')
        .setFooter('envoyez "ANNULER" pour annuler la commande')
        const filter1 = msg => msg.author.id === message.author.id;
        message.channel.send({embed : [wantObj]}).then(msg => {
            message.channel.awaitMessages(filter1, { max: 1, time: 60000 }).then(async collected => {
                if(collected.size >= 1) {
                    const newCmd = collected.find(m => m.content.toLowerCase().startsWith(settings.prefix))
                    if(newCmd) return
                    const annulation = collected.find(m => m.content.toUpperCase() === 'ANNULER')
                    if(annulation) {
                        annulation.delete()
                        client.annulation(message)
                    } else {
                        const tre = collected.find(m => m.content.toUpperCase() !== 'ANNULER')
                        if(tre.content.length > 256) {
                            message.reply("Votre titre est trop long. Maximum : 256 caractères")
                            return createTicketSystemStep1(message, args)
                        }
                        const obj = tre.content
                        tre.delete()
                        msg.delete()
                        const ticketsystem = await client.ticketSystemAlreadyExist(message.guild, tre.content)
                        if(ticketsystem) {
                            const error = new MessageEmbed()
                            .setColor(warningColor)
                            .setTitle('ATTENTION !')
                            .setDescription("vous avez déja un système de ticket pour cette raison")
                            return message.channel.send({embeds: [error]})
                        } else client.createTicketSystemStep2(message, settings, obj)
                    };
                } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
            });
        })
    }

    client.createTicketSystemStep2 = (message, settings, obj) => {
        const wantCat = new MessageEmbed()
        .setColor(enCours)
        .setAuthor('Dans quel catégorie voulez vous stocker les tickets ?')
        .setDescription('Vous avez une minute pour envoyer son ID')
        .setFooter('envoyez "ANNULER" pour annuler la commande')
        const filter1 = msg => msg.author.id === message.author.id;
        message.channel.send({embeds:[wantCat]}).then(msg => {
            message.channel.awaitMessages(filter1, { max: 1, time: 60000 }).then(async collected => {
                if(collected.size >= 1) {
                    const newCmd = collected.find(m => m.content.toLowerCase().startsWith(settings.prefix))
                    if(newCmd) return
                    const annulation = collected.find(m => m.content.toUpperCase() === 'ANNULER')
                    if(annulation) {
                        client.annulation(message)
                    } else {
                        const tre = collected.find(m => m.content.toUpperCase() !== 'ANNULER')
                        const cat = tre.content
                        tre.delete()
                        msg.delete()
                        createTicketSystemStep3(message, settings, obj, cat)
                    };
                } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
            });
        })
    }

    createTicketSystemStep3 = (message, settings, obj, cat) => {
        const wantCat = new MessageEmbed()
        .setColor(enCours)
        .setAuthor('Quel rôle du STAFF pourra accéder aux tickets ?')
        .setDescription('Vous avez une minute pour le mentionner ou envoyer son ID')
        .setFooter('envoyez "ANNULER" pour annuler la commande')
        const filter1 = msg => msg.author.id === message.author.id;
        message.channel.send({embeds:[wantCat]}).then(msg => {
            message.channel.awaitMessages(filter1, { max: 1, time: 60000 }).then(async collected => {
                if(collected.size >= 1) {
                    const newCmd = collected.find(m => m.content.toLowerCase().startsWith(settings.prefix))
                    if(newCmd) return
                    const annulation = collected.find(m => m.content.toUpperCase() === 'ANNULER')
                    if(annulation) {
                        client.annulation(message)
                    } else {
                        const tre = collected.find(m => m.content.toUpperCase() !== 'ANNULER')
                        var role = tre.mentions.roles.first()
                        if(role) {
                            role = role.id
                            createTicketSystemStep4(message, settings, obj, cat, role)
                        } else {
                            role = message.guild.roles.cache.get(tre.content)
                            if(role) {
                                role = role.id
                                createTicketSystemStep4(message, settings, obj, cat, role)
                            } else {
                                message.channel.send('Role introuvable veuillez réessayer')
                                createTicketSystemStep3(message, settings, obj, cat)
                            }
                        }
                        tre.delete()
                        msg.delete()
                    };
                } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
            });
        })
    };

    createTicketSystemStep4 = (message, settings, obj, cat, role) => {
        const wantObj = new MessageEmbed()
        .setColor(enCours)
        .setAuthor('Accueil du membre')
        .setDescription('Vous avez une minute pour envoyer la phrase qui accueillera les membres quand ils ouvriront leur ticket`')
        .setFooter('envoyez "ANNULER" pour annuler la commande')
        const filter1 = msg => msg.author.id === message.author.id;
        message.channel.send({embeds:[wantObj]}).then(msg => {
            message.channel.awaitMessages(filter1, { max: 1, time: 60000 }).then(async collected => {
                if(collected.size >= 1) {
                    const newCmd = collected.find(m => m.content.toLowerCase().startsWith(settings.prefix))
                    if(newCmd) return
                    const annulation = collected.find(m => m.content.toUpperCase() === 'ANNULER')
                    if(annulation) {
                        annulation.delete()
                        client.annulation(message)
                    } else {
                        const tre = collected.find(m => m.content.toUpperCase() !== 'ANNULER')
                        if(tre.content.length > 2048) {
                            message.reply("Votre description est trop longue. Maximum : 2048 caractères")
                            return createTicketSystemStep4(message, settings, obj, cat, role)
                        }
                        const mot = tre.content
                        tre.delete()
                        msg.delete()
                        createTicketSystemStep5(message, settings, obj, cat, role, mot)
                    };
                } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
            });
        })
    };

    createTicketSystemStep5 = (message, settings, obj, cat, role, mot) => {
        const wantCat = new MessageEmbed()
        .setColor(enCours)
        .setAuthor('Dans quel salon dois-je envoyer l\' embed à partir duquel les membres pouront créer leur ticket')
        .setDescription('Vous avez une minute pour le mentionner ou envoyer son ID')
        .setFooter('envoyez "ANNULER" pour annuler la commande')
        const filter1 = msg => msg.author.id === message.author.id;
        message.channel.send({embeds:[wantCat]}).then(msg => {
            message.channel.awaitMessages(filter1, { max: 1, time: 60000 }).then(async collected => {
                if(collected.size >= 1) {
                    const newCmd = collected.find(m => m.content.toLowerCase().startsWith(settings.prefix))
                    if(newCmd) return
                    const annulation = collected.find(m => m.content.toUpperCase() === 'ANNULER')
                    if(annulation) {
                        client.annulation(message)
                    } else {
                        const tre = collected.find(m => m.content.toUpperCase() !== 'ANNULER')
                        var ch = tre.mentions.channels.first()
                        if(ch) {
                            ch = ch.id
                            createTicketSystemStep6(message, settings, obj, cat, role, mot, ch)
                        } else {
                            ch = message.guild.channels.cache.get(tre.content)
                            if(ch) {
                                ch = ch.id
                                createTicketSystemStep6(message, settings, obj, cat, role, mot, ch)
                            } else {
                                message.channel.send('Salon introuvable veuillez réessayer')
                                createTicketSystemStep5(message, settings, obj, cat, role, mot)
                            }
                        }
                        tre.delete()
                        msg.delete()
                    };
                } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
            });
        })
    };

    createTicketSystemStep6 = (message, settings, obj, cat, role, mot, ch) => {
        const wantObj = new MessageEmbed()
        .setColor(enCours)
        .setAuthor('Description du panel')
        .setDescription('Vous avez une minute pour envoyer la phrase qui décrit les raison pour lesquels le membre peut ouvrir un ticket grace a ce systeme')
        .setFooter('envoyez "ANNULER" pour annuler la commande')
        const filter1 = msg => msg.author.id === message.author.id;
        message.channel.send({embeds:[wantObj]}).then(msg => {
            message.channel.awaitMessages(filter1, { max: 1, time: 60000 }).then(async collected => {
                if(collected.size >= 1) {
                    const newCmd = collected.find(m => m.content.toLowerCase().startsWith(settings.prefix))
                    if(newCmd) return
                    const annulation = collected.find(m => m.content.toUpperCase() === 'ANNULER')
                    if(annulation) {
                        annulation.delete()
                        client.annulation(message)
                    } else {
                        const tre = collected.find(m => m.content.toUpperCase() !== 'ANNULER')
                        if(tre.content.length > 2048) {
                            message.reply("Votre description est trop longue. Maximum : 2048 caractères")
                            return createTicketSystemStep6(message, settings, obj, cat, role, mot, ch)
                        }
                        const ftr = tre.content
                        tre.delete()
                        msg.delete()
                        createTicketSystemStep7(message, settings, obj, cat, role, mot, ch, ftr)
                    };
                } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
            });
        })
    }

    createTicketSystemStep7 = (message, settings, obj, cat, role, mot, ch, tre) => {
        const chan = message.guild.channels.cache.get(ch)
        const panel = new MessageEmbed()
        .setColor(defaultColor)
        .setAuthor(obj.toUpperCase())
        .setDescription(tre)
        .setFooter('Pour créer un ticket cliquez sur la réaction')
        const filter1 = msg => msg.author.id === message.author.id && (msg.content.toUpperCase() === 'OUI' || msg.content.toUpperCase() === 'NON');
        message.channel.send(`Ce pannel vas etre envoyé dans le salon ${chan} en êtes vous satisfait ?\nRépondez par "OUI" ou par "NON"`,panel).then(msg => {
            message.channel.awaitMessages(filter1, { max: 1, time: 60000 }).then(async collected => {
                if(collected.size >= 1) {
                    const newCmd = collected.find(m => m.content.toLowerCase().startsWith(settings.prefix))
                    if(newCmd) return
                    const annulation = collected.find(m => m.content.toUpperCase() === 'NON')
                    if(annulation) {
                        annulation.delete()
                        msg.delete()
                        client.annulation(message)
                    } else {
                        const t = collected.find(m => m.content.toUpperCase() !== 'NON')
                        t.delete()
                        msg.delete()
                        await createTicketSystemStep8(message, settings, obj, cat, role, mot, ch, tre)
                        message.channel.send("Système de tickets créé !").then(msg => msg.delete({timeout: 5000}))
                    };
                } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
            });
        })
    };

    createTicketSystemStep8 = async (message, settings, obj, cat, role, mot, ch, tre) => {
        const chan = message.guild.channels.cache.get(ch)
        const panel = new MessageEmbed()
        .setColor(defaultColor)
        .setAuthor(obj.toUpperCase())
        .setDescription(tre)
        .setFooter('Pour créer un ticket cliquez sur la réaction')
        chan.send({embeds:[panel]}).then(async m => {
            m.react(idticket)
            client.createTicketSystem(mot, message.guild, m.id, obj.toLowerCase(), cat, role, m.channel)
            const embedmodif = new MessageEmbed()
            .setColor(validColor)
            .setTitle('Nouveau système de tickets')
            .setDescription(`Salon : ${chan}\nSujet : ${obj.toUpperCase()}`)
            .setFooter(`${client.user.username} by PommeD'API#7749`)
            .setTimestamp();
            const logs = client.channels.cache.get(settings.log.channel)
            if(logs) logs.send({embeds: [embedmodif]})
        });
    }

    client.deleteTicketSystem = async (message, settings, obj) => {
        const system = await client.ticketSystemAlreadyExist(message.guild, obj.toLowerCase())
        if(!system) return message.reply("il n'y a pas de système de tickets ouverts pour cette raison dans le serveur")
        await message.guild.channels.cache.get(system.pannelChannel).messages.fetch(system.messageOpenTicketID).then(msg => {
            if(msg) msg.delete()
        })
        await client.deleteTicketSystemDB(system.messageOpenTicketID)
        message.channel.send(`Le système de tickets a bien été supprimé`)
        const embedmodif = new MessageEmbed()
        .setColor(warningColor)
        .setTitle('Systeme de tickets desactivé')
        .setDescription(`Sujet : ${obj}`)
        .setFooter(`${client.user.username} by PommeD'API#7749`)
        .setTimestamp();
        const logs = client.channels.cache.get(settings.log.channel)
        if(logs) logs.send({embeds: [embedmodif]})
    }
};