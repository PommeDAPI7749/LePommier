const {MessageEmbed}= require('discord.js')
const ms = require('ms')

module.exports.run = async (settings, client, message, args, command) => {
    var member = message.mentions.members.last()
    if(!member || member.user.id === client.user.id) member = message.guild.members.cache.get(args[0])
    if(!member || member.user.id === client.user.id) return message.reply('membre introuvable')
    if(!member.manageable) return message.reply('je ne peux pas mute ce membre')
    let muteRole = message.guild.roles.cache.find(r => r.name === 'muted');
    let muteTime = (args[1] || "60m" );

    if(!muteRole) {
        muteRole = await message.guild.roles.create({
            data: {
                name: 'muted',
                color: '#000',
                permission: []
            }
        })
        message.guild.channels.cache.forEach(async (channel, id) => {
            await channel.updateOverwrite(muteRole, {
                SEND_MESSAGES: false,
                ADD_REACTIONS: false,
                CONNECT: false
            })
        });
    }

    await member.roles.add(muteRole.id)
    message.channel.send(`<@${member.id}> est reduit au silence pour ${ms(ms(muteTime))}.`)

    setTimeout(() => {
        message.channel.send(`<@${member.id}> peut à nouveau parler`)
        member.roles.remove(muteRole.id);
    }, ms(muteTime))

    const embed = new MessageEmbed()
    .setAuthor(`${member.user.username} (${member.id})`, member.user.avatarURL())
    .setColor('#ffa500')
    .setDescription(`**Action :** mute \n**Temps :** ${muteTime}`)
    .setFooter(`par ${message.author.username}`, message.author.avatarURL())
    .setTimestamp();

    	const log = client.channels.cache.get(settings.log.channel)
    if(log) log.send({embeds: [embed]})

};

module.exports.help = {
    vanish: true,
    group: 'moderation',
    name: "mute",
    aliases: ['mute'],
    description: "Mute un utilisateur (Le membre peut parfois parler si un autre role est mal configuré)",
    bug: false,
    precisions: '',
    requireArgs: true,
    argsRequiered: "<@user> <temps>",
    exemple: "@PommeD\'API#7749 2m",
    permissions: ['MANAGE_MESSAGES'],
    permissionsBot: ["MANAGE_MESSAGES", "SEND_MESSAGES", "MANAGE_ROLES"],
};