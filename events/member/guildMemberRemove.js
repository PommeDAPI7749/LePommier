// const { loadImage } = require("canvas")
// const { Canvas } = require("canvas-constructor");
const { warningColor, invisible } = require("../../util/couleurs");
const { MessageEmbed, MessageAttachment } = require("discord.js");

module.exports = async (client, member) => {
    const settings = await client.getGuild(member.guild);
    if(settings.lock.enabled) return;
    if(settings.memberCount.enabled) {
        const memberCountCh = member.guild.channels.cache.get(settings.memberCount.channel)
        var name = settings.memberCount.text
        const mc = client.guilds.cache.get(member.guild.id).memberCount
        if(name.includes('{{MC}}')) name = name.replace("{{MC}}", mc)
        if(memberCountCh) memberCountCh.setName(name)
    };
    
    const lCh = client.channels.cache.get(settings.leave.channel)
    if(lCh) {
        const leaveEmbed = new MessageEmbed()
        if(settings.leave.image) {
            const avatar = await member.user.displayAvatarURL({format: 'png'});
            // const can = new Canvas(1500, 350)
            // .setColor(warningColor)
            // .setTextAlign('left')
            // .printCircularImage(await loadImage(avatar), 125, 245, 100)
            // .printRoundedRectangle(10, 5, 675, 80, 80)
            // .setTextFont('60px Corbel')
            // .setColor(invisible)
            // .printText('Bonne continuation', 40, 70)
            // .setColor(warningColor)
            // .setTextFont('133px Corbel')
            // .printText(member.user.username, 250, 295)
            // .toBuffer()
            // const attach = new MessageAttachment(can, 'bvn.png')
            // leaveEmbed.attachFiles(attach)
            // leaveEmbed.setColor(warningColor)
            // leaveEmbed.setImage(`attachment://bvn.png`)
            leaveEmbed.setFooter(`Nous ne sommes plus que ${member.guild.memberCount}`)
            leaveEmbed.setTimestamp();
        }
        var msg = settings.leave.message;
        if(msg) {
            if(msg.includes('{{userTag}}')) msg = msg.replace("{{userTag}}", member.user.tag)
            if(msg.includes('{{userName}}')) msg = msg.replace("{{userName}}", member.user.username)
            if(msg.includes('{{MC}}')) msg = msg.replace("{{MC}}", member.guild.memberCount)
            if(msg.includes('{{guildName}}')) msg = msg.replace("{{guildName}}", member.guild.name)
            if(settings.leave.messagein) {
                leaveEmbed.setDescription(msg)
                if(!settings.leave.image) {
                    leaveEmbed.setFooter(`Nous ne sommes plus que ${member.guild.memberCount}`)
                    leaveEmbed.setColor(warningColor)
                    leaveEmbed.setTimestamp();
                }
                msg = false
            }
        }
        if(msg || leaveEmbed.footer) lCh.send(msg ? msg : '', leaveEmbed.footer ? leaveEmbed : '')
    }

    const logs = client.channels.cache.get(settings.log.channel)
    if(logs) {
        const embed = new MessageEmbed()
        .setColor(warningColor)
        .setAuthor(`${member.user.username} (${member.id})`, member.user.displayAvatarURL())
        .setDescription(`Un membre a quitté le serveur`)
        .setFooter(`${client.user.username} by PommeD'API#7749`)
        .setTimestamp();
        logs.send({embeds: [embed]})
    }
}