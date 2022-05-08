const { MessageEmbed } = require("discord.js");
const { invisible } = require("../../util/couleurs");

module.exports = async(client, guild) => {
    const em = new MessageEmbed()
    .setColor(invisible)
    .setAuthor(`Owner : ${guild.owner.user.tag}`, guild.owner.user.displayAvatarURL())
    .setTitle('JE VIENS DE QUITTER UN SERVEUR')
    .setDescription(`Je viens de quitter le serveur ${guild.name} (${guild.memberCount} membres)`)
    .setFooter(`Je ne suis plus que sur ${client.guilds.cache.size} serveurs`)
    await client.deleteGuild(guild)
    const ch = await client.guilds.cache.get('750357695932006492').channels.cache.get('827516069253480498')
    if(ch) ch.send({embeds: [em]})
};