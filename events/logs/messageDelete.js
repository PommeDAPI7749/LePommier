module.exports = async (client, message) => {
    const rules = await client.getRulesByMessage(message)
    if(rules) {
        return client.deleteRulesDB(message)
    }
    const rolereact = await client.RoleReactAlreadyExistMsg(message.id)
    if(rolereact) {
        return client.deleteRoleReactDB(message.id)
    }
    const ticketsystem = await client.ticketSystemAlreadyExistMsg(message.id)
    if(ticketsystem) {
        return client.deleteTicketSystemDB(ticketsystem.messageOpenTicketID)
    }
}