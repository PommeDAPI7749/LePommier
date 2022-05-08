const {MessageEmbed} = require('discord.js');
const {defaultColor} = require('../../util/couleurs')

async function getCmds(cmds, cate) {
    return cmds.filter(cat => cat.help.group === cate)
}

module.exports.run = async (settings, client, message, args, command) => {
    var cmds = [];
    if(message.author.id === message.guild.owner.user.id || message.member.permissions.has("ADMINISTRATOR")) {
        cmds = client.commands
    } else {
        await client.commands.map(async cmd => {
            if(cmd.help.permissions[0]) {
                var verif = true
                for(perms of cmd.help.permissions) {
                    if(!message.member.permissions.has(perms)) verif = false;
                }
                if(verif) cmds.push(cmd)
            } else cmds.push(cmd)
            
        });
    }
    if(!args[0]) {        
        const embed = new MessageEmbed()
        .setColor(defaultColor)
        .setAuthor(`${message.member.nickname ? message.member.nickname : message.author.username}`, message.author.displayAvatarURL())
        .setTitle("Message d'aide")
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(`Pour avoir des informations sur une commande en particulier tappez : \`${settings.prefix}help <nomDeLaCommmande>\``)
        var cm = []
        cm = await getCmds(cmds, "bot")
        if(cm.length != 0) embed.addField(
            `\\🤖 | BOT`,
            `\`${cm.map(cmd => cmd.help.name).join('\`, \`')}\`\n`
        )
        cm = await getCmds(cmds, "administration")
        if(cm.length != 0) embed.addField(
            `\\👔 | Administration du serveur `,
            `\`${cm.map(cmd => cmd.help.name).join('\`, \`')}\`\n`
        )
        cm = await getCmds(cmds, "moderation")
        if(cm.length != 0) embed.addField(
            `\\👮 | Modération `,
            `\`${cm.map(cmd => cmd.help.name).join('\`, \`')}\`\n`
        )
        cm = await getCmds(cmds, "securite")
        if(cm.length != 0) embed.addField(
            `\\🛡️ | Sécurité`,
            `\`${cm.map(cmd => cmd.help.name).join('\`, \`')}\`\n`
        )
        cm = await getCmds(cmds, "configuration")
        if(cm.length != 0) embed.addField(
            `\\💻 | Configuration`,
            `\`${cm.map(cmd => cmd.help.name).join('\`, \`')}\`\n`
        )
        cm = await getCmds(cmds, "info")
        if(cm.length != 0) embed.addField(
            `\\🕵️ | Informations`,
            `\`${cm.map(cmd => cmd.help.name).join('\`, \`')}\`\n`
        )
        cm = await getCmds(cmds, "rrsystem")
        if(cm.length != 0) embed.addField(
            `\\🛒 | Système de reaction rôle`,
            `\`${cm.map(cmd => cmd.help.name).join('\`, \`')}\`\n`
        )
        cm = await getCmds(cmds, "ticketsystem")
        if(cm.length != 0) embed.addField(
            `\\🎫 | Système de tickets`,
            `\`${cm.map(cmd => cmd.help.name).join('\`, \`')}\`\n`
        )
        cm = await getCmds(cmds, "rulessystem")
        if(cm.length != 0) embed.addField(
            `\\📜 | Système de règlement`,
            `\`${cm.map(cmd => cmd.help.name).join('\`, \`')}\`\n`
        )
        cm = await getCmds(cmds, "leveling")
        if(cm.length != 0) embed.addField(
            `\\🔼 | Système de niveaux`,
            `\`${cm.map(cmd => cmd.help.name).join('\`, \`')}\`\n`
        )
        cm = await getCmds(cmds, "divers")
        if(cm.length != 0) embed.addField(
            `\\📦 | Divers`,
            `\`${cm.map(cmd => cmd.help.name).join('\`, \`')}\`\n`
        )
        .setFooter(`${client.user.username} by PommeD'API#7749`)
        .setTimestamp();

        
        message.channel.send({embeds: [embed]})
        } else {
        const command = cmds.find(cmd => cmd.name === args[0] || (cmd.help.aliases && cmd.help.aliases.includes(args[0])));
        if(!command) return message.reply("Cette commande n'existe pas ou vous n'y avez pas accès !");
        message.channel.send(client.sendHelpCmd(command, settings, message))
    }
};

module.exports.help = {
    group: 'bot',
    name: "help",
    aliases: ['help'],
    description: "Renvoi un message d'aide",
    bug: false,
    precisions: '',
    requireArgs: false,
    argsRequiered: '(commandName)',
    permissions: [],
    permissionsBot: ["SEND_MESSAGES"],
};