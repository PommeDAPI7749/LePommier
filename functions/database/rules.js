const { MessageEmbed } = require("discord.js");
const { invisible } = require("../../util/couleurs")
const mongoose = require("mongoose");
const { Rules } = require("../../models/index");
const { idrules } = require('../../util/emotes')

module.exports = client => {
    client.createRulesDB = async (message, salon, role, titre, préambule) => {
        const reglement = new MessageEmbed()
        .setTitle(titre.toUpperCase())
        .setDescription(préambule)
        .setColor(invisible)
        .addField('━━━━━━━━━━━━ IMPORTANT ━━━━━━━━━━━━',`Ce serveur est, comme tous, soumis aux [Terms Of Service](${encodeURI('https://discord.com/terms')}) de Discord`)
        salon.send({embeds:[reglement]}).then(async msg => {
            const merged = Object.assign({
                _id: mongoose.Types.ObjectId(),
                channelID: salon.id,
                guildID: salon.guild.id,
                messageReglement: msg.id,
                role: role.id,
                title: titre.toUpperCase(),
                description: préambule,
            });
            const createRules = await new Rules(merged)
            createRules.save()
            msg.react(idrules)
        })
    };

    client.getRules = async (guild) => {
        const data = await Rules.find({ guildID: guild.id});
        if(data[0]) {
          return data[0]
        } else return false;
    };

    client.getRulesByMessage = async (message) => {
        const data = await Rules.find({ messageReglement: message.id});
        if(data[0]) {
          return data[0]
        } else return false;
    };

    client.updateRules = async (guild, settings) => {
        let data = await client.getRules(guild);
        if(typeof data !== "object") data = {};
        for (const key in settings) {
          if(data[key] !== settings[key]) data[key] = settings[key];
        }
        return data.updateOne(settings);
    };

    client.addRule = async (guild, rule) => {
        const  data = await client.getRules(guild)
        var rules = await data.rules
        if(!rules) rules = []
        await rules.push(rule)
        await client.updateRules(guild, {rules: rules})
        guild.channels.cache.get(data.channelID).messages.fetch(data.messageReglement).then(async m => {
            const reglement = new MessageEmbed()
            .setTitle(data.title)
            .setDescription(data.description)
            .setColor(invisible)
            let s = 1
            await rules.map(r => {
                reglement.addField(`Règle n°${s}`, r)
                s += 1
            })
            reglement.addField('━━━━━━━━━━━━ IMPORTANT ━━━━━━━━━━━━',`Ce serveur est, comme tous, soumis aux [Terms Of Service](${encodeURI('https://discord.com/terms')}) de Discord`)
            m.edit(reglement)
        })
    }

    client.removeRule = async (message, num) => {
        const data = await client.getRules(message.guild)
        var rules = await data.rules
        const r = rules[num-1]
        if(!r) return 
        await rules.splice(r, 1)
        await client.updateRules(message.guild, {rules: rules})
        message.guild.channels.cache.get(data.channelID).messages.fetch(data.messageReglement).then(async m => {
            const reglement = new MessageEmbed()
            .setTitle(data.title)
            .setDescription(data.description)
            .setColor(invisible)
            let s = 1
            await rules.map(r => {
                reglement.addField(`Règle n°${s}`, r)
                s += 1
            })
            reglement.addField('━━━━━━━━━━━━ IMPORTANT ━━━━━━━━━━━━',`Ce serveur est, comme tous, soumis aux [Terms Of Service](${encodeURI('https://discord.com/terms')}) de Discord`)
            m.edit(reglement)
        })
    }

    client.deleteRulesDB = async (message) => {
        const  data = await client.getRules(message.guild)
        await Rules.deleteOne({ guildID: message.guild.id});
        message.guild.channels.cache.get(data.channelID).messages.fetch(data.messageReglement).then(m => {
            if(m) {
                if(!m.deleted) m.delete()
            }
        })
        message.channel.send('règlement supprimé avec succès !').then(m => m.delete({timeout: 5000}))
    };

}