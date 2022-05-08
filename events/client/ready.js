module.exports = (client) => {
  console.log("Hey !");
  client.user.setPresence({ activity : {name: `PommeD'API#7749`, type: 'LISTENING'}});
  setInterval(function(){
    client.user.setPresence({ activity : {name: `PommeD'API#7749`, type: 'LISTENING'}});
  }, 6400000)
  client.guilds.cache.map(async g => {
    const settings = await client.getGuild(g);
    if(settings) {
      if(settings.memberCount.enabled) {
        const memberCountCh = g.channels.cache.get(settings.memberCount.channel)
        var name = settings.memberCount.text
        if(!name) name = "{{MC}} membres"
        const mc = client.guilds.cache.get(g.id).memberCount
        if(name.includes('{{MC}}')) name = name.replace("{{MC}}", mc)
        if(memberCountCh) memberCountCh.setName(name)
      };
    }
  })
}