const { MessageEmbed }= require('discord.js');
const moment = require('moment');
const { defaultColor } = require('../../util/couleurs');
const { fra, dev } = require('../../util/emotes')

module.exports.run = (settings, client, message, args, command) => {
    const embed = new MessageEmbed()
        .setColor(defaultColor)
        .setAuthor(`Fiche informative du bot`, client.user.displayAvatarURL())
        .setDescription(`**A savoir :**\n${fra} - Le bot lePommier est un bot rédigé en français et cours de développement.\n${dev} - Son développeur a pour projet de le rendre capable faire le plus de choses possible afin qu'a terme, il puisse réaliser tout ce que vous pourriez attendre d'un bot Discord`)
        .addFields([
            {
                name: '\\🟢 En ligne depuis :',
                value: `${client.tradDate(moment(client.readyAt).format('dddd DD MMMM YYYY'))}`,
                inline: true
            },
            {
                name: '\\🔓 Verion publique :',
                value: `Ouverte le 22 février 2021`,
                inline: true
            },
            {
                name: '\\⚙️ Infos techniques :',
                value: `Discord.js v12.5.3\nNodeJs v15.14.0`,
                inline: true
            },
        ])
        .addFields([
            {
                name: '\\📊 Statistiques :',
                value: `- Serveurs : ${client.guilds.cache.size.toString()}\n- Utilisateurs : ${client.users.cache.size.toString()}`,
                inline: true
            },
            {
                name: '\\🏘️ Hébergement :',
                value: `- Machine : Raspberry Pi 4\n- Connexion : ADSL`,
                inline: true
            },
            {
                name: '\\💻 Mon développeur :',
                value: `PommeD'API#7749 (539510339713105950)`,
                inline: true
            },
        ])
        .addField('\\⚠️ ━━━━━━━━━━━ AVERTISSEMENT ━━━━━━━━━━━ \\⚠️', `Des bugs peuvent survenir, pour les faire connaitre à mon développeur utilisez la commande : \`${settings.prefix}report\``);
    message.channel.send({embeds: [embed]})
};

module.exports.help = {
    group: 'bot',
    name: "botinfo",
    aliases: ["botinfo", "bi"],
    description: "Renvoi des infos sur le bot",
    bug: false,
    precisions: '',
    requireArgs: false,
    argsRequiered: false,
    permissions: [],
    permissionsBot: ["SEND_MESSAGES"],
};