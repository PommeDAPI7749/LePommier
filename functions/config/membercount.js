const { MessageEmbed } = require("discord.js");
const { enCours, validColor, warningColor, invisible } = require("../../util/couleurs");

module.exports = client => {
    client.memberCount = async (message, settings) => {
        const embed = new MessageEmbed()
        .setTitle("Compteur de membres")
        .setColor(enCours)
        .setDescription(`Compteur de membres: ${settings.memberCount.enabled ? `Activé\nFormat : \`${settings.memberCount.text ? settings.memberCount.text : "{{MC}} membres"}\`\nSalon: <#${settings.memberCount.channel}>` : 'Désactivé'}`);
        var foot = ' ';
        var filter1 = false;
        if(settings.memberCount.enabled) {
            foot = "Répondez \"DESACTIVER\" ou \"MODIFIER\" pour modifier le compteur de membres"
            filter1 = msg => msg.author.id === message.author.id && (msg.content.toUpperCase() === "DESACTIVER" || msg.content.toLowerCase() === "désactiver" || msg.content.toUpperCase() === "MODIFIER" || msg.content.toLowerCase().startsWith(settings.prefix));
        } else {
            foot = "Répondez \"ACTIVER\" pour activer le compteur de membres"
            filter1 = msg => msg.author.id === message.author.id && (msg.content.toUpperCase() === "ACTIVER"|| msg.content.toLowerCase().startsWith(settings.prefix));
        }
        embed.setFooter(foot)
        message.channel.send({embeds: [embed]}).then(msg => {
            message.channel.awaitMessages(filter1, { max: 1, time: 60000 }).then(async collected => {
                if(collected.size >= 1) {
                    const act = collected.find(m => m.content.toUpperCase() === 'ACTIVER')
                    const desac = collected.find(m => m.content.toUpperCase() === 'DESACTIVER' || m.content.toLowerCase() === "désactiver")
                    const update = collected.find(m => m.content.toUpperCase() === 'MODIFIER')
                    if(update) {
                        update.delete()
                        modifmemberCountChannel(message, settings)
                    }
                    if(act) {
                        act.delete()
                        actmemberCount(message, settings)
                    }
                    if(desac) {
                        desac.delete()
                        desacmemberCount(message, settings)
                    }
                    msg.delete()
                    
                } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
            });
        });
    };

    actmemberCount = async (message, settings) => {
        var name = settings.memberCount.text || '{{MC}} membres'
        if(name.includes('{{MC}}')) name = name.replace("{{MC}}", message.guild.memberCount)
        message.guild.channels.create(name, {
            type: 'voice',
          }).then(async ch => {
              await ch.updateOverwrite(message.guild.roles.cache.find(r => r.name === '@everyone'), {
                CONNECT: false
            })
            var sett = settings.memberCount
            sett.channel = ch.id
            sett.enabled = true
            await client.updateGuild(message.guild, {memberCount: sett})
            const embedmodif = new MessageEmbed()
            .setColor(validColor)
            .setTitle('MemberCount activé')
            .setDescription(`Salon : <#${ch.id}>`)
            .setFooter(`${client.user.username} by PommeD'API#7749`)
            .setTimestamp();
            message.channel.send('MemberCount activé').then(m => m.delete({timeout: 5000}))
            const logs = client.channels.cache.get(settings.log.channel)
            if(logs) logs.send({embeds: [embedmodif]})
          })
    };

    desacmemberCount = async (message, settings) => {
        var sett = {
            enabled: false,
            channel: '',
            text: ''
        }
        await client.updateGuild(message.guild, {memberCount: sett})
        message.guild.channels.cache.get(settings.memberCount.channel).delete()
        const embedmodif = new MessageEmbed()
        .setColor(warningColor)
        .setTitle(`Compteur de désactivé`)
        .setDescription(`Par : ${message.author.username}`)
        .setFooter(`${client.user.username} by PommeD'API#7749`)
        .setTimestamp();
        const embedmodif2 = new MessageEmbed()
        .setColor(validColor)
        .setTitle('Confirmation')
        .setDescription(`Compteur de désactivé`)
        const logs = client.channels.cache.get(settings.log.channel)
        if(logs) logs.send({embeds: [embedmodif]})
        message.channel.send({embeds: [embedmodif2]})
    };

    modifmemberCountChannel = async (message, settings) => {
        const embed2 = new MessageEmbed()
        .setColor(invisible)
        .setTitle('Modification du compteur de membres')
        .setDescription("Pour modifier le texte du compteur de membres il vous suffit d'envoyer le texte ici dans la minute\nRemplacez le nombre de membres par {{MC}}")
        .setFooter('Répondez "ANNULER" pour annuler')
        const filter1 = msg => msg.author.id === message.author.id;
        message.channel.send({embeds: [embed2]}).then(msg => {
            message.channel.awaitMessages(filter1, { max: 1, time: 60000 }).then(async collected => {
                if(collected.size >= 1) {
                    const annulation = collected.find(m => m.content.toUpperCase() === 'ANNULER')
                    if(annulation) {
                        client.annulation(message)
                    } else {
                        const tre = collected.find(m => m.content.toUpperCase() !== 'ANNULER')
                        const texte = tre.content
                        msg.delete()
                        tre.delete()
                        const embedmodif = new MessageEmbed()
                        .setColor(validColor)
                        .setTitle(`Format du compteur de membres mis à jour`)
                        .setDescription(`Avant : ${settings.memberCount.text}\nMaintenant : ${texte}`)
                        .setFooter(`${client.user.username} by PommeD'API#7749`)
                        .setTimestamp();
                        const embedmodif2 = new MessageEmbed()
                        .setColor(validColor)
                        .setTitle('Confirmation')
                        .setDescription(`Format du compteur de membres mis à jour`)
                        .setFooter(`${client.user.username} by PommeD'API#7749`)
                        var sett = settings.memberCount
                        sett.text = texte
                        await client.updateGuild(message.guild, {memberCount: sett})
                        const memberCountCh = message.guild.channels.cache.get(settings.memberCount.channel)
                        var name = texte
                        if(name.includes('{{MC}}')) name = name.replace("{{MC}}", message.guild.memberCount)
                        if(memberCountCh) memberCountCh.setName(name)
                        const logs = client.channels.cache.get(settings.log.channel)
                        if(logs) logs.send({embeds: [embedmodif]})
                        message.channel.send({embeds: [embedmodif2]})
                    };
                } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
            });
        });
    };
}