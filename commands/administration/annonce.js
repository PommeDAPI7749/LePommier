module.exports.run = async (settings, client, message, args, command) => {
    var channelID = ''
    const t = message.mentions.channels.first()
    if(t) {
        channelID = t.id
    } else if(message.guild.channels.cache.get(args[0])) {
        channelID = args[0]
    } else return message.reply(`salon introuvable`)

    client.annonce(channelID, message)
};

module.exports.help = {
    vanish: false,
    group: 'administration',
    name: "annonce",
    aliases: ['annonce'],
    description: "Publie une annonce",
    bug: false,
    precisions: '',
    requireArgs: true,
    argsRequiered: "<#channel>",
    exemple: '#annonces',
    permissions: ['ADMINISTRATOR'],
    permissionsBot: ["ADMINISTRATOR"],
};