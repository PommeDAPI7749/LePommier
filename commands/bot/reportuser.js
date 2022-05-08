const { enCours, validColor } = require("../../util/couleurs")
const { MessageEmbed } = require('discord.js')

module.exports.run = async (settings, client, message, args, command) => {
    const pom = client.users.cache.get('539510339713105950')
    const valid = new MessageEmbed()
    .setTitle("Report d'un utilisateur")
    .setColor(validColor)
    .setDescription(`Merci pour ton aide ${message.author.username} ! \nJe vais peut être te contacter en MP ou rejoindre ce serveur si j'ai besoin de précisions ;)`) 
    .setTimestamp()
    .setFooter(`PommeD'API#7749`)
    const reportch = client.channels.cache.get("835102331040956416")
    var user = message.mentions.users.first()
    if(!user) user = await client.users.cache.get(args[0])
    var invitation = await message.guild.fetchInvites().then(invites => invites.find(invite => invite.expiresAt === null))
    if(invitation) invitation = `https://discord.gg/${invitation}`
    if(user) {
        const jber = new MessageEmbed()
        .setTitle("Report")
        .setColor(enCours)
        .setDescription(`Vous avez 60 secondes pour envoyer un message qui décrit **brièvement** le comportement de l'utilisateur`)
        const filter1 = msg => msg.author.id === message.author.id;
        message.channel.send({embeds: [jber]}).then(msg => {
            message.channel.awaitMessages(filter1, { max: 1, time: 60000 }).then(async collected => {
                if(collected.size >= 1) {
                    const m = collected.find(m => m.author === message.author)
                    const embed = new MessageEmbed()
                    .setAuthor(`${user.tag} (${user.id})`, user.displayAvatarURL())
                    .setTitle("Report d'un utilisateur")
                    .setColor("#2f3136")
                    .setDescription(m.content) 
                    .setTimestamp()
                    .setFooter(`Utilisateur report par ${message.author.tag}`)
                    if(invitation) embed.setURL(invitation)
                    m.delete()
                    msg.delete()
                    message.channel.send({content : 'Cet embed va etre envoyé a PommeD\'API#7749 êtes vous satisfait ?', embeds: [embed]}).then(confirm => {
                        const filter1 = msg => msg.author.id === message.author.id && (msg.content.toLowerCase() === 'oui' || msg.content.toLowerCase() === 'non');
                        message.channel.awaitMessages(filter1, { max: 1, time: 60000 }).then(async collected => {
                            if(collected.size >= 1) {
                                const annulation = collected.find(m => m.content.toLowerCase() === 'non')
                                if(!annulation) {
                                    const m = collected.find(m => m.content.toLowerCase() !== 'non')
                                    reportch.send({content : `${pom}`, embeds: [embed]})
                                    message.reply(valid).then(msg => msg.delete({timeout: 5000}))
                                    m.delete()
                                    confirm.delete()
                                } else {
                                    message.reply('report annulé avec succès')
                                    annulation.delete()
                                    confirm.delete()
                                }
                            } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
                        });
                    });
                } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
            });
        });
    } else message.reply('utilisateur introuvable (il doit être ou avoir été dans le même serveur que moi en même temps que moi)').then(msg => msg.delete({timeout: 5000}))
    
}

module.exports.help = {
    vanish: true,
    group: 'bot',
    name: "reportuser",
    aliases: ["reportuser"],
    description: "Permet de signaler un utilisateur qui mértierai d'être blacklisté selon vous, au développeur",
    bug: false,
    precisions: '',
    requireArgs: true,
    argsRequiered: '<bug_repéré>',
    exemple: '@PommeD\'API#7749',
    permissions: [],
    permissionsBot: ["SEND_MESSAGES"],
};