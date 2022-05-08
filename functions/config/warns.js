const { MessageEmbed } = require("discord.js")
const member = require("../../models/member")
const { invisible } = require("../../util/couleurs")

module.exports = client => {
    client.getWarnToRemove = async (message, member) => {
        const embed = new MessageEmbed()
        .setTitle(`Retrait d'un avertissement`)
        .setColor(invisible)
        .setDescription(`Veuillez envoyer le numéro de l'avertissement à retirer\n**Coup de pouce :** Vous pouvez trouver les avertissement de l'utilisateur dans le bon ordre grace a la commande \`warndetails\``)
        .setFooter(`envoyez "ANNULER" pour annuler`)
        const filter1 = msg => msg.author.id === message.author.id && (msg.content.toUpperCase() === "MODIFIER" || msg.content.toLowerCase().startsWith(settings.prefix));
        message.channel.send({embeds: [embed]}).then(embed => {
            message.channel.awaitMessages(filter1, { max: 1, time: 60000 }).then(async collected => {
                if(collected.size >= 1) {
                    const tre = collected.find(m => m.content.toUpperCase() != 'MODIFIER')
                    if(tre) return
                    const annulation = collected.find(m => m.content.toUpperCase() === 'ANNULER')
                    if(annulation) {
                        await client.annulation(message)
                        embed.delete()
                        annulation.delete()
                    } else {
                        const tre = collected.find(m => m.content.toUpperCase() !== 'ANNULER')
                        const num = parseInt(tre.content, 10)
                        if(isNaN(num)) {
                            message.reply('veuillez renseigner un nombre')
                            return client.getWarnToRemove(message)
                        }
                        await client.removeWarn(message, member, num)
                        message.reply(`un avertissement a été retiré à ${member.user.tag}`)
                        embed.delete()
                        tre.delete()
                    }
                } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
            })
        })
    }
}