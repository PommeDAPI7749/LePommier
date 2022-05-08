const { idrules } = require('../../util/emotes')

module.exports = async (client, reaction, user) => {
    if(user.id === client.user.id) return;
    const message = reaction.message
    
    if(reaction.emoji.id == idrules) {
        const rules = await client.getRules(message.guild)
        if(rules) {
            const member = message.guild.members.cache.get(user.id)
            const role = await message.guild.roles.cache.get(rules.role)
            if(!role) return message.reply('le role relié à ce règlement a été supprimé veuillez contacter le STAFF du serveur').then(m => m.delete({timeout: 5000}))
            member.roles.remove(role)
            user.createDM().then(ch => ch.send(`Vous avez retré votre réaction au règlement du serveur \`${message.guild.name}\`, je vous ai donc retiré le rôle \`${role.name}\``))
        }
    }
}