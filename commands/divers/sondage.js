const { MessageEmbed } = require("discord.js");
const { defaultColor, invisible } = require("../../util/couleurs");
const { oui, non, idoui, idnon, idone, idtwo, idtree, idfour, idfive, five, four, tree, two, one } = require("../../util/emotes");

module.exports.run = async (settings, client, message, args, command) => {
    const question = args.splice(1).join(' ').toUpperCase();
    let reponse = "";
    if(args[0] !== 'VF' && args[0] !== "2" && args[0] !== "3" && args[0] !== "4" && args[0] !== "5") return message.reply('nombre/style de réponse invalide !')
    if(!question) return message.channel.send('Vous devez poser une question')
    const embedsolution1 = new MessageEmbed()
    .setColor(invisible)
    .setDescription(`${message.author} Envoyez la première réponse a votre sondage sous cet embed.`)
    .setFooter(`Pour annuler le sondage envoyez \`ANNULER\``)
    const embedsolution2 = new MessageEmbed()
    .setColor(invisible)
    .setDescription(`${message.author} Envoyez la deuxieme réponse a votre sondage sous cet embed.`)
    .setFooter(`Pour annuler le sondage envoyez \`ANNULER\``)
    const embedsolution3 = new MessageEmbed()
    .setColor(invisible)
    .setDescription(`${message.author} Envoyez la troisieme réponse a votre sondage sous cet embed.`)
    .setFooter(`Pour annuler le sondage envoyez \`ANNULER\``)
    const embedsolution4 = new MessageEmbed()
    .setColor(invisible)
    .setDescription(`${message.author} Envoyez la quatrieme réponse a votre sondage sous cet embed.`)
    .setFooter(`Pour annuler le sondage envoyez \`ANNULER\``)
    const embedsolution5 = new MessageEmbed()
    .setColor(invisible)
    .setDescription(`${message.author} Envoyez la cinquieme réponse a votre sondage sous cet embed.`)
    .setFooter(`Pour annuler le sondage envoyez \`ANNULER\``)
    const filter = m => (message.author.id == m.author.id)
    if(args[0] === 'VF') {
        reponse += `\n${oui} | VRAI`
        reponse += `\n${non} | FAUX`
    } else if(args[0] >= '2') {
        await message.reply(embedsolution1).then(async msg => {
            await message.channel.awaitMessages(filter, { max: 1, time: 60000 }).then(async collected => {
                if(collected.size >= 1) {
                    const annulation = collected.find(m => m.content.toUpperCase() === 'ANNULER')
                    const tre = collected.find(m => m.content.toUpperCase() !== 'ANNULER')
                    if(annulation) {
                        annulation.delete()
                        msg.delete()
                        return message.reply('Action annulée avec succès');
                    } else {
                        tre.delete()
                        msg.delete()
                        reponse += `\n1️⃣ | ${tre.content}`
                    }
                } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
            });
        });
        await message.reply(embedsolution2).then(async msg => {
            await message.channel.awaitMessages(filter, { max: 1, time: 60000 }).then(async collected => {
                if(collected.size >= 1) {
                    const annulation = collected.find(m => m.content.toUpperCase() === 'ANNULER')
                    const tre = collected.find(m => m.content.toUpperCase() !== 'ANNULER')
                    if(annulation) {
                        annulation.delete()
                        msg.delete()
                        return message.reply('Action annulée avec succès');
                    } else {
                        tre.delete()
                        msg.delete()
                        reponse += `\n2️⃣ | ${tre.content}`
                    }
                } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
            });
        });
        if(args[0] >= '3') {
            await message.reply(embedsolution3).then(async msg => {
                await message.channel.awaitMessages(filter, { max: 1, time: 60000 }).then(async collected => {
                    if(collected.size >= 1) {
                        const annulation = collected.find(m => m.content.toUpperCase() === 'ANNULER')
                        const tre = collected.find(m => m.content.toUpperCase() !== 'ANNULER')
                        if(annulation) {
                            annulation.delete()
                            msg.delete()
                            return message.reply('Action annulée avec succès');
                        } else {
                            tre.delete()
                            msg.delete()
                            reponse += `\n3️⃣ | ${tre.content}`
                        }
                    } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
                });
            });
            if(args[0] >= '4') {
                await message.reply(embedsolution4).then(async msg => {
                    await message.channel.awaitMessages(filter, { max: 1, time: 60000 }).then(async collected => {
                        if(collected.size >= 1) {
                            const annulation = collected.find(m => m.content.toUpperCase() === 'ANNULER')
                            const tre = collected.find(m => m.content.toUpperCase() !== 'ANNULER')
                            if(annulation) {
                                annulation.delete()
                                msg.delete()
                                return message.reply('Action annulée avec succès');
                            } else {
                                tre.delete()
                                msg.delete()
                                reponse += `\n4️⃣ | ${tre.content}`
                            }
                        } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
                    });
                });
                if(args[0] === '5') {
                    await message.reply(embedsolution5).then(async msg => {
                        await message.channel.awaitMessages(filter, { max: 1, time: 60000 }).then(async collected => {
                            if(collected.size >= 1) {
                                const annulation = collected.find(m => m.content.toUpperCase() === 'ANNULER')
                                const tre = collected.find(m => m.content.toUpperCase() !== 'ANNULER')
                                if(annulation) {
                                    annulation.delete()
                                    msg.delete()
                                    return message.reply('Action annulée avec succès');
                                } else {
                                    tre.delete()
                                    msg.delete()
                                    reponse += `\n5️⃣ | ${tre.content}`
                                }
                            } else message.reply('Action annulée : temps écoulé ...').then(m => m.delete({timeout: 5000}));
                        });
                    });
                };
            };
        };
    };
    const embed = new MessageEmbed()
    .setAuthor(question)
    .setColor(defaultColor)
    .setDescription(reponse)
    .setFooter(`proposé par ${message.author.tag}`)
    .setTimestamp();
    message.channel.createWebhook('Sondage', {
        avatar: client.user.displayAvatarURL({format: 'png'}),
    }).then(async webhook => {
        await webhook.send({embeds: [embed]}).then(msg => {
            if(args[0] >= 2) {
                msg.react('1️⃣')
                msg.react('2️⃣')
            }
            if(args[0] >= 3) {
                msg.react('3️⃣')
            }
            if(args[0] >= 4) {
                msg.react('4️⃣')
            }
            if(args[0] === 5) {
                msg.react('5️⃣')
            }
            if(args[0] === 'VF') {
                msg.react(idoui)
                msg.react(idnon)
            }
        })
        webhook.delete()
    })
};

module.exports.help = {
    vanish: true,
    group: 'divers',
    name: "sondage",
    aliases: ["sondage"],
    description: "Cré un sondage",
    bug: false,
    precisions: '',
    requireArgs: false,
    argsRequiered: '',
    permissions: [],
    permissionsBot: ["MANAGE_MESSAGES", "SEND_MESSAGES"],
};