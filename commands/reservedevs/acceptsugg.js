const { MessageEmbed } = require("discord.js");
const { validColor } = require("../../util/couleurs");

module.exports.run = async (settings, client, message, args, command) => {
    if(message.author.id !== '539510339713105950') return message.reply('cette commande est réservée a \`PommeDAPI#7749\`')
    const data =  await client.getSuggestion(args[0]);
    if(data) {
        await client.guilds.cache.get('750357695932006492').channels.cache.get('750357696632324140').messages.fetch(args[0]).then(msg => {
            const em = new MessageEmbed()
            .setTitle('SUGGESTION ACCEPTEE')
            .setColor(validColor)
            .setDescription(data.content)
            .setFooter(`Proposé par : ${data.user}`)
            if(args[1]) em.addField("Précisions du développeur :", args.splice(1).join(' '))
            msg.edit(em)
            msg.reactions.removeAll()
            client.acceptSugg(msg.id, {acceptStatus: true})
            return message.react('✅')
        }).catch(console.error);
    } else {
        message.channel.send(`Cet id ne corresponds pas a une suggestion votable`);
    }
};

module.exports.help = {
    group: 'reservedevs',
    name: "acceptsugg",
    aliases: ["acceptsugg"],
    description: "Accepte une suggestion",
    bug: false,
    precisions: '',
    requireArgs: true,
    argsRequiered: '<sugg> (precisions)',
    permissions: [],
    permissionsBot: ["MANAGE_MESSAGES", "SEND_MESSAGES"],
};