module.exports = async (client, channel) => {
    const ticket = await client.getTicketByChID(channel)
    if(ticket) {
        m = {}
        m.id = ticket.messageCloseID
        client.deleteTicket(m)
    }
}