const dotenv = require('dotenv'); dotenv.config()
const { Client, Collection } = require('discord.js');
const {loadEvents, loadCommands, loadFunctions} = require("./util/loader");
const client = new Client({ restRequestTimeout: 60000, intents: 69631 });

client.mongoose = require("./util/mongoose");
client.commands = new Collection();

loadEvents(client);
loadCommands(client);
loadFunctions(client);
client.mongoose.init();

// Traitement des erreurs
process.on('exit', code => console.log(`process stopped with : ${code}`))
process.on('uncaughtExeption', (err, origin) => console.log(`UNCAUGHT_EXCEPTION: ${err}`, `Origin: ${origin}`))
process.on('unhandledRejection', (reason, promise) => { console.log(`UNHANDELED_REJECTION: ${reason}\n------------\n`, promise) })
process.on('warning', (...args) => console.log(...args))

client.login(process.env.TOKEN);