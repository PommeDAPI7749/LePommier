module.exports.run = async (settings, client, message, args, command) => {
    client.memberCount(message, settings)
};

module.exports.help = {
    group: 'configuration',
    name: "membercount",
    aliases: ["membercount"],
    description: "Modifie le compteur de membres",
    bug: false,
    precisions: '',
    requireArgs: false,
    argsRequiered: '',
    permissionsBot: ["ADMINISTRATOR"],
    permissions: ["ADMINISTRATOR"],
};