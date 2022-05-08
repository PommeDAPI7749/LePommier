const { MessageEmbed } = require("discord.js");
const { enCours } = require("../../util/couleurs");

module.exports.run = async (settings, client, message, args, command) => {
    if(args[0].toLowerCase() === 'ajouter' || args[0].toLowerCase() === 'add') {
        client.getNewAutoSanction(settings, message)
    } else if(args[0].toLowerCase() === 'retirer' || args[0].toLowerCase() === 'remove') {
        client.getAutoSanctionToRemove(settings, message)
    } else if(args[0].toLowerCase() === 'liste' || args[0].toLowerCase() === 'list') {
        const embed = new MessageEmbed()
        .setTitle(`Lise des sanctions automatiques`)
        .setColor(enCours)
        var data = ``
        for(s of settings.secu.sanctions) {
            data += `\n- \`${s.s.s}${s.s.s === 'mute' ? ` (${s.s.t})\` :` : '\` : '} au bout de ${s.n} warns`
        }
        if(data === ``) data = 'Il n\'y a pas de sanctions automatiques actives sur ce serveur'
        embed.setDescription(data)
        message.channel.send({embeds: [embed]})
    } else {
        const help =  await client.sendHelpCmd(command, settings, message)
        message.reply('argument invalide, voici un message d\'aide :', help).then(msg => msg.delete({timeout: 5000}))
    }
};


module.exports.help = {
    vanish: true,
    group: 'configuration',
    name: "autosanction",
    aliases: ["autosanction"],
    description: "Modifie les sanctions automatiques",
    bug: false,
    precisions: '',
    requireArgs: true,
    argsRequiered: '<ajouter/retirer/liste>',
    permissions: ["ADMINISTRATOR"],
    permissionsBot: ["ADMINISTRATOR"],
};