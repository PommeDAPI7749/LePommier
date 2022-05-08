const { MessageEmbed } = require("discord.js");
const { invisible } = require('../../util/couleurs')

module.exports.run = (settings, client, message, args, command) => {
    const embed = new MessageEmbed()
    .setColor(invisible)
    .setAuthor("Voici une liste de quelques liens utils :")
    .setDescription(`**Invitez-moi sur votre serveur** en cliquant [ici](${encodeURI('https://discord.com/oauth2/authorize?client_id=762377021983686696&scope=bot&permissions=8')}),\nRejoingez le **serveur support** en cliquant [là](${encodeURI('https://www.discord.gg/w7nGKycyX2')}),\nConsultez ma **page Top.gg** en cliquant [juste là](${encodeURI('https://top.gg/bot/762377021983686696')}),\nEnfin : **votez pour moi** en cliquant sur [ce lien](${encodeURI('https://top.gg/bot/762377021983686696/vote')})`)
    .setFooter(`${client.user.username} by PommeD'API#7749`)
    .setTimestamp()
    message.channel.send({embeds: [embed]})
};

module.exports.help = {
    group: 'bot',
    name: "links",
    alliases: ['links', 'link'],
    description: "Renvoi des liens en rapport avec le bot",
    bug: false,
    precisions: '',
    requireArgs: false,
    permissions: [],
    permissionsBot: ["SEND_MESSAGES"],
};