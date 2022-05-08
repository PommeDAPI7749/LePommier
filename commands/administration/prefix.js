module.exports.run = async (settings, client, message, args, command) => {
    if(args[0]) {
        await client.updateGuild(message.guild, {prefix: args[0].toLowerCase()});
        return message.channel.send(`Prefix mis a jour: \`${settings.prefix}\` -> \`${args[0].toLowerCase()}\``)
    } else {
        message.channel.send(`Prefix actuel: \`${settings.prefix}\`\nPour modifier : \`${settings.prefix}prefix (nouveau_prefix)\``)
    }
};

module.exports.help = {
    group: 'administration',
    name: "prefix",
    aliases: ["prefix"],
    description: "Modifie le prefix sur le serveur",
    bug: false,
    precisions: '',
    requireArgs: false,
    argsRequiered: '(nouveau_prefix)',
    exemple: '!',
    permissions: ['MANAGE_GUILD'],
    permissionsBot: ["SEND_MESSAGES"],
};