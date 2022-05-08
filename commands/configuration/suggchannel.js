module.exports.run = async (settings, client, message, args, command) => {
    client.suggChannel(message,settings)
};

module.exports.help = {
    group: 'configuration',
    name: "suggchannel",
    aliases: ["suggchannel"],
    description: "Modifile salon dans lequel les suggestions des membres sont envoyées sur le serveur",
    bug: false,
    precisions: '',
    requireArgs: false,
    argsRequiered: '',
    permissions: ['MANAGE_GUILD'],
    permissionsBot: ["ADMINISTRATOR"],
};