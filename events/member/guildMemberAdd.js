// const { Canvas } = require("canvas-constructor");
// const { loadImage } = require("canvas")
const moment = require('moment')
const { MessageEmbed, MessageAttachment } = require("discord.js");
const { validColor, defaultColor, warningColor, arrayColors, invisible } = require("../../util/couleurs");

module.exports = async (client, member) => {
    if(member.bot) return
    const settings = await client.getGuild(member.guild);
    const dbUser = await client.getUser(member.user);
    const dbMember = await client.getMember(member);

    if(dbUser.blacklisted) {
        const embed = new MessageEmbed()
        .setAuthor(`${member.user.tag} (${member.user.id})`, member.user.displayAvatarURL())
        .setColor(warningColor)
        if(member.bannable) {
            member.ban({reason: 'blacklisted'})
            embed.setDescription(`viens tenter de rejoindre votre serveur, je l'ai banni car il fait parti de ma blacklist`)
        } else {
            embed.setDescription(`viens de rejoindre votre serveur, je l'ai tenté de le bannir car il fait parti de ma blacklist, cependant je n'ai pas les permissions necéssaires`)
        }
        if(member.guild.channels.cache.get(settings.log.channel)) {
            member.guild.channels.cache.get(settings.log.channel).send({content: `${member.guild.owner}`, embeds: [embed]})
        }
        if(!member.guild.owner.user.dmChannel) await member.guild.owner.user.createDM()
        await member.guild.owner.user.dmChannel.send({embeds: [embed]})
    };

    if(settings.lock.enabled) {
        const embed = new MessageEmbed()
        .setAuthor(`${member.guild.name}`, member.guild.iconURL())
        .setColor(defaultColor)
        .setDescription(`Je suis desolé de vous apprendre que le serveur est actuellement verouillé, essayez plus tard !`)
        .setFooter(`${client.user.username} by PommeD'API#7749`)
        if(!member.user.dmChannel) await member.user.createDM()
        await member.user.dmChannel.send({embeds: [embed]})
        return member.guild.member(member).kick('Serveur Verouillé')
    };

    // if(settings.captcha.enabled) {
    //     const roleVerifié = member.guild.roles.cache.get(settings.captcha.role)
    //     if(!roleVerifié) {
    //         var roleVerif = await member.guild.roles.create({
    //             data: {
    //                 name: 'Non vérifié',
    //                 color: warningColor,
    //                 permission: []
    //             }
    //         })
    //         member.guild.channels.cache.forEach(async (channel, id) => {
    //             await channel.updateOverwrite(roleVerif, {
    //                 READ_MESSAGES: false,
    //                 VIEW_CHANNEL: false,
    //                 SEND_MESSAGES: false,
    //                 ADD_REACTIONS: false,
    //                 CONNECT: false
    //             })
    //         })
    //         roleVerif = roleVerif.id
    //         member.roles.add(roleVerif)
    //         client.updateGuild(member.guild, {captcha:{ enabled: true, role: roleVerif }});
    //     } else member.roles.add(roleVerifié)
    //     const code = Math.round(Math.random() * 99999999);
    //     const can = new Canvas(150, 50)
    //     .setColor('#FFAE23')
    //     .setTextFont('35px Impact')
    //     .setTextAlign('center')
    //     .printText(`${code}`, 75, 50)
    //     .toBuffer();
    //     const attach = new MessageAttachment(can, 'captcha.jpg')
    //     const em = new MessageEmbed()
    //     .setTitle("\\🔒 | Captcha")
    //     .attachFiles(attach)
    //     .setColor("#2f3136")
    //     .setImage(`attachment://captcha.jpg`)
    //     .setFooter(`Vous avez 60 secondes pour renvoyer le code`)
    //     var captchaCh = member.guild.channels.cache.get(settings.captcha.channel)
    //     if(!captchaCh) {
    //         await member.guild.channels.create('captcha').then(async ch => {
    //             ch.updateOverwrite(member.guild.roles.cache.find(r => r.name === '@everyone'), {
    //                 VIEW_CHANNEL: false,
    //             })
    //             captchaCh = ch
    //         })
    //     }
    //     if(captchaCh) {
    //         captchaCh.updateOverwrite(member.guild.roles.cache.get(settings.captcha.role), {
    //             READ_MESSAGES: true,
    //             VIEW_CHANNEL: true,
    //             SEND_MESSAGES: true,
    //         });
    //         captchaCh.send(`${member}`, em).then(msg => {
    //             const filter1 = msg => msg.author.id === member.id;
    //             captchaCh.awaitMessages(filter1, { max: 1, time: 20000 }).then(async collected => {
    //                 if(collected.size >= 1) {
    //                     const validé = collected.find(m => m.content === `${code}`)
    //                     const roleVerifié = member.guild.roles.cache.get(settings.captcha.role)
    //                     if(validé) {
    //                         if(roleVerifié) {
    //                             member.roles.remove(roleVerifié);
    //                             msg.delete()
    //                             validé.delete()
    //                         }
    //                     } else {
    //                         collected.find(m => m.author.id === member.id).delete()
    //                         captchaCh.send(`${member}, vous avez 40 secondes pour envoyer le bon code ...`).then(msg2 => {
    //                             const filter1 = msg => msg.author.id === member.id;
    //                             captchaCh.awaitMessages(filter1, { max: 1, time: 20000 }).then(async collected => {
    //                                 if(collected.size >= 1) {
    //                                     const validé = collected.find(m => m.content === `${code}`)
    //                                     const roleVerifié = member.guild.roles.cache.get(settings.captcha.role)
    //                                     if(validé) {
    //                                         if(roleVerifié) {
    //                                             member.roles.remove(roleVerifié);
    //                                             msg.delete()
    //                                             msg2.delete()
    //                                             validé.delete()
    //                                         }
    //                                     } else {
    //                                         collected.find(m => m.author.id === member.id).delete()
    //                                         captchaCh.send(`${member}, vous avez 20 secondes pour envoyer le bon code avant expulsion`).then(msg3 => {
    //                                             const filter1 = msg => msg.author.id === member.id;
    //                                             captchaCh.awaitMessages(filter1, { max: 1, time: 20000 }).then(async collected => {
    //                                                 if(collected.size >= 1) {
    //                                                     const validé = collected.find(m => m.content === `${code}`)
    //                                                     const roleVerifié = member.guild.roles.cache.get(settings.captcha.role)
                                                        
    //                                                     if(validé) {
    //                                                         if(roleVerifié) {
    //                                                             member.roles.remove(roleVerifié);
    //                                                             msg.delete()
    //                                                             msg2.delete()
    //                                                             msg3.delete()
    //                                                             validé.delete()
    //                                                         }
    //                                                     } else {
    //                                                         msg.delete()
    //                                                         msg2.delete()
    //                                                         msg3.delete()
    //                                                         collected.find(m => m.author.id === member.id).delete()
    //                                                         member.guild.member(member).kick('Echec au niveau du captcha');
    //                                                         const embed = new MessageEmbed()
    //                                                         .setColor(warningColor)
    //                                                         .setDescription(`${member} a été exclu car \`il/elle\` \`n'a pas/a mal\` remplis le captcha`)
    //                                                         .setFooter('')
    //                                                         .setTimestamp();
    //                                                         const logs = client.channels.cache.get(settings.log.channel)
    //                                                         if(logs) logs.send({embeds: [embed]})
    //                                                         return
    //                                                     };
    //                                                 } else {
    //                                                     msg.delete()
    //                                                     msg2.delete()
    //                                                     msg3.delete()
    //                                                     member.guild.member(member).kick('Echec au niveau du captcha');
    //                                                     const embed = new MessageEmbed()
    //                                                     .setColor(warningColor)
    //                                                     .setDescription(`${member} a été exclu car \`il/elle\` \`n'a pas/a mal\` remplis le captcha`)
    //                                                     .setFooter('')
    //                                                     .setTimestamp();
    //                                                     const logs = client.channels.cache.get(settings.log.channel)
    //                                                     if(logs) logs.send({embeds: [embed]})
    //                                                     return
    //                                                 };
    //                                             });
    //                                         });
    //                                     };
    //                                 } else {
    //                                     captchaCh.send(`${member}, vous avez 20 secondes pour envoyer le bon code avant expulsion`).then(msg3 => {
    //                                         const filter1 = msg => msg.author.id === member.id;
    //                                         captchaCh.awaitMessages(filter1, { max: 1, time: 20000 }).then(async collected => {
    //                                             if(collected.size >= 1) {
    //                                                 const validé = collected.find(m => m.content === `${code}`)
    //                                                 const roleVerifié = member.guild.roles.cache.get(settings.captcha.role)
    //                                                 if(validé) {
    //                                                     if(roleVerifié) {
    //                                                         member.roles.remove(roleVerifié);
    //                                                         msg.delete()
    //                                                         msg2.delete()
    //                                                         msg3.delete()
    //                                                         validé.delete()
    //                                                     }
    //                                                 } else {
    //                                                     msg.delete()
    //                                                     msg2.delete()
    //                                                     msg3.delete()
    //                                                     collected.find(m => m.author.id === member.id).delete()
    //                                                     member.guild.member(member).kick('Echec au niveau du captcha');
    //                                                     const embed = new MessageEmbed()
    //                                                     .setColor(warningColor)
    //                                                     .setDescription(`${member} a été exclu car \`il/elle\` \`n'a pas/a mal\` remplis le captcha`)
    //                                                     .setFooter('')
    //                                                     .setTimestamp();
    //                                                     const logs = client.channels.cache.get(settings.log.channel)
    //                                                     if(logs) logs.send({embeds: [embed]})
    //                                                     return
    //                                                 };
    //                                             } else {
    //                                                 msg.delete()
    //                                                 msg2.delete()
    //                                                 msg3.delete()
    //                                                 member.guild.member(member).kick('Echec au niveau du captcha');
    //                                                 const embed = new MessageEmbed()
    //                                                 .setColor(warningColor)
    //                                                 .setDescription(`${member} a été exclu car \`il/elle\` \`n'a pas/a mal\` remplis le captcha`)
    //                                                 .setFooter('')
    //                                                 .setTimestamp();
    //                                                 const logs = client.channels.cache.get(settings.log.channel)
    //                                                 if(logs) logs.send({embeds: [embed]})
    //                                                 return
    //                                             };
    //                                         });
    //                                     });
    //                                 };
    //                             });
    //                         });
    //                     };
    //                 } else {
    //                     captchaCh.send(`${member}, vous avez 40 secondes pour envoyer le bon code ...`).then(msg2 => {
    //                         const filter1 = msg => msg.author.id === member.id;
    //                         captchaCh.awaitMessages(filter1, { max: 1, time: 20000 }).then(async collected => {
    //                             if(collected.size >= 1) {
    //                                 const validé = collected.find(m => m.content === `${code}`)
    //                                 const roleVerifié = member.guild.roles.cache.get(settings.captcha.role)
    //                                 if(validé) {
    //                                     if(roleVerifié) {
    //                                         member.roles.remove(roleVerifié);
    //                                         msg.delete()
    //                                         msg2.delete()
    //                                         validé.delete()
    //                                     }
    //                                 } else {
    //                                     collected.find(m => m.author.id === member.id).delete()
    //                                     captchaCh.send(`${member}, vous avez 20 secondes pour envoyer le bon code avant expulsion`).then(msg3 => {
    //                                         const filter1 = msg => msg.author.id === member.id;
    //                                         captchaCh.awaitMessages(filter1, { max: 1, time: 20000 }).then(async collected => {
    //                                             if(collected.size >= 1) {
    //                                                 const validé = collected.find(m => m.content === `${code}`)
    //                                                 const roleVerifié = member.guild.roles.cache.get(settings.captcha.role)
                                                    
    //                                                 if(validé) {
    //                                                     if(roleVerifié) {
    //                                                         member.roles.remove(roleVerifié);
    //                                                         msg.delete()
    //                                                         msg2.delete()
    //                                                         msg3.delete()
    //                                                         validé.delete()
    //                                                     }
    //                                                 } else {
    //                                                     msg.delete()
    //                                                     msg2.delete()
    //                                                     msg3.delete()
    //                                                     collected.find(m => m.author.id === member.id).delete()
    //                                                     member.guild.member(member).kick('Echec au niveau du captcha');
    //                                                     const embed = new MessageEmbed()
    //                                                     .setColor(warningColor)
    //                                                     .setDescription(`${member} a été exclu car \`il/elle\` \`n'a pas/a mal\` remplis le captcha`)
    //                                                     .setFooter('')
    //                                                     .setTimestamp();
    //                                                     const logs = client.channels.cache.get(settings.log.channel)
    //                                                     if(logs) logs.send({embeds: [embed]})
    //                                                     return
    //                                                 };
    //                                             } else {
    //                                                 msg.delete()
    //                                                 msg2.delete()
    //                                                 msg3.delete()
    //                                                 member.guild.member(member).kick('Echec au niveau du captcha');
    //                                                 const embed = new MessageEmbed()
    //                                                 .setColor(warningColor)
    //                                                 .setDescription(`${member} a été exclu car \`il/elle\` \`n'a pas/a mal\` remplis le captcha`)
    //                                                 .setFooter('')
    //                                                 .setTimestamp();
    //                                                 const logs = client.channels.cache.get(settings.log.channel)
    //                                                 if(logs) logs.send({embeds: [embed]})
    //                                                 return
    //                                             };
    //                                         });
    //                                     });
    //                                 };
    //                             } else {
    //                                 captchaCh.send(`${member}, vous avez 20 secondes pour envoyer le bon code avant expulsion`).then(msg3 => {
    //                                     const filter1 = msg => msg.author.id === member.id;
    //                                     captchaCh.awaitMessages(filter1, { max: 1, time: 20000 }).then(async collected => {
    //                                         if(collected.size >= 1) {
    //                                             const validé = collected.find(m => m.content === `${code}`)
    //                                             const roleVerifié = member.guild.roles.cache.get(settings.captcha.role)
                                                
    //                                             if(validé) {
    //                                                 if(roleVerifié) {
    //                                                     member.roles.remove(roleVerifié);
    //                                                     msg.delete()
    //                                                     msg2.delete()
    //                                                     msg3.delete()
    //                                                     validé.delete()
    //                                                 }
    //                                             } else {
    //                                                 msg.delete()
    //                                                 msg2.delete()
    //                                                 msg3.delete()
    //                                                 collected.find(m => m.author.id === member.id).delete()
    //                                                 member.guild.member(member).kick('Echec au niveau du captcha');
    //                                                 const embed = new MessageEmbed()
    //                                                 .setColor(warningColor)
    //                                                 .setDescription(`${member} a été exclu car \`il/elle\` \`n'a pas/a mal\` remplis le captcha`)
    //                                                 .setFooter('')
    //                                                 .setTimestamp();
    //                                                 const logs = client.channels.cache.get(settings.log.channel)
    //                                                 if(logs) logs.send({embeds: [embed]})
    //                                                 return
    //                                             };
    //                                         } else {
    //                                             msg.delete()
    //                                             msg2.delete()
    //                                             msg3.delete()
    //                                             member.guild.member(member).kick('Echec au niveau du captcha');
    //                                             const embed = new MessageEmbed()
    //                                             .setColor(warningColor)
    //                                             .setDescription(`${member} a été exclu car \`il/elle\` \`n'a pas/a mal\` remplis le captcha`)
    //                                             .setFooter('')
    //                                             .setTimestamp();
    //                                             const logs = client.channels.cache.get(settings.log.channel)
    //                                             if(logs) logs.send({embeds: [embed]})
    //                                             return
    //                                         };
    //                                     });
    //                                 });
    //                             };
    //                         });
    //                     });
    //                 };
    //             });
    //         });
    //     };
    // };

    if(settings.memberCount.enabled) {
        const memberCountCh = member.guild.channels.cache.get(settings.memberCount.channel)
        var name = settings.memberCount.text
        const mc = client.guilds.cache.get(member.guild.id).memberCount
        if(name) {
            if(name.includes('{{MC}}')) name = name.replace("{{MC}}", mc)
            if(memberCountCh) memberCountCh.setName(name)
        }
    };

    var failedAutoRoles = []
    if(settings.autorole.enabled) {
        await settings.autorole.role.map(async r => {
            let role = await member.guild.roles.cache.get(r)
            if(role.position <= member.guild.me.roles.highest.position) {
                member.roles.add(role)
            } else await failedAutoRoles.push(role)
        })
    }
    
    
    // const wCh = member.guild.channels.cache.get(settings.welcome.channel)
    // if(wCh) {
    //     const bvnEmbed = new MessageEmbed()
    //     const r = Math.round(Math.random() * arrayColors.length)
    //     const color = arrayColors[r]
    //     if(settings.welcome.image) {
    //         const avatar = await member.user.displayAvatarURL({format: 'png'});
    //         const can = new Canvas(1500, 350)
    //         .setColor(color)
    //         .setTextAlign('left')
    //         .printCircularImage(await loadImage(avatar), 125, 245, 100)
    //         .printRoundedRectangle(10, 5, 550, 80, 80)
    //         .setTextFont('60px Corbel')
    //         .setColor(invisible)
    //         .printText('Bienvenue à toi', 40, 70)
    //         .setColor(color)
    //         .setTextFont('133px Corbel')
    //         .printText(member.user.username, 250, 295)
    //         .toBuffer()
    //         const attach = new MessageAttachment(can, 'bvn.png')
    //         bvnEmbed.attachFiles(attach)
    //         bvnEmbed.setColor(color)
    //         bvnEmbed.setImage(`attachment://bvn.png`)
    //         bvnEmbed.setFooter(`Nous sommes maintenant ${member.guild.memberCount}`)
    //         bvnEmbed.setTimestamp();
    //     }
    //     var msg = settings.welcome.message;
    //     if(settings.welcome.message) {
    //         if(msg.includes('{{userMention}}')) msg = msg.replace("{{userMention}}", member)
    //         if(msg.includes('{{userTag}}')) msg = msg.replace("{{userTag}}", member.user.tag)
    //         if(msg.includes('{{userName}}')) msg = msg.replace("{{userName}}", member.user.username)
    //         if(msg.includes('{{MC}}')) msg = msg.replace("{{MC}}", member.guild.memberCount)
    //         if(msg.includes('{{guildName}}')) msg = msg.replace("{{guildName}}", member.guild.name)
    //         if(settings.welcome.messagein) {
    //             bvnEmbed.setDescription(msg)
    //             if(!settings.welcome.image) {
    //                 bvnEmbed.setFooter(`Nous sommes maintenant ${member.guild.memberCount}`)
    //                 bvnEmbed.setColor(color)
    //                 bvnEmbed.setTimestamp();
    //             }
    //             msg = false
    //         }
    //     }
    //     if(msg || bvnEmbed.footer) wCh.send(msg ? msg : '', bvnEmbed.footer ? bvnEmbed : '')

    // }

    const logs = client.channels.cache.get(settings.log.channel)
    if(logs) {
        const embed = new MessageEmbed()
        .setColor(validColor)
        .setAuthor(`${member.user.username} (${member.id})`, member.user.displayAvatarURL())
        .setTitle(`Un nouveau membre a rejoins le serveur !`)
        .setDescription(`Compte créé le : ${client.tradDate(moment(member.user.createdAt).format('dddd DD MMMM YYYY [à] hh:mm'))}`)
        .setFooter(`${client.user.username} by PommeD'API#7749`)
        .setTimestamp();
        if(failedAutoRoles[0]) embed.addField("Je n'ai pas pu lui donner certains autorôles car ils sont plus haut que moi dans la hiérarchie :", failedAutoRoles.join(", "))
        logs.send({embeds: [embed]})
    }
}