module.exports.run = async (settings, client, message, args, command) => {
    if(message.author.id !== '539510339713105950') return message.reply('cette commande est réservée a \`PommeDAPI#7749\`')
    const user = message.mentions.users.first();
    const userToUpdate = await client.getUser(user)
    const verif = userToUpdate.staffBot
    if(user) {
        if(!verif) {
            client.updateUser(user, {staffBot: true})
            message.react('✅')
        } else message.reply(`${user.username} est déja membre du staff à mes yeux`)
    } else {
        message.channel.send(`Cet utilisateur n'existe pas`);
    }
};

module.exports.help = {
    group: 'reservedevs',
    name: "addstaff",
    aliases: ["addstaff"],
    description: "Modifie la db de l'utilisateur mentionné",
    bug: false,
    precisions: '',
    requireArgs: true,
    argsRequiered: '<user>',
    permissions: [],
    permissionsBot: ["ADD_REACTIONS"],
};