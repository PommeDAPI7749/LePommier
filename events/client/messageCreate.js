const { MessageEmbed } = require('discord.js');
const { invisible } = require('../../util/couleurs');
const ms = require('ms')

module.exports = async (client, message) => {
    if(message.author.bot) return;
    if(message.channel.type === 'dm') return
    //Création d'infos si nécessaire
    const dbUser = await client.getUser(message.author);
    const settings = await client.getGuild(message.guild);
    const dbMember = await client.getMember(message.member);

    //Systèmes de SECU
    if(message.member){
        if(!message.member.permissions.has('MANAGE_MESSAGES') && message.author.id !== message.guild.owner.id) {
        const spam = await client.spam(message)
        if(spam) {
            await message.guild.channels.cache.map(async channel => {
                await channel.updateOverwrite(message.author, {
                    SEND_MESSAGES: false,
                })
            })
            setTimeout(() => {
                message.guild.channels.cache.map(channel => {
                    channel.updateOverwrite(message.author, {
                        SEND_MESSAGES: null,
                    })
                })
            }, ms('1m'))
            return client.autoWarn(`Spam`, settings, message.member, message)
        }
        const lien = message.content
        if(settings.secu.antiInvite) {
            let discordInvite = /(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)?/i;
            if(discordInvite.test(message.content)) {
                client.autoWarn(`Publication d'un lien Discord`,settings, message.member, message)
                return message.delete()
            }
        }
        if(settings.secu.antiLien && (lien.includes("http://") || lien.includes("https://") || lien.includes(".fr") || lien.includes(".com") || lien.includes(".org") || lien.includes(".be") || lien.includes(".ue") || lien.includes("www.") || lien.includes("discord.gg/")) && (!lien.includes("tenor"))) {
            client.autoWarn(`Publication d'un lien`,settings, message.member, message)
            return message.delete()
        }
        var mentions = 0
        await message.mentions.members.map(() => mentions+=1)
        await message.mentions.roles.map(() => mentions+=1)
        if(settings.secu.antiMention != 0 && mentions > settings.secu.antiMention) {
            await client.autoWarn(`Trop de mentions (${mentions} / ${settings.secu.antiMention})`,settings, message.member, message)
        }
        }
    }

    //Aide préfix
    if(message.content === `<@!${client.user.id}>`) return message.channel.send(`Sur ce serveur mon préfix est \`${settings.prefix}\``)
    
    //Récup des infos pour la commande
    const arg = message.content.split(/ +/)
    const mention = arg.shift()
    var args = ''
    var commandName = ''
    var user = message.mentions.users.first();
    if(message.content.toLowerCase().startsWith(settings.prefix)) {
        args = message.content.slice(settings.prefix.length).split(/ +/);
        commandName = args.shift().toLowerCase();
    } else if(mention === `<@!${client.user.id}>`) {
        args = message.content.split(/ +/);
        const l = args.shift()
        commandName = args.shift().toLowerCase();
    }
        
    //Run de la commande
    const command = client.commands.find(cmd => cmd.help.name === commandName || (cmd.help.aliases && cmd.help.aliases.includes(commandName)));
    if(command) {
        if(command.help.group === 'reservedevs' && message.author.id !== "539510339713105950") return message.reply("Seul \`PommeD'API#7749\` peut utiliser cette commande")
        if(command.help.vanish) message.delete()
        if(command.help.bug) {
            const embedBug = new MessageEmbed()
            .setColor(invisible)
            .setDescription(`Je suis en train de resoudre quelques bugs sur cette commande (${command.help.precisions || 'Aucunes précisions'})\n\n\`PommeDAPI#7749\``)
            return message.channel.send({embeds: [embedBug]});
        } 
        for(perms of command.help.permissions) {
            if(!message.member.permissions.has(perms) && message.author.id !== message.guild.owner.user.id) return message.reply(`tu n'as pas les permissions requises pour utiliser la commande ${commandName}.`);
        } 
        if(command.help.requireArgs && !args.length) {
            let noArgsReply = `Il me faut des arguments pour executer cette commande`;
            if(command.help.argsRequiered) noArgsReply += `\nVoici comment utiliser la commande: \`${settings.prefix}${command.help.name} ${command.help.argsRequiered}\``
            return message.channel.send(noArgsReply)
        }
        if(command.help.userMentionnedIsStaff && !user) return message.reply('il faut mentionner un utilisateur !')
        if(command.help.userMentionnedIsStaff && message.guild.member(message.mentions.users.first()).hasPermission('MANAGE_MESSAGES')) return message.reply(`tu ne peux pas utiliser la commande ${commandName} sur ce membre.`);
        
        return command.run(settings, client, message, args, command);
    }

    //Leveling
    if(settings.leveling.enabled) {
        if(message.content.length >= 6) {
            const expCd = await Math.floor(Math.random() * 4) + 1;
            const expToAdd = await Math.floor(Math.random() * 10) + 5;
            if(expCd <= 2) {
                await client.addExp(client, message.member, expToAdd)
                if(dbMember.experience+expToAdd >= dbMember.level*dbMember.level*3+20) {
                    client.updateLevel(message)
                    client.autoReward(message, settings, message.member, dbMember.level+1)
                }
            }
        }
    }
}