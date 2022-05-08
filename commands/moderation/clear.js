const {MessageEmbed}= require('discord.js');
const { defaultColor, validColor, warningColor, enCours } = require('../../util/couleurs');

module.exports.run = async (settings, client, message, args, command) => {
    if(isNaN(args[0]) || (args[0]<1 || args[0]>100)) return message.reply('il faut renseigner un **nombre** entre 1 et 100');
    const msgs = await message.channel.messages.fetch({
        limit: Math.min(args[0], 100),
        before: message.id,
    });

    message.channel.bulkDelete(msgs, true).then(async messages => {
        if(msgs.size !== messages.size) {
            const alert = new MessageEmbed()
            .setAuthor(`Suppression en cours`)
            .setColor(enCours)
            .setDescription(`Certains messages sont vieux de plus de 2 semaines et vont etre supprimés un par un : Cette opération peux prendre du temps`)
            message.channel.send(alert).then(msg => msg.delete({timeout: 5000}))
            await msgs.map(mess4ge => {
                if(!mess4ge.deleted) mess4ge.delete()
            })
            const sfs = new MessageEmbed()
            .setAuthor(`Confirmation de suppression`)
            .setColor(validColor)
            .setDescription(`${msgs.size} messages supprimés.`)
            await message.channel.send({embeds: [sfs]}).then(msg => msg.delete({timeout: 5000}))
            const embed = new MessageEmbed()
            .setAuthor(`${message.author.username}`, message.author.avatarURL())
            .setColor(defaultColor)
            .setDescription(`**Action :** Clear\n**Nombre de messages :** ${msgs.size}\n**Salon :** ${message.channel}`)
            const log = client.channels.cache.get(settings.log.channel)
            if(log) log.send({embeds: [embed]})
        } else {
            const sfs = new MessageEmbed()
            .setAuthor(`Confirmation de suppression`)
            .setColor(validColor)
            .setDescription(`${msgs.size} messages supprimés.`)
            message.channel.send({embeds: [sfs]}).then(msg => msg.delete({timeout: 5000}))
            const embed = new MessageEmbed()
            .setAuthor(`${message.author.username}`, message.author.avatarURL())
            .setColor(defaultColor)
            .setDescription(`**Action :** Clear\n**Nombre de messages :** ${msgs.size}\n**Salon :** ${message.channel}`)
            const log = client.channels.cache.get(settings.log.channel)
            if(log) log.send({embeds: [embed]})
        }
    });

};

module.exports.help = {
    vanish: true,
    group: 'modération',
    name: "clear",
    aliases: ['clear', 'purge'],
    description: "Efface un nombre de messages spécifié (sans effet sur les messages vieux de plus de deux semaines)",
    bug: false,
    precisions: '',
    requireArgs: true,
    argsRequiered: "<nbr_de_msgs",
    exemple: '5',
    permissions: ['MANAGE_MESSAGES'],
    permissionsBot: ["MANAGE_MESSAGES", "SEND_MESSAGES"],
};