const mongoose = require("mongoose");

const guildSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  guildID: String,
  guildName: String,
  ticketParent: String,
  prefix: {
    "type": String,
    "default": "lp:"
  },
  log: {
    "type": Object,
    "default": {
      enabled: false,
      channel: ""
    }
  },
  welcome: {
    "type": Object,
    "default": {
      enabled: false,
      message: "",
      channel: ""
    }
  },
  leave: {
    "type": Object,
    "default": {
      enabled: false,
      message: "",
      channel: ""
    }
  },
  memberCount: {
    "type": Object,
    "default": {
      enabled: false,
      text: "",
      channel: ""
    }
  },
  captcha: {
    "type": Object,
    "default": {
      enabled: false,
      role: "",
      channel: ""
    }
  },
  lock: {
    "type": Object,
    "default": {
      enabled: false,
      role: "",
    }
  },
  autorole: {
    "type": Object,
    "default": {
      enabled: false,
      role: [],
    }
  },
  sugg: {
    "type": Object,
    "default": {
      enabled: false,
      channel: "",
    }
  },
  leveling: {
    "type": Object,
    "default": {
      enable : false,
      rewards: [],
    },
  },
  secu: {
    "type": Object,
    "default": {
      antiInvite: false,
      antiLien: false,
      antiMention: 0,
      sanctions: [],
      muteRole: '',
    }
  },
  lives: Object,
});

module.exports = mongoose.model("Guild", guildSchema);