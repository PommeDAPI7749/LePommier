const mongoose = require("mongoose");
const { TicketSystem } = require("../../models/index");

module.exports = client => {
  client.createTicketSystem = async (mess, guild, msg, obj, cat, role, ch) => {
    const merged = Object.assign({
      _id: mongoose.Types.ObjectId(),
      guildID: guild.id,
      messageOpenTicketID: msg,
      roleID: role,
      objet: obj,
      category: cat,
      pannelChannel: ch.id,
      messageWelcome: mess,
    });
    const createTicketSystem = await new TicketSystem(merged);
    createTicketSystem.save();
  };

  client.ticketSystemAlreadyExist = async (guild, obj) => {
    const data = await TicketSystem.find({ guildID: guild.id, objet: obj});
    if(data[0]) {
      return data[0]
    } else return false;
  };

  client.ticketSystemAlreadyExistMsg = async (msg) => {
    const data = await TicketSystem.find({ messageOpenTicketID: msg});
    if(data[0]) {
      return data[0]
    } else return false;
  };

  client.deleteTicketSystemDB = async (msg) => {
    await TicketSystem.deleteOne({ messageOpenTicketID: msg });
  };
}