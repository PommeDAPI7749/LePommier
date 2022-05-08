module.exports.run = async (settings, client, message, args, command) => {
    const userDB = await client.getUser(message.author)
    const verif = userDB.staffBot
    if((verif === false) || (!verif)) return message.reply('cette commande est réservée au staff du bot')
    var aBannir = await message.mentions.users.first()
    if(!aBannir) {
        if(client.users.cache.get(args[0])) {
            aBannir = await client.users.cache.get(args[0]);
        } else return message.reply('Utilisateur introuvable')
    } 
    const aBannirDB = await client.getUser(aBannir)
    if(aBannirDB.blacklisted) {
        message.reply(`${aBannir.tag} est déja dans la Blacklist`)
    } else if(aBannirDB.userID === aBannir.id) {
        await client.updateUser(aBannir, {blacklisted : true})
        message.reply(`${aBannir.tag} a été ajouté à la Blacklist`)
    } else return message.reply('cet utilisateur n\'a pas de carte dans la DB')
  };

module.exports.help = {
    group: 'reservedevs',
    name: "blacklist",
    aliases: ['blacklist', 'gban'],
    description: "Ajoute l'utilisateur a la blacklist",
    bug: false,
    precisions: '',
    requireArgs: true,
    argsRequiered: "<@user>",
    permissions: [],
    permissionsBot: ["ADD_REACTIONS"],
};