const { MessageEmbed } = require("discord.js");
const { invisible } = require("../../util/couleurs");

module.exports.run = async (settings, client, message, args, command) => {
    if(!args[0]) {
        const em = new MessageEmbed()
        .setTitle('Logs')
        .setColor(invisible)
        const ch = await message.guild.channels.cache.get(settings.log.channel)
        if(settings.log.enabled && ch) {
            em.setDescription(`Statut : \`Activé\`\nSalon : ${ch}`)
        } else em.setDescription(`Statut : \`Désactivés\``)
        return message.channel.send({embeds: [em]})
    }
    if(args[0].toLowerCase() === 'channel') {
        if(!settings.log.enabled) return message.reply("les logs sont desactivés sur le serveur")
        client.logChannel(message, settings)
    } else if(args[0].toLowerCase() === 'enable') {
        if(settings.log.enabled) return message.reply("les logs sont déjà activés sur le serveur")
        await client.updateGuild(message.guild, {log: {enabled: true, channel: ''}})
        message.reply('logs activés').then(m => m.delete({timeout: 5000}))
        client.modifLogChannel(message, settings)
    } else if(args[0].toLowerCase() === 'disable') {
        if(!settings.log.enabled) return message.reply("les logs sont déja desactivés sur le serveur")
        await client.updateGuild(message.guild, {log: {enabled: false, channel: ''}})
        message.reply('logs désactivés').then(m => m.delete({timeout: 5000}))
    } else {
        const help =  await client.sendHelpCmd(command, settings, message)
        message.reply('argument invalide, voici un message d\'aide :', help).then(msg => msg.delete({timeout: 5000}))
    }
};

module.exports.help = {
    vanish: true,
    group: 'configuration',
    name: "log",
    aliases: ["log", "logs"],
    description: "Modifie le système de logs sur le serveur",
    bug: false,
    precisions: '',
    requireArgs: false,
    exemple: 'disable',
    argsRequiered: '(channel/enable/disable)',
    permissions: ['MANAGE_GUILD'],
    permissionsBot: ["ADMINISTRATOR"],
};