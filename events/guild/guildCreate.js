const { MessageEmbed } = require("discord.js");
const { invisible } = require("../../util/couleurs");

module.exports = async(client, guild) => {
    const em = new MessageEmbed()
    .setColor(invisible)
    .setAuthor(`Owner : ${guild.owner.user.tag}`, guild.owner.user.displayAvatarURL())
    .setTitle('NOUVEAU SERVEUR REJOINT !')
    .setDescription(`Je viens d'être ajouté au serveur ${guild.name} (${guild.memberCount} membres)`)
    .setFooter(`Je suis maintenant sur ${client.guilds.cache.size} serveurs`)
    await client.createGuild({
        guildID: guild.id,
        guildName: guild.name,
    })
    const ch = await client.guilds.cache.get('750357695932006492').channels.cache.get('827516069253480498')
    if(ch) ch.send({embeds: [em]})
};