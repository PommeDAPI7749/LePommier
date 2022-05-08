const { MessageEmbed } = require("discord.js");
const { invisible } = require("../../util/couleurs");

module.exports.run = async (settings, client, message, args, command) => {
    if(!args[0]) {
        const em = new MessageEmbed()
        .setTitle('Messages d\'au revoir')
        .setColor(invisible)
        const ch = await message.guild.channels.cache.get(settings.leave.channel)
        if(settings.leave.enabled && ch) {
            em.setDescription(`Statut : \`Activé\`\nSalon : ${ch}\nMessage : \`${settings.leave.message ? settings.leave.message : 'désactivé'}\`\nImage : \`${settings.leave.image ? 'activée' : 'désactivée'}\``)
        } else em.setDescription(`Statut : \`Désactivés\``)
        return message.channel.send({embeds: [em]})
    }
    if(args[0].toLowerCase() === 'channel') {
        if(!settings.leave.enabled) return message.reply("les messages d'au revoir sont desactivés sur le serveur")
        client.leaveChannel(message, settings)
    } else if(args[0].toLowerCase() === 'message') {
        if(!settings.leave.enabled) return message.reply("les messages d'au revoir sont desactivés sur le serveur")
        client.leaveMessage(message,settings)
    } else if(args[0].toLowerCase() === 'messageinembed') {
        if(!settings.leave.enabled) return message.reply("les messages d\`au revoir sont désactivés sur le serveur")
        if(args[1].toLowerCase() === 'on') {
            if(settings.leave.messagein) return message.reply("les messages d\`au revoir sont deja dans un embed sur ce serveur")
            var sett = settings.leave
            sett.messagein = true
            await client.updateGuild(message.guild, {leave: sett})
            message.reply('les messages d\`au revoir apparaissent maintenant dans un embed')
        } else if(args[1].toLowerCase() === 'off') {
            if(!settings.leave.messagein) return message.reply("les messages d\`au revoir sont déjà en dehors de l'embed sur ce serveur")
            var sett = settings.leave
            sett.messagein = false
            await client.updateGuild(message.guild, {leave: sett})
            message.reply('les messages d\`au revoir n\'apparaissent plus dans un embed')
        } else {
            const help =  await client.sendHelpCmd(command, settings, message)
            message.reply('argument invalide, voici un message d\'aide :', help).then(msg => msg.delete({timeout: 5000}))
        }
    } else if(args[0].toLowerCase() === 'image') {
        if(!settings.leave.enabled) return message.reply("les messages d\'au revoir sont désactivés sur le serveur")
        if(args[1].toLowerCase() === 'on') {
            if(settings.leave.image) return message.reply("les images d\'au revoir sont deja activées sur le serveur")
            var sett = settings.leave
            sett.image = true
            await client.updateGuild(message.guild, {leave: sett})
            message.reply('images d\'au revoir activées')
        } else if(args[1].toLowerCase() === 'off') {
            if(!settings.leave.image) return message.reply("les images d\'au revoir sont deja désactivées sur le serveur")
            var sett = settings.leave
            sett.image = false
            await client.updateGuild(message.guild, {leave: sett})
            message.reply('images d\'au revoir désactivées')
        } else {
            const help =  await client.sendHelpCmd(command, settings, message)
            message.reply('argument invalide, voici un message d\'aide :', help).then(msg => msg.delete({timeout: 5000}))
        }
    } else if(args[0].toLowerCase() === 'enable') {
        if(settings.leave.enabled) return message.reply("les messages d'au revoir sont déjà activés sur le serveur")
        client.leaveEnable(message,settings)
    } else if(args[0].toLowerCase() === 'message') {
        if(!settings.leave.enabled) return message.reply("les messages d'au revoir sont déja desactivés sur le serveur")
        await client.updateGuild(message.guild, {leave: {enabled: false, message: '', channel: ''}})
        message.reply('messages d\'au revoir désactivés')
    } else {
        const help =  await client.sendHelpCmd(command, settings, message)
        message.reply('argument invalide, voici un message d\'aide :', help).then(msg => msg.delete({timeout: 5000}))
    }
};

module.exports.help = {
    vanish: true,
    group: 'configuration',
    name: "leave",
    aliases: ["leave"],
    description: "Modifile message de départ sur le serveur",
    bug: false,
    precisions: '',
    requireArgs: false,
    exemple: 'image on',
    argsRequiered: '(channel/message/messageinembed/image/enable/disable) (si image ou message ou messageinembed : <on/off>)',
    permissions: ['MANAGE_GUILD'],
    permissionsBot: ["ADMINISTRATOR"],
};