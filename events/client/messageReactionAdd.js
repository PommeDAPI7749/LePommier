const { MessageEmbed } = require("discord.js")
const { defaultColor, warningColor, validColor } = require("../../util/couleurs")
const { idticket, idoff, idon, on, off, idrules } = require('../../util/emotes')

module.exports = async (client, reaction, user) => {
    if(user.id == client.user.id) return;
    if(user.bot) return
    const message = reaction.message
    const settings = await client.getGuild(message.guild);
    const member = await message.guild.members.cache.get(user.id)
    const rolereact = await client.RoleReactAlreadyExistMsg(message.id)

    if(rolereact) {
        reaction.users.remove(user.id)
        var emoji = await reaction.emoji.id
        var rolepos = ''
        if(emoji) {
            rolepos = await rolereact.emojisID.indexOf(emoji)
        } else {
            emoji = await reaction.emoji.name
            if(emoji) {
                rolepos = await rolereact.emojis.indexOf(emoji)
            } else return message.channel.send('Cet emoji ne correspond à aucun rôle').then(m => m.delete({timeout: 5000}))
        }
        var role = await rolereact.roles[rolepos]
        role = await message.guild.roles.cache.get(role)
        const v = await member.roles.cache.get(role.id)
        const clientMember = await message.guild.members.cache.get(client.user.id)
        if(clientMember.roles.highest.position < role.position || clientMember.roles.highest.position === role.position) {
            user.createDM().then(ch => ch.send(`Le rôle ${role} a été glissé au dessus des miens : je ne peux plus vous le donner. Veillez contacter le STAFF du serveur.`))
            return client.removeReactDB(message, role.id)
        } else {
            if(v) {
                await member.roles.remove(role)
                user.createDM().then(ch => ch.send(`Je viens de vous retirer le rôle \`${role.name}\` sur le serveur \`${message.guild.name}\``))
            } else {
                await member.roles.add(role)
                user.createDM().then(ch => ch.send(`Je viens de vous ajouter le rôle \`${role.name}\` sur le serveur \`${message.guild.name}\``))
            }
        }
    }

    if(reaction.emoji.id === idticket) {
        reaction.users.remove(user.id)
        const ticketsystem = await client.ticketSystemAlreadyExistMsg(message.id)
        if(ticketsystem) {
            const ticket = await client.getTicket(user, message.guild, ticketsystem.objet)
            if(ticket) {
                if(ticket.lock) {
                    const errorEm = new MessageEmbed()
                    .setColor(warningColor)
                    .setTitle("Erreur")
                    .setDescription(`Attention ${user} ! Un ticket existe déja à votre nom demandez au staff de le réouvrir !`)
                    user.createDM().then(ch => ch.send({embeds: [errorEm]}))
                } else {
                    const errorEm = new MessageEmbed()
                    .setColor(warningColor)
                    .setTitle("Erreur")
                    .setDescription(`Attention ${user} ! Vous avez déja un ticket ouvert pour cette raison !`)
                    user.createDM().then(ch => ch.send({embeds: [errorEm]}))
                }
            } else {
                const channelName = await message.guild.members.cache.get(user.id).nickname ? message.guild.members.cache.get(user.id).nickname : user.username
                message.guild.channels.create(channelName, {
                    parent: ticketsystem.category,
                }).then(ch => {
                    ch.overwritePermissions([
                        {
                            id: message.guild.roles.cache.find(n => n.name === '@everyone').id,
                            deny: ['VIEW_CHANNEL'],
                        },
                        {
                            id: ticketsystem.roleID,
                            allow: ['VIEW_CHANNEL'],
                        },
                        {
                            id: user.id,
                            allow: ['VIEW_CHANNEL'],
                        },
                    ])
                    const embed = new MessageEmbed()
                    .setAuthor(`ticket de ${user.username}`, user.displayAvatarURL())
                    .setTitle(`Sujet : ${ticketsystem.objet}`)
                    .setColor(defaultColor)
                    .setFooter(`${client.user.username} par PommeD'API#7749`)
                    .setDescription(`**${ticketsystem.messageWelcome ? ticketsystem.messageWelcome : 'Bienvenue dans votre ticket, un membre du STAFF vous viendra en aide dès que possible'}**\n\n${off} : Verouiller le ticket\n\\🗑️ : Supprimer le ticket`)
                    ch.send(`${user}`,embed).then(async msg => {
                        await client.createTicket(ticketsystem.objet, user.id, message.guild.id, ch.id, msg.id)
                        msg.react(idoff)
                        msg.react('🗑️')
                        msg.pin()
                    })
                    const embedmodif = new MessageEmbed()
                    .setColor(validColor)
                    .setTitle('Nouveau ticket')
                    .setDescription(`Membre : ${user}\nSujet : ${ticketsystem.objet}`)
                    .setFooter(`${client.user.username} by PommeD'API#7749`)
                    .setTimestamp();
                    const logs = message.guild.channels.cache.get(settings.log.channel)
                    if(logs) logs.send({embeds: [embedmodif]})
                })
            }
        } else message.delete()
    }

    if(reaction.emoji.id === idoff) {
        const t = await client.getTicketByMsgID(message.id)
        if(t) {
            reaction.users.remove(user.id)
            const member = message.guild.members.cache.get(t.userID)
            message.channel.updateOverwrite(member, {
                VIEW_CHANNEL: false,
            })
            message.channel.setName(`🔒${member.nickname ? member.nickname : member.user.username}`)
            const em = new MessageEmbed()
            .setAuthor(`ticket de ${user.username}`, user.displayAvatarURL())
            .setTitle(`Statut : Fermé`)
            .setColor(warningColor)
            .setDescription(`${on} : Réouvrir le ticket\n\\🗑️ : Supprimer le ticket`) 
            .setFooter(`${client.user.username} par PommeD'API#7749`)
            message.channel.send({embeds: [em]}).then(async msg => {
                client.updateTicket(message.channel, {messageCloseID: msg.id, lock: true})
                msg.react(idon)
                msg.react('🗑️')
                msg.pin()
            })
        }
    };

    if(reaction.emoji.id === idon) {
        const t = await client.getTicketByMsgID(message.id)
        if(t) {
            reaction.users.remove(user.id)
            const member = message.guild.members.cache.get(t.userID)
            message.channel.updateOverwrite(member, {
                VIEW_CHANNEL: true,
            })
            message.channel.setName(`${member.nickname ? member.nickname : member.user.username}`)
            const embed = new MessageEmbed()
            .setAuthor(`ticket de ${user.username}`, user.displayAvatarURL())
            .setTitle(`Sujet : ${t.ticketObject}`)
            .setColor(defaultColor)
            .setFooter(`${client.user.username} par PommeD'API#7749`)
            .setDescription(`${off} : Verrouiller le ticket\n\\🗑️ : Supprimer le ticket`)
            message.channel.send({content: `${member}, le STAFF viens de réouvrir votre ticket !`, embeds: [embed]}).then(async msg => {
                client.updateTicket(message.channel, {messageCloseID: msg.id, lock: false})
                msg.react(idoff)
                msg.react('🗑️')
                msg.pin()
            })
        }
    };
    
    if(reaction.emoji.name === '🗑️') {
        const ticket = await client.getTicketByMsgID(message.id)
        if(ticket) {
            reaction.users.remove(user.id)
            message.channel.delete()
            client.deleteTicket(message)
            const embedmodif = new MessageEmbed()
            .setColor(warningColor)
            .setTitle('Ticket supprimé')
            .setDescription(`Par : ${user}\nTicket de : ${await message.guild.members.cache.get(ticket.userID)}\nSujet : ${ticket.ticketObject}`)
            .setFooter(`${client.user.username} by PommeD'API#7749`)
            .setTimestamp();
            const logs = message.guild.channels.cache.get(settings.log.channel)
            if(logs) logs.send({embeds: [embedmodif]})
        }
    };

    if(reaction.emoji.id === idrules) {
        const rules = await client.getRules(message.guild)
        if(rules) {
            const member = message.guild.members.cache.get(user.id)
            const role = await message.guild.roles.cache.get(rules.role)
            if(!role) return message.reply('Le role relié à ce règlement a été supprimé veuillez contacter le STAFF du serveur')
            member.roles.add(role)
            user.createDM().then(ch => ch.send(`Vous avez accepté le règlement dans le serveur \`${message.guild.name}\`, je vous ai donc ajouté le rôle \`${role.name}\``))
        }
    }
}