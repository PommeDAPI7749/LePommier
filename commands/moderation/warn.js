const {MessageEmbed}= require('discord.js');
const { invisible } = require('../../util/couleurs');

module.exports.run = async (settings, client, message, args, command) => {
    if(args[0] != '+' && args[0] != '-')  {
        const help =  await client.sendHelpCmd(command, settings, message)
        return message.reply('arguments invalides, voici un message d\'aide :', help)
    }
    var member = message.mentions.members.last()
    if(!member || member.user.id === client.user.id) member = message.guild.members.cache.get(args[1])
    if(!member || member.user.id === client.user.id) return message.reply('membre introuvable')
    const memberToUpdate = await client.getMember(member);
    if(member){
        if(!memberToUpdate) return message.reply('ce membre n\'est pas dans la base de données')
        if(args[0] === '+') {
            const user = member.user
            let raison = args.splice(2).join(' ');
            if(!raison) return message.reply("il est impossible d'avertir un membre sans lui dire pourquoi")
            if(raison.length > 1024) return message.reply("Votre raison est trop longue. Maximum : 1024 caractères")
            var w = {}
            w.reason = raison
            w.moderator = `${message.author.tag} (${message.author.id})`
            var warns = memberToUpdate.warns
            if(warns) {
                warns.push(w)
            } else warns = [w]
            await client.updateMember(member, {warns: warns})
        
            const embed = new MessageEmbed()
            .setAuthor(`${member.user.username} (${member.id})`, member.user.avatarURL())
            .setColor('#ffa500')
            .setDescription(`**Action :** warn \n**raison :** ${raison}`)
            .setFooter(`par ${message.author.username}`, message.author.avatarURL())
            .setTimestamp();
            const embed2 = new MessageEmbed()
            .setAuthor(`${member.user.username} (${member.id})`, member.user.avatarURL())
            .setColor(invisible)
            .setDescription(`**A été averti** \nRaison : \`${raison}\``)
            .setFooter(`par ${message.author.username}`, message.author.avatarURL())
            .setTimestamp();
            const embed3 = new MessageEmbed()
            .setColor(invisible)
            .setDescription(`**Vous avez reçu un avertissement dans le serveur : \`${message.guild.name}\`** \nRaison : \`${raison}\``)
            .setTimestamp();
            user.createDM().then(ch => ch.send({embeds: [embed3]}))
            const log = client.channels.cache.get(settings.log.channel)
            if(log) log.send({embeds: [embed]})
            message.channel.send({embeds: [embed2]}).then(msg => msg.delete({timeout : 10000}))
            client.autoSanction(message, settings, member, warns)
        } else {
            if(args[2] && args[2].toLowerCase() == 'all') {
                await client.updateMember(member, {warns: []})
                message.reply('avertissements remis a 0').then(m => m.delete({timeout: 5000}))
            } else client.getWarnToRemove(message, member)
        }
    } else {
        message.channel.send(`Cet utilisateur n'existe pas ou n'est pas dans le serveur`);
    }
};

module.exports.help = {
    vanish: true,
    group: 'moderation',
    name: "warn",
    aliases: ['warn'],
    description: "Avertis un utilisateur",
    bug: false,
    precisions: '',
    requireArgs: true,
    argsRequiered: "<+/-> <@user> <raison>",
    exemple: "@PommeD'API#7749 spam",
    permissions: ["MANAGE_MESSAGES"],
    permissionsBot: ["MANAGE_MESSAGES", "SEND_MESSAGES"],
};