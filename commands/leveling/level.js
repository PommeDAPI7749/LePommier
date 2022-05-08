// const { Canvas } = require('canvas-constructor');
const { MessageEmbed, MessageAttachment }= require('discord.js');
const { defaultColor } = require('../../util/couleurs');
const { Member } = require("../../models/index");

module.exports.run = async (settings, client, message, args, command) => {
  if(settings.leveling.enabled) {
    async function position(member) {
      var membres = await Member.find({ guildID: message.guild.id });
      await membres.sort(function (a, b) {
          return a.level == b.level ? b.experience - a.experience : b.level - a.level;
      });
      var membres2 = []
      await membres.map(m => membres2.push(m.toString()))
      const mem = member.toString()
      var pos = await membres2.indexOf(mem)
      pos = pos+1
      return pos
    };

    function rat(dbMember) {
      const tot = dbMember.level*dbMember.level*3+20
      var rat = dbMember.experience/tot
      return rat
    }
    var member = await message.mentions.members.first();
    if(!member) member = await message.guild.members.cache.get(args[0])
    if(!member) member = message.member
    const user = member.user
    const dbMember = await client.getMember(member);
    const barsize = await rat(dbMember)
    const coulor = dbMember.color ? dbMember.color : defaultColor
    const can = new Canvas(1200, 290)
    .setColor('#fff')
    .printRoundedRectangle(28, 215, 1160, 50, 80)
    .setColor(coulor)
    .printRoundedRectangle(20, 215, barsize * 1160, 50, 80)
    .setTextAlign('center')
    .setTextFont('70pt Corbel')
    .printText(`${member.nickname ? member.nickname : user.username}`, 600, 140)
    .setTextFont('40pt Corbel')
    .setTextAlign('left')
    .printText(`Niveau: ${dbMember.level}`, 20, 200)
    .setTextAlign('right')
    .printText(`${dbMember.experience} xp/${dbMember.level*dbMember.level*3+20}`, 1180, 200)
    .setTextFont('50pt Corbel')
    .setTextAlign('left')
    .printText(`#${await position(dbMember)}`, 20, 70)
    .toBuffer()
    const attach = new MessageAttachment(can, `leveling.jpg`)
    const em = new MessageEmbed()
    .attachFiles(attach)
    .setColor(coulor)
    .setImage(`attachment://leveling.jpg`)
    message.channel.send({embeds: [em]})
  } else message.reply('le système de niveaux est désactivé sur ce serveur !')
};
module.exports.help = {
  group: 'leveling',
  name: "level",
  aliases: ["level"],
  description: "Renvoi le niveau sur le serveur de l'utilisateur renseigné (l'auteur du message le cas échéant)",
  bug: true,
  precisions: '',
  requireArgs: false,
  argsRequiered: '',
  exemple: '',
  permissions: [],
  permissionsBot: ["MANAGE_MESSAGES", "SEND_MESSAGES"],
};