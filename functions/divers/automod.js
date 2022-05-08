const { MessageEmbed } = require("discord.js");
const ms = require('ms')

module.exports = client => {
    client.spam = async message => {
        const channel = message.channel;
        var array = await channel.messages.cache.filter(m => m.author)
        array = await array.filter(m => m.author.id == message.author.id)
        array = await array.filter(m => (message.createdTimestamp - m.createdTimestamp) < 5000)
        if(array.size === 5) {
            return array
        } else return false
    }

    client.autoWarn = async (raison, settings, mem, message) => {
        if(!mem.manageable) return
        const memberToUpdate = await client.getMember(mem);
        if(mem) {
            var warns = memberToUpdate.warns
            var w = {}
            w.reason = raison
            w.moderator = "Modération automatique"
            if(warns) {
                warns.push(w)
            } else warns = [w]
            await client.updateMember(mem, {warns: warns})
    
            const embed = new MessageEmbed()
            .setAuthor(`${mem.user.username} (${mem.id})`, mem.user.avatarURL())
            .setColor('#ffa500')
            .setDescription(`**Action :** warn \n**raison :** ${raison}`)
            .setFooter(`Avertis par l'autoMod`, client.user.avatarURL({format: "png"}))
            .setTimestamp();
            const log = client.channels.cache.get(settings.log.channel)
            if(log) log.send({embeds: [embed]})
            message.reply(`vous venez d'être averti pour ${raison}`).then(msg => msg.delete({timeout : 10000}))
            client.autoSanction(message, settings, mem, warns)
        }
    }

    client.autoMute = async (settings, mem, message, time) => {
        const log = client.channels.cache.get(settings.log.channel)
        if(!mem.manageable) return
        let muteRole = message.guild.roles.cache.get(settings.secu.muteRole);
        let muteTime = (time || "60m" );
        if(!muteRole) {
            muteRole = await message.guild.roles.create({
                data: {
                    name: 'muted',
                    color: '#000',
                    permission: []
                }
            }).then(r => {
                var sett = settings.secu
                sett.muteRole = r.id
                client.updateGuild(message.guild, {secu: sett})
                message.guild.channels.cache.forEach(async (channel, id) => {
                    await channel.updateOverwrite(r, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false,
                        CONNECT: false
                    })
                });
            })
        }
    
        await mem.roles.add(muteRole.id)
        if(log) log.send(`<@${mem.id}> est reduit au silence pour ${ms(ms(muteTime))}.`).then(m => m.delete({timeout: 5000}))
    
        setTimeout(() => {
            if(log) log.send(`<@${mem.id}> peut à nouveau parler`)
            mem.roles.remove(muteRole.id);
        }, ms(muteTime))
    
        const embed = new MessageEmbed()
        .setAuthor(`${mem.user.username} (${mem.id})`, mem.user.avatarURL())
        .setColor('#ffa500')
        .setDescription(`**Action :** mute \n**Temps :** ${muteTime}`)
        .setFooter(`Réduit au silence par l'autoMod`, client.user.displayAvatarURL())
        .setTimestamp();
    
        if(log) log.send({embeds: [embed]})
    
    }
    
    client.autoKick = async (settings, message, member) => {
        if(!member.kickable) return
        if(!member.manageable) return

        const embed = new MessageEmbed()
            .setAuthor(`${member.username} (${member.id})`, member.avatarURL())
            .setColor(enCours)
            .setDescription(`**Action :** expulsion \n**Raison :** Nombre d'avertissements atteint`)
            .setFooter(`Exclu par l'autoMod`, client.user.displayAvatarURL())
            .setTimestamp();

        message.guild.member(member).kick(`Nombre d'avertissements atteint`)
        const log = client.channels.cache.get(settings.log.channel)
        if(log) log.send({embeds: [embed]})
    }

    client.autoBan = async (settings, message, user) => {
        if(!user.bannable) return message.reply('je ne peux pas bannir ce membre')
        message.guild.members.ban(user, {
            reason: `Nombre d'avertissements atteint`
        })
    
        const embed = new MessageEmbed()
            .setAuthor(`${user.username} (${user.id})`, user.avatarURL())
            .setColor(warningColor)
            .setDescription(`**Action :** bannissement \n**Raison :** Nombre d'avertissements atteint`)
            .setFooter(`Bannis par l'autoMod`, client.user.displayAvatarURL())
            .setTimestamp();
        const log = client.channels.cache.get(settings.log.channel)
        if(log) log.send({embeds: [embed]})
    }

    client.autoSanction = async (message, settings, member, warns) => {
        const sanctionsAuto = settings.secu.sanctions
        await sanctionsAuto.map(s => {
            if(warns.length == s.n) {
                if(s.s.s === 'mute') {
                    client.autoMute(settings, member, message, s.s.t)
                } else if(s.s.s === 'kick') {
                    client.autoKick(settings, member, message)
                } else if(s.s.s === 'ban') {
                    client.autoBan(settings, member, message)
                }
            }
        })
    }

    client.autoReward = async (message, settings, member, level) => {
        const rewardsAuto = settings.leveling.rewards
        await rewardsAuto.map(async r => {
            if(level == r.l) {
                const role = await message.guild.roles.cache.get(r.r)
                if(role) member.roles.add(role)
                return member.user.createDM().then(ch => ch.send(`Vous venez d'atteindre le niveau \`${level}\` sur le serveur \`${message.guild.name}\` et avez donc reçu le rôle \`${role.name}\``))
            }
        })
    }
};