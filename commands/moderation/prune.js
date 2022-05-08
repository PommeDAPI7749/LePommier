const {MessageEmbed}= require('discord.js');
const { warningColor } = require('../../util/couleurs');

module.exports.run = async (settings, client, message, args, command) => {
    var member = message.mentions.members.last()
    if(!member || member.user.id === client.user.id) member = message.guild.members.cache.get(args[1])
    if(!member || member.user.id === client.user.id) return message.reply('membre introuvable')
    if(isNaN(args[0]) || (args[0]<1 || args[0]>100)) return message.reply('il faut renseigner un **nombre** entre 1 et 100');
    
    const messages = (await message.channel.messages.fetch({
        limit: 100,
        before: message.id,
    })).filter(a => a.author.id === member.id).array();

    messages.length = Math.min(args[0], messages.length);

    if(messages.length === 0 || !member) return message.reply('Aucun messages de cet utilisateur a supprimer (ou cet utilisateur n\'existe pas).')

    if(messages.length === 1) await messages[0].delete();
    else await message.channel.bulkDelete(messages);
    
    message.channel.send(`${args[0]} messages de ${args[1]} ont été supprimés avec succès !`).then(m => m.delete({timeout: 5000}))

    const embed = new MessageEmbed()
        .setAuthor(`${message.author.username}`, message.author.avatarURL())
        .setColor(warningColor)
        .setDescription(`**Action :** Prune\n**Nombre de messages :** ${args[0]}\n**Utilisateur :** ${args[1]}\n**Salon :** ${message.channel}`)
    const log = client.channels.cache.get(settings.log.channel)
    if(log) log.send({embeds: [embed]})


    message.delete();
};

module.exports.help = {
    vanish: true,
    group: 'moderation',
    name: "prune",
    aliases: ['prune'],
    description: "Effece un nombre de messages en provenance d'un utilisateur",
    bug: false,
    precisions: '',
    requireArgs: true,
    argsRequiered: "<nbr_de_msgs> <membre>",
    exemple: '5 @PommeD\'API#7749',
    permissions: ['MANAGE_MESSAGES'],
    permissionsBot: ["MANAGE_MESSAGES", "SEND_MESSAGES"],
};