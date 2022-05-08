const { MessageEmbed } = require("discord.js");
const { invisible } = require("../../util/couleurs");

module.exports.run = async (settings, client, message, args, command) => {
    if(!args[0]) {
        const em = new MessageEmbed()
        .setTitle('Messages de bienvenue')
        .setColor(invisible)
        const ch = await message.guild.channels.cache.get(settings.welcome.channel)
        if(settings.welcome.enabled && ch) {
            em.setDescription(`Statut : \`Activé\`\nSalon : ${ch}\nMessage : \`${settings.welcome.message ? settings.welcome.message : 'désactivé'}\`\nImage : \`${settings.welcome.image ? 'activée' : 'désactivée'}\``)
        } else em.setDescription(`Statut : \`Désactivés\``)
        return message.channel.send({embeds: [em]})
    }
    if(args[0].toLowerCase() === 'channel') {
        if(!settings.welcome.enabled) return message.reply("les messages de bienvenue sont désactivés sur le serveur")
        client.wlcmChannel(message, settings)
    } else if(args[0].toLowerCase() === 'message') {
        if(!settings.welcome.enabled) return message.reply("les messages de bienvenue sont désactivés sur le serveur")
        client.wlcmMessage(message, settings)
    } else if(args[0].toLowerCase() === 'image') {
        if(!settings.welcome.enabled) return message.reply("les messages de bienvenue sont désactivés sur le serveur")
        if(args[1].toLowerCase() === 'on') {
            if(settings.welcome.image) return message.reply("les images de bienvenue sont deja activées sur le serveur")
            var sett = settings.welcome
            sett.image = true
            await client.updateGuild(message.guild, {welcome: sett})
            message.reply('images de bienvenue activées')
        } else if(args[1].toLowerCase() === 'off') {
            if(!settings.welcome.image) return message.reply("les images de bienvenue sont deja désactivées sur le serveur")
            var sett = settings.welcome
            sett.image = false
            await client.updateGuild(message.guild, {welcome: sett})
            message.reply('images de bienvenue désactivées')
        } else {
            const help =  await client.sendHelpCmd(command, settings, message)
            message.reply('argument invalide, voici un message d\'aide :', help).then(msg => msg.delete({timeout: 5000}))
        }
    } else if(args[0].toLowerCase() === 'messageinembed') {
        if(!settings.welcome.enabled) return message.reply("les messages de bienvenue sont désactivés sur le serveur")
        if(args[1].toLowerCase() === 'on') {
            if(settings.welcome.messagein) return message.reply("les messages de bienvenue sont deja dans l'embed sur ce serveur")
            var sett = settings.welcome
            sett.messagein = true
            await client.updateGuild(message.guild, {welcome: sett})
            message.reply('les messages de bienvenue apparaissent maintenant dans un embed')
        } else if(args[1].toLowerCase() === 'off') {
            if(!settings.welcome.messagein) return message.reply("les messages de bienvenue sont déjà en dehors de l'embed sur ce serveur")
            var sett = settings.welcome
            sett.messagein = false
            await client.updateGuild(message.guild, {welcome: sett})
            message.reply('les messages de bienvenue n\'apparaissent plus dans un embed')
        } else {
            const help =  await client.sendHelpCmd(command, settings, message)
            message.reply('argument invalide, voici un message d\'aide :', help).then(msg => msg.delete({timeout: 5000}))
        }
    } else if(args[0].toLowerCase() === 'enable') {
        if(settings.welcome.enabled) return message.reply("les messages de bienvenue sont deja activés sur le serveur")
        client.wlcmEnable(message, settings)
    } else if(args[0].toLowerCase() === 'disable') {
        if(!settings.welcome.enabled) return message.reply("les messages de bienvenue sont deja desactivés sur le serveur")
        await client.updateGuild(message.guild, {welcome: {enabled: false, message: '', channel: ''}})
        message.reply('messages de bienvenue désactivés')
    } else {
        const help =  await client.sendHelpCmd(command, settings, message)
        message.reply('argument invalide, voici un message d\'aide :', help).then(msg => msg.delete({timeout: 5000}))
    }
};

module.exports.help = {
    vanish: true,
    group: 'configuration',
    name: "welcome",
    aliases: ["welcome", "wlcm"],
    description: "Modifile message de bienvenue sur le serveur",
    bug: false,
    precisions: '',
    requireArgs: false,
    exemple: 'image on',
    argsRequiered: '(channel/message/messageinembed/image/enable/disable) (si image ou message ou messageinembed : <on/off>)',
    permissions: ['MANAGE_GUILD'],
    permissionsBot: ["ADMINISTRATOR"],
};