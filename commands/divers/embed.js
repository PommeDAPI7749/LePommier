const { MessageEmbed }= require('discord.js');
const { invisible } = require('../../util/couleurs');

async function Coll(embed, message, setting, maxSize) {
    const filter = m => message.author.id === m.author.id
    const footSett = setting.split(/ +/)
    var ret = ''
    const em = new MessageEmbed()
    .setDescription(`Veuillez envoyer ${setting} de l'embed`)
    .setColor(invisible)
    .setFooter(`Pour créer un embed sans ${footSett[footSett.length - 1]} envoyez "SANS"`)
    await message.channel.send({embeds: [em]}).then(async msg => {
        await message.channel.awaitMessages(filter, { max: 1, time: 60000 }).then(async collected => {
            if(collected.size >= 1) {
                const annulation = await collected.find(m => m.content.toUpperCase() === 'ANNULER')
                const tre = await collected.find(m => m.content.toUpperCase() !== 'ANNULER')
                if(annulation) {
                    annulation.delete()
                    msg.delete()
                    message.reply('Action annulée avec succès').then(msg => msg.delete({timeout: 5000}));
                    ret = 'cancel';
                } else if(tre.content.toUpperCase() === "SANS") {
                    tre.delete();
                    msg.delete();
                    ret = false;
                } else {
                    tre.delete();
                    msg.delete();
                    if(maxSize){
                        if(tre.content.length > maxSize) {
                            message.reply(`Pour ce champ de l'embed vous êtes limité à ${maxSize} caractères`).then(m => m.delete({timeout: 5000}))
                            if(footSett[footSett.length - 1] !== 'field') return Coll(embed, message, setting, maxSize)
                        };
                    };
                    if(footSett[footSett.length - 1] === 'author') return embed.setAuthor(tre.content)
                    if(footSett[footSett.length - 1] === 'titre') return embed.setTitle(tre.content)
                    if(footSett[footSett.length - 1] === 'description') return embed.setDescription(tre.content)
                    if(footSett[footSett.length - 1] === 'couleur') return embed.setColor(tre.content)
                    if(footSett[footSett.length - 1] === 'footer') return embed.setFooter(tre.content)
                    if(footSett[footSett.length - 1] === 'field') ret = tre.content
                }
            } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
        });
    });
    return ret
}
async function addFiel(message, embed) {
    var fieldName = await Coll(embed, message, "le titre du field", 256)
    if(fieldName) {
        while(fieldName.length > 256) {
            fieldName = await Coll(embed, message, "le titre du field", 256)
        };
        if(fieldName === 'cancel') return
        var fieldValue = await Coll(embed, message, "le contenu du field", 1024)
        if(fieldValue) {
            while(fieldValue.length > 1024) {
                fieldValue = await Coll(embed, message, "le contenu du field", 1024)
            };
            if(fieldValue === 'cancel') return
            await embed.addField(fieldName, fieldValue, true)
            const filter = m => message.author.id === m.author.id && (m.content.toUpperCase() === 'OUI' || m.content.toUpperCase() === 'NON')
            await message.channel.send('voulez vous ajouter un autre field a votre embed ?').then(async msg => {
                await message.channel.awaitMessages(filter, { max: 1, time: 60000 }).then(async collected => {
                    if(collected.size >= 1) {
                        const ui = collected.find(m => m.content.toUpperCase() === 'OUI')
                        const tre = collected.find(m => m.content.toUpperCase() !== 'OUI')
                        if(ui) {
                            msg.delete()
                            ui.delete()
                            await addFiel(message, embed)
                        } else {
                            tre.delete()
                            return msg.delete()
                        }
                    } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
                });
            });
        }
    }
}


module.exports.run = async (settings, client, message, args, command) => {
    const embed = new MessageEmbed()
    .setTimestamp()
    await Coll(embed, message, 'l\' author', 256);
    await Coll(embed, message, 'le titre', 256);
    await Coll(embed, message, 'la description', 2048);
    await addFiel(message, embed)
    await Coll(embed, message, 'la couleur');
    await Coll(embed, message, 'le footer', 2048);
    message.channel.send({embeds: [embed]})
};

module.exports.help = {
    vanish: true,
    group: 'divers',
    name: "embed",
    alliases: ['embed'],
    description: "Permet de créer un embed",
    bug: false,
    precisions: '',
    requireArgs: false,
    argsRequiered: '',
    exemple: '',
    permissions: ["MANAGE_MESSAGES"],
    permissionsBot: ["ADMINISTRATOR"],
};