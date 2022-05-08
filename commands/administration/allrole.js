const {MessageEmbed}= require('discord.js');
const { enCours } = require('../../util/couleurs');

module.exports.run = async (settings, client, message, args, command) => {
    if(args[0] !== "+" && args[0] !== "-") return
    const clientMember = await message.guild.members.cache.get(client.user.id)
    var role = message.mentions.roles.first()
    if(!role) role = await message.guild.cache.get(args[1])
    if(!role) return message.reply('Role introuvable').then(m => m.delete({timeout: 5000}))
    if(role.permissions.has('MANAGE_MESSAGES' || 'MANAGE_CHANNELS' || 'MANAGE_GUILD')) return message.reply('Vous ne pouvez pas ajouter un role ayant des permissions à l\'aide de cette commande').then(m => m.delete({timeout: 5000}))
    if((message.member.roles.highest.position < role.position || message.member.roles.highest.position == role.position) && message.author.id !== message.guild.owner.user.id) return message.reply('Ce rôle est plus prestigieux que les votres, vous ne pouvez pas l\'ajouter aux autres membres').then(m => m.delete({timeout: 5000}))
    if(clientMember.roles.highest.position < role.position || clientMember.roles.highest.position == role.position) return message.reply('Ce rôle est plus prestigieux que les miens, je ne peux pas l\'attribuer').then(m => m.delete({timeout: 5000}))
    const embed = new MessageEmbed()
    .setAuthor(`Vous êtes sur le point ${args[0] === "+" ? 'd\'ajouter' : 'de retirer'} le rôle ${role.name} à tous les membres du serveur...`)
    .setColor(enCours)
    .setDescription(`Êtes vous sur de vouloir le faire ?`)
    message.channel.send({embeds: [embed]}).then(embed => {
        const filter1 = msg => msg.author.id === message.author.id && (msg.content.toUpperCase() === 'OUI' || msg.content.toUpperCase() === 'NON')
        message.channel.awaitMessages(filter1, { max: 1, time: 60000 }).then(async collected => {
            if(collected.size >= 1) {
                const annulation = collected.find(m => m.content.toUpperCase() === 'NON')
                if(annulation) {
                    await client.annulation(message)
                    embed.delete()
                    annulation.delete()
                } else {
                    message.reply(`je retire le rôle \`${role.name}\` aux ${message.guild.memberCount} membres du serveur, cette opération peut prendre du temps ... Vous serez informés lorsque la manipulation sera achevée`).then(m => m.delete({timeout: 5000}))
                    const tre = collected.find(m => m.content.toUpperCase() !== 'NON')
                    tre.delete()
                    embed.delete()
                    await message.guild.members.cache.map(member => {
                        if(args[0] === "+") {
                            member.roles.add(role)
                        } else {
                            member.roles.remove(role)
                        }
                    })
                    message.reply(`rôles ${args[0] === '+' ? 'ajoutés' : 'retirés'}`).then(m => m.delete({timeout: 60000}))
                }
            
            } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
        })
    })
};
        
module.exports.help = {
    vanish: true,
    group: 'administration',
    name: "allrole",
    aliases: ['allrole'],
    description: "Ajoute/retire un role à tous les membres",
    bug: false,
    precisions: '',
    requireArgs: true,
    argsRequiered: "<+/-> <role>",
    exemple: '+ @membre',
    permissions: ['MANAGE_ROLES'],
    permissionsBot: ["MANAGE_ROLES", "SEND_MESSAGES"],
};