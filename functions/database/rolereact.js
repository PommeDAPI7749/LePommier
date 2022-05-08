const mongoose = require("mongoose");
const { RoleReact } = require("../../models/index");
const { MessageEmbed } = require("discord.js");
const { defaultColor } = require("../../util/couleurs");

module.exports = client => {
    client.createRoleReactDB = async (message, salon, titre, description, msg) => {
        const merged = Object.assign({
            _id: mongoose.Types.ObjectId(),
            channelID: salon.id,
            guildID: message.guild.id,
            messageReact: msg.id,
            title: titre,
            description: description,
        });
        const createRoleReact = await new RoleReact(merged);
        createRoleReact.save();
    };

    client.getRoleReact = async (guild) => {
        const data = await RoleReact.find({ guildID: guild.id});
        if(data[0]) {
            return data[0]
        } else return false;
    };

    client.RoleReactAlreadyExistMsg = async (msg) => {
        const data = await RoleReact.find({ messageReact: msg});
        if(data[0]) {
            return data[0]
        } else return false;
    };

    client.deleteRoleReactDB = async (rolemenu) => {
        await RoleReact.deleteOne({ messageReact: rolemenu });
    };

    client.updateRoleReact = async (rolemenu, settings) => {
        let data = await client.RoleReactAlreadyExistMsg(rolemenu);
        if(typeof data !== "object") data = {};
        for (const key in settings) {
          if(data[key] !== settings[key]) data[key] = settings[key];
        }
        return data.updateOne(settings);
    };

    client.addReact = async (message, rolemenu, role, emote, emoteID) => {
        const data = await client.RoleReactAlreadyExistMsg(rolemenu)
        var roles = await data.roles
        if(!roles) roles = []
        await roles.push(role)
        var emojis = await data.emojis
        if(!emojis) emojis = []
        await emojis.push(emote)
        var emojisID = await data.emojisID
        if(!emojisID) emojisID = []
        await emojisID.push(emoteID)
        await client.updateRoleReact(rolemenu, {roles: roles, emojis: emojis, emojisID: emojisID})
        message.guild.channels.cache.get(data.channelID).messages.fetch(data.messageReact).then(async m => {
            await m.reactions.removeAll()
            const panel = new MessageEmbed()
            .setTitle(data.title)
            .setDescription(data.description)
            .setColor(defaultColor)
            panel.setFooter(`Cliquez sur la reaction si dessous pour recevoir un rôle`)
            let rst = await message.guild.roles.cache.get(roles[0])
            var r = `${emojis[0]} => ${rst}`
            async function addroles() {
                await emojis.map(async e => {
                    const n = await emojis.indexOf(e)
                    if(n !== 0) {
                        let rr = await message.guild.roles.cache.get(roles[n])
                        r += `\n${emojis[n]} => ${rr}`
                    }
                })
            }
            await addroles()
            panel.addField(`Rôles disponibles`, r)
            m.edit(panel)
            await emojis.map(async e => {
                let n = await emojis.indexOf(e)
                if(emojisID[n]) {
                    m.react(emojisID[n])
                } else {
                    m.react(e)
                }
            })
        })
    }

    client.removeReactDB = async (message, rolemenu, role) => {
        const  data = await client.RoleReactAlreadyExistMsg(rolemenu)
        var roles = await data.roles
        const n = roles.indexOf(role)
        if(!roles) roles = []
        await roles.splice(n, 1)
        var emojis = await data.emojis
        if(!emojis) emojis = []
        await emojis.splice(n, 1)
        var emojisID = await data.emojisID
        if(!emojisID) emojisID = []
        await emojisID.splice(n, 1)
        await client.updateRoleReact(rolemenu, {roles: roles, emojis: emojis, emojisID: emojisID})
        message.guild.channels.cache.get(data.channelID).messages.fetch(data.messageReact).then(async m => {
            await m.reactions.removeAll()
            const panel = new MessageEmbed()
            .setTitle(data.title)
            .setDescription(data.description)
            .setColor(defaultColor)
            let rst = await message.guild.roles.cache.get(roles[0])
            var r = `${emojis[0]} => ${rst}`
            async function addroles() {
                await emojis.map(async e => {
                    const n = await emojis.indexOf(e)
                    if(n !== 0) {
                        let rr = await message.guild.roles.cache.get(roles[n])
                        r += `\n${emojis[n]} => ${rr}`
                    }
                })
            }
            await addroles()
            if(emojis[0]) {
                panel.addField(`Rôles disponibles`, r)
                panel.setFooter(`Cliquez sur la reaction si dessous pour recevoir un rôle`)
            } else panel.setFooter(`Il n'y a pas de rôles disponibles pour le moment`)
            m.edit(panel)
            await emojis.map(async e => {
                let n = await emojis.indexOf(e)
                if(emojisID[n]) {
                    m.react(emojisID[n])
                } else {
                    m.react(e)
                }
            })
        })
    }
}