const { MessageEmbed } = require("discord.js");
const {defaultColor} = require('../../util/couleurs');
const { load } = require("../../util/emotes");

module.exports.run = async (settings, client, message, args, command) => {
    message.channel.send(`${load} | Calcul ...`).then(async (m) => {
        const pingBot = await m.createdTimestamp - message.createdTimestamp;
        const embed = new MessageEmbed()
        .setColor(defaultColor)
        .setDescription(`Lantence du bot : ${pingBot} ms`)
        await message.channel.send({embeds: [embed]})
        m.delete()
    })
};

module.exports.help = {
    group: 'bot',
    name: "ping",
    aliases: ["ping", "latency"],
    description: "Renvoi la latence du bot",
    bug: false,
    precisions: '',
    requireArgs: false,
    argsRequiered: '',
    permissions: [],
    permissionsBot: ["SEND_MESSAGES"],
};