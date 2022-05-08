const {MessageEmbed}= require('discord.js');
const { enCours } = require('../../util/couleurs');

module.exports.run = async (settings, client, message, args, command) => {
    var member = message.mentions.members.last()
    if(!member || member.user.id === client.user.id) member = message.guild.members.cache.get(args[0])
    if(!member || member.user.id === client.user.id) return message.reply('membre introuvable')
    if(!member.manageable) return message.reply('je ne peux pas unmute ce membre')
    let muteRole = message.guild.roles.cache.find(r => r.name === 'muted');

    if(!member.roles.cache.has(muteRole.id)) return message.reply("cet utilisateur n'est pas mute");
    member.roles.remove(muteRole.id)
    message.channel.send(`<@${member.id}> peut a nouveau parler.`)

    const embed = new MessageEmbed()
    .setAuthor(`${member.user.username} (${member.id})`, member.user.avatarURL())
    .setColor(enCours)
    .setDescription(`**Action :** unmute`)
    .setFooter(`par ${message.author.username}`, message.author.avatarURL())
    .setTimestamp();
	const log = client.channels.cache.get(settings.log.channel)
    if(log) log.send({embeds: [embed]})
};

module.exports.help = {
    vanish: true,
    group: 'moderation',
    name: "unmute",
    aliases: ['unmute'],
    description: "Unmute un utilisateur",
    bug: false,
    precisions: '',
    requireArgs: true,
    argsRequiered: "<@user>",
    exemple: '@PommeD\'API#7749',
    permissions: ['MANAGE_MESSAGES'],
    permissionsBot: ["MANAGE_MESSAGES", "SEND_MESSAGES", "MANAGE_ROLES"],
};