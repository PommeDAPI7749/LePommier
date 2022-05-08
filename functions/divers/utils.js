const { MessageEmbed } = require("discord.js");
const { enCours } = require("../../util/couleurs");
const mongoose = require("mongoose");
const { Guild } = require("../../models/index");

module.exports = client => {
    client.annulation = async message => {
        const annulEmbed = new MessageEmbed()
        .setColor(enCours)
        .setTitle('Confirmation')
        .setDescription('Action annulée avec succès')
        .setFooter(`${client.user.username} by PommeD'API#7749`)
        return message.reply(annulEmbed)
    };

    client.tradDate = (date) => {
        if(date.includes('Monday')) date = date.replace("Monday", 'Lundi')
        if(date.includes('Tuesday')) date = date.replace("Tuesday", 'Mardi')
        if(date.includes('Wednesday')) date = date.replace("Wednesday", 'Mercredi')
        if(date.includes('Thursday')) date = date.replace("Thursday", 'Jeudi')
        if(date.includes('Friday')) date = date.replace("Friday", 'Vendredi')
        if(date.includes('Saturday')) date = date.replace("Saturday", 'Samedi')
        if(date.includes('Sunday')) date = date.replace("Sunday", 'Dimanche')
        if(date.includes('January')) date = date.replace("January", 'Janvier')
        if(date.includes('February')) date = date.replace("February", 'Février')
        if(date.includes('March')) date = date.replace("March", 'Mars')
        if(date.includes('April')) date = date.replace("April", 'Avril')
        if(date.includes('May')) date = date.replace("May", 'Mai')
        if(date.includes('June')) date = date.replace("June", 'Juin')
        if(date.includes('July')) date = date.replace("July", 'Juillet')
        if(date.includes('August')) date = date.replace("August", 'Août')
        if(date.includes('September')) date = date.replace("September", 'Septembre')
        if(date.includes('October')) date = date.replace("October", 'Octobre')
        if(date.includes('November')) date = date.replace("November", 'Novembre')
        if(date.includes('December')) date = date.replace("December", 'Décembre')
        return date
    }

    client.verifLevel = (guild) => {
        var verifLevel = guild.verificationLevel
        if(verifLevel.includes('NONE')) verifLevel = verifLevel.replace("NONE", 'Aucune restriction')
        if(verifLevel.includes('LOW')) verifLevel = verifLevel.replace("LOW", 'Faible - Adresse mail vérifiée')
        if(verifLevel.includes('MEDIUM')) verifLevel = verifLevel.replace("MEDIUM", 'Moyen - Adresse mail vérifiée \nCompte vieux de plus de 5 minutes')
        if(verifLevel.includes('HIGH')) verifLevel = verifLevel.replace("HIGH", 'Elevé - Adresse mail vérifiée \nCompte vieux de plus de 5 minutes\nMembre du serveur depuis plus de 10 minutes')
        if(verifLevel.includes('VERY_HIGH')) verifLevel = verifLevel.replace("VERY_HIGH", 'Maximum - Adresse mail vérifiée \nCompte vieux de plus de 5 minutes\nMembre du serveur depuis plus de 10 minutes\nNuméro de téléphone vérifié')
        return verifLevel
    }

    client.contentExplicit = (guild) => {
        var contentExplicit = guild.explicitContentFilter
        if(contentExplicit.includes('DISABLED')) contentExplicit = contentExplicit.replace("DISABLED", 'Désactivé')
        if(contentExplicit.includes('MEMBERS_WITHOUT_ROLES')) contentExplicit = contentExplicit.replace("MEMBERS_WITHOUT_ROLES", 'Valable sur les membres sans roles')
        if(contentExplicit.includes('ALL_MEMBERS')) contentExplicit = contentExplicit.replace("ALL_MEMBERS", 'Valable pour tous les membres')
        return contentExplicit
    }

    client.newdb = async (settings, client, guild) => {
        data = await {
            guildID: settings.guildID,
            guildName: settings.guildName,
            ticketParent: settings.ticketParent,
            prefix: settings.prefix,
            log: {
                enabled: settings.logChannel ? true : false,
                channel: settings.logChannel
            },
            welcome: {
                enabled: settings.welcomeChannel ? true : false,
                message: settings.welcomeMessage,
                channel: settings.welcomeChannel
            },
            leave: {
                enabled: settings.leaveChannel ? true : false,
                message: settings.leaveMessage,
                channel: settings.leaveChannel
            },
            memberCount: {
                enabled: settings.memberCount,
                channel: settings.memberCountChannel,
                text: settings.memberCountText
            },
            captcha: {
              enabled: settings.captcha,
              channel: settings.captchaChannel,
              role: settings.roleVerifie,
            },
            lock: {
                enabled: settings.lockStatut,
                role: settings.lockRole,
            },
            autorole: {
                enabled: settings.autorole ? true : false,
                role: settings.autorole ? settings.autorole : "",
            },
            sugg: {
                enabled: settings.suggChannel ? true : false,
                channel: settings.suggChannel
            },
            leveling: {
                enable : settings.leveling,
                rewards: [],
            },
            secu: {
                antiInvite: settings.antiLien == 1,
                antiLien: settings.antiLien == 2 || settings.antiLien == 3,
                antiMention: settings.antiMention,
                sanctions: settings.sanctions,
                muteRole: settings.muteRole,
            },
            lives: settings.lives,
        }
        await client.deleteGuild(guild)
        async function createG() {
            const merged = Object.assign({ _id: mongoose.Types.ObjectId() }, data);
            const createGuild = await new Guild(merged);
            await createGuild.save().then(g => console.log(`Nouvelle DB -> ${g.guildName}`));
        }
        await createG()
    };
};