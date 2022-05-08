module.exports.run = (settings, client, message, args, command) => {
    message.channel.send(args.join(" "));
};

module.exports.help = {
    vanish: true,
    group: 'divers',
    name: "say",
    aliases: ["say", "repeat"],
    description: "Répete un message",
    bug: false,
    precisions: '',
    requireArgs: true,
    argsRequiered: '<message>',
    exemple: 'lePommier c\'est le meilleur bot',
    permissions: ['MANAGE_MESSAGES'],
    permissionsBot: ["MANAGE_MESSAGES", "SEND_MESSAGES"],
};