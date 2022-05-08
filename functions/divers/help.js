const { MessageEmbed } = require("discord.js");
const { defaultColor, warningColor } = require("../../util/couleurs");

module.exports = client => {
    client.sendHelpCmd = (command, settings, message) => {
        if(command.help.group !== 'reservedevs') {
            const embed = new MessageEmbed()
            .setColor(defaultColor)
            .setTitle(`Fiche de la commande \`${command.help.name}\``)
            .addFields([
                {
                    name: "\\👀 Utilité", 
                    value: command.help.description ? command.help.description : 'Commandes sans description signalez le à mon développeur',
                    inline: true,
                },
                {
                    name: '\\🤷‍♂️ Utilisation', 
                    value: command.help.argsRequiered ? `\`${settings.prefix}${command.help.name} ${command.help.argsRequiered}\`` : `\`${settings.prefix}${command.help.name}\``,
                    inline: true,
                },
                {
                    name: '\\✨ Exemple', 
                    value: command.help.exemple ? `\`${settings.prefix}${command.help.name} ${command.help.exemple}\`` : `\`${settings.prefix}${command.help.name}\``,
                    inline: true,
                },
            ])
            .addFields([
                {
                    name: '\\🤚 Permissions utilisateur requises',
                    value: command.help.permissions[0] ? `\`${command.help.permissions.join(`\`, \``)}\`` : `Commande accessible à tous`,
                    inline: true
                },
                {
                    name: '\\🤖 Permissions bot requises',
                    value: command.help.permissionsBot ? command.help.permissionsBot[0] ? `\`${command.help.permissionsBot.join(`\`, \``)}\`` : `Le bot n'a besoin d'aucune permission pour cette commande` : `Le bot n'a besoin d'aucune permission pour cette commande`,
                    inline: true
                },
                {
                    name: "\\📞 Aliases",
                    value: command.help.aliases ? `\`${command.help.aliases.join('\`, \`')}\`` : command.help.name,
                    inline: true
                },
            ])
            if(command.help.bug) embed.addField("\\⚠️ Cette commande n'est pas utilisable \\⚠️", command.help.precisions ? `Précisions : ${command.help.precisions}` : '\u200b', false);
            return embed;
        } else {
            const em = new MessageEmbed()
            .setColor(warningColor)
            .setTitle(`Fiche de la commande \`${command.help.name}\``)
            .setDescription("Cette commande est réservée à \`PommeD'API#7749\` je ne peux pas divulguer d'informations en rapport avec cette dernère")
            return em
        }
    } 
}