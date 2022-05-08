module.exports.run = async (settings, client, message, args, command) => {
    client.autorole(message, settings)
};

module.exports.help = {
    vanish: true,
    group: 'administration',
    name: "autorole",
    aliases: ["autorole", "configautorole"],
    description: "Modifile le role a donner aux nouveaux arrivants",
    bug: false,
    precisions: '',
    requireArgs: false,
    argsRequiered: '',
    permissions: ["ADMINISTRATOR"],
    permissionsBot: ["ADMINISTRATOR"],
};