module.exports.run = async (settings, client, message, args, command) => {
    function clean(text) {
      if(typeof text === "string") 
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
      return text;
    }
   
    if(message.author.id !== "539510339713105950" && message.author.id !== "671019118400372749") return;
    const code = args.join(" ");
    const evaled = eval(code);
    const cleanCode = await clean(evaled);
    message.channel.send(cleanCode, { code: "js" });
  };

module.exports.help = {
    group: 'reservedevs',
    name: "eval",
    aliases: ['eval'],
    description: "Revoie code js testé",
    bug: false,
    precisions: '',
    requireArgs: true,
    argsRequiered: "<votre_message>",
    permissions: [],
    permissionsBot: ["MANAGE_MESSAGES", "SEND_MESSAGES"],
};