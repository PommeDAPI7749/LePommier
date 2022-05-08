module.exports.run = async (settings, client, message, args, command) => {
    if(!settings.leveling.enabled) return message.reply("le leveling est désactivé sur le serveur")
    if(args[0] === '+') {
        client.addReward(message, args, settings)
    } else if(args[0] === '-') {
        client.removeReward(message, args, settings)
    } else {
        const list = settings.leveling.rewards
        const em = new MessageEmbed()
        .setColor(invisible)
        .setFooter(`pour ajouter/supprimer des rewards \`${settings.prefix}levelrewards <+/->\``)
        if(!list[0]) {
          em.setDescription("Il n'y a pas de rôle à gagner sur ce serveur")
        } else {
            em.setTitle(`Voici la liste des rôles que vous pouvez gagner grâce au leveling :`)
            await list.sort(function (a, b) {
                return b.l - a.l;
            });
            var description = ""
            for (role of list) {
                const r = await message.guild.roles.cache.get(role.r)
                description += `\n- Niveau ${role.l} : ${r}`
            }
            await em.setDescription(description)
        }
        message.channel.send({embeds: [em]})   
    }
};

module.exports.help = {
    group: 'leveling',
    name: "levelrewards",
    aliases: ["levelrewards"],
    description: "Ajoute / retire un rôle a gagner grace au leveling",
    bug: false,
    precisions: '',
    requireArgs: false,
    argsRequiered: '(+/-) (niveau) (role)',
    permissions: ["ADMINISTRATOR"],
    permissionsBot: ["ADMINISTRATOR"],
};