const { MessageEmbed } = require("discord.js");
const { validColor, warningColor, invisible } = require("../../util/couleurs");

module.exports = client => {
    client.autorole = async (message, settings) => {
        if(typeof settings.autorole == 'string') {
            settings.autorole = {
                enabled: true,
                role: [settings.autorole]
            }
            await client.updateGuild(message.guild, { autorole: settings.autorole});
        }
        const embed = new MessageEmbed()
        .setTitle("Autorole")
        .setColor(invisible)
        .setDescription(`Roles par défaut actuel: ${settings.autorole.role ? settings.autorole.role.map(rid => message.guild.roles.cache.get(rid)).join(', ') : 'indéfini'}`)
        .setFooter("Répondez \"+/-\" pour ajouter/retirer des roles")
        const filter1 = msg => msg.author.id === message.author.id && (msg.content === "+" || msg.content === "-" || msg.content.toLowerCase().startsWith(settings.prefix));
        message.channel.send({embeds: [embed]}).then(msg => {
            message.channel.awaitMessages(filter1, { max: 1, time: 60000 }).then(collected => {
                if (collected.size >= 1) {
                    const tre = collected.find(m => !m.content.startsWith(settings.prefix))
                    if(!tre) return
                    tre.delete()
                    if(collected.find(m => m.content == "+")) addAutoRole(message, settings)
                    if(collected.find(m => m.content == "-")) removeAutoRole(message, settings)
                };
                msg.delete()
            });
        });
    };

    addAutoRole = async (message, settings) => {
        const embed2 = new MessageEmbed()
        .setColor(invisible)
        .setTitle('Ajout d\'un role automatiqe')
        .setDescription("Pour ajouter un role automatique il vous suffit de le mentionner ou d'envoyer son ID ici dans la minute")
        .setFooter('Répondez "ANNULER" pour annuler')
        const filter1 = msg => msg.author.id === message.author.id;
        message.channel.send({embeds: [embed2]}).then(msg => {
            message.channel.awaitMessages(filter1, { max: 1, time: 60000 }).then(collected => {
                if (collected.size >= 1) {
                    const annulation = collected.find(m => m.content.toUpperCase() === 'ANNULER')
                    if (annulation){
                        client.annulation(message)
                        annulation.delete()
                    } else {
                        const tre = collected.find(m => m.content.toUpperCase() !== 'ANNULER')
                        tre.delete()
                        var newRole = tre.mentions.roles.first()
                        if(!newRole) newRole = message.guild.roles.cache.get(tre.content)
                        if (newRole) {
                            var roles = settings.autorole.role.slice()
                            if(roles.indexOf(newRole.id) != -1) {
                                message.reply('ce rôle est deja donné par défaut aux membres lors de leur arrivée')
                                return msg.delete()
                            }
                            roles.push(newRole.id)
                            const embedmodif = new MessageEmbed()
                            .setColor(validColor)
                            .setTitle('Role.s par défaut mis à jour')
                            .setDescription(`Avant : \`${settings.autorole.role?settings.autorole.role.map(r => message.guild.roles.cache.get(r)? message.guild.roles.cache.get(r).name : "rôleSupprimé").join('\`, \`') : 'aucun'}\`\nMaintenant : \`${roles.map(r => message.guild.roles.cache.get(r)?message.guild.roles.cache.get(r).name:'rôleSupprimé').join('\`, \`')}\``)
                            .setFooter(`${client.user.username} by PommeD'API#7749`)
                            .setTimestamp();
                            const embedmodif2 = new MessageEmbed()
                            .setColor(validColor)
                            .setTitle('Confirmation')
                            .setDescription(`Roles par défaut mis à jour`)
                            .setFooter(`${client.user.username} by PommeD'API#7749`)
                            client.updateGuild(message.guild, { autorole: { enabled: true, role: roles }});
                            const logs = client.channels.cache.get(settings.log.channel)
                            if (logs) logs.send({embeds: [embedmodif]})
                            message.channel.send({embeds: [embedmodif2]})
                        } else {
                            message.reply("role introuvable ...").them(m => m.delete({timeout: 5000}))
                            addAutoRole(message, settings)
                        };
                    };
                        
                }
                msg.delete()
            });
        });
    };
    removeAutoRole = async (message, settings) => {
        const embed2 = new MessageEmbed()
        .setColor(invisible)
        .setTitle('Retrait d\'un role automatiqe')
        .setDescription("Pour retirer un role automatique il vous suffit de le mentionner ou d'envoyer son ID ici dans la minute")
        .setFooter('Répondez "ANNULER" pour annuler')
        const filter1 = msg => msg.author.id === message.author.id;
        message.channel.send({embeds: [embed2]}).then(msg => {
            message.channel.awaitMessages(filter1, { max: 1, time: 60000 }).then(collected => {
                if (collected.size >= 1) {
                    const annulation = collected.find(m => m.content.toUpperCase() === 'ANNULER')
                    if (annulation){
                        client.annulation(message)
                        annulation.delete()
                    } else {
                        const tre = collected.find(m => m.content.toUpperCase() !== 'ANNULER')
                        tre.delete()
                        var newRole = tre.mentions.roles.first()
                        if(!newRole) newRole = message.guild.roles.cache.get(tre.content)
                        if (newRole) {
                            var roles = settings.autorole.role.slice()
                            var index = roles.indexOf(newRole.id)
                            if(index == -1) {
                                message.reply('ce rôle ne fait pas parti des rôles donnés aux membres lors de leur arrivée')
                                return msg.delete()
                            }
                            roles.splice(index, 1)
                            console.log(roles)
                            console.log(settings.autorole.role)
                            const embedmodif = new MessageEmbed()
                            .setColor(validColor)
                            .setTitle('Role.s par défaut mis à jour')
                            .setDescription(`Avant : \`${settings.autorole.role?settings.autorole.role.map(r => message.guild.roles.cache.get(r)?message.guild.roles.cache.get(r).name:'rôleSupprimé').join('\`, \`') : 'aucun'}\`\nMaintenant : \`${roles.map(r => message.guild.roles.cache.get(r)?message.guild.roles.cache.get(r).name:'rôleSupprimé').join('\`, \`')}\``)
                            .setFooter(`${client.user.username} by PommeD'API#7749`)
                            .setTimestamp();
                            const embedmodif2 = new MessageEmbed()
                            .setColor(validColor)
                            .setTitle('Confirmation')
                            .setDescription(`Roles par défaut mis à jour`)
                            .setFooter(`${client.user.username} by PommeD'API#7749`)
                            client.updateGuild(message.guild, { autorole: { enabled: true, role: roles }});
                            const logs = client.channels.cache.get(settings.log.channel)
                            if (logs) logs.send({embeds: [embedmodif]})
                            message.channel.send({embeds: [embedmodif2]})
                        } else {
                            message.reply("role introuvable ...").them(m => m.delete({timeout: 5000}))
                            addAutoRole(message, settings)
                        };
                    };
                        
                }
                msg.delete()
            });
        });
    };
};