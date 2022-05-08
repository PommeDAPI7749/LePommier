const mongoose = require("mongoose");
const { Ticket } = require("../../models/index");

module.exports = client => {
  client.createTicket = async (raison, member, guild, ch, msg) => {
    const merged = Object.assign({
      _id: mongoose.Types.ObjectId(),
      userID: member,
      channelID: ch,
      guildID: guild,
      messageCloseID: msg,
      ticketObject: raison,
      lock: false,
    });
    const createTicket = await new Ticket(merged);
    createTicket.save();
  };

  client.getTicket = async (user, guild, r) => {
    const data = await Ticket.findOne({ guildID: guild.id, ticketObject: r, userID: user.id});
    if(data) {
      return data
    } else {
      return false;
    }
  };

  client.getTicketByMsgID = async (msg) => {
    const data = await Ticket.findOne({ messageCloseID: msg });
    if(data) {
      return data
    } else {
      return false;
    }
  };
  
  client.getTicketByChID = async (ch) => {
    const data = await Ticket.findOne({ channelID: ch.id });
    if(data) {
      return data
    } else {
      return false;
    }
  };

  client.deleteTicket = async (msg) => {
    const verif = await client.getTicketByMsgID(msg.id)
    if(verif) {
      await Ticket.deleteOne({ messageCloseID: msg.id });
    } else return
  };

  client.updateTicket = async (ch, settings) => {
    let data = await client.getTicketByChID(ch);
    if(typeof data !== "object") data = {};
    for (const key in settings) {
      if(data[key] !== settings[key]) data[key] = settings[key];
    }
    return data.updateOne(settings);
  };
}