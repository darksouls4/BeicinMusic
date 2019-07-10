require("dotenv").config();

const opts = {
    autoReconnect: true,
    fetchAllMembers: true,
    disableEveryone: false,
    restWsBridgeTimeout: 10000,
    restTimeOffset: 2000,
    messageCacheMaxSize: 2024,
    messageCacheLifetime: 1680,
    messageSweepInterval: 1680,
    disabledEvents: ['typingStart', 'typingStop', 'guildMemberSpeaking']
}

const required = require('./src/Client.js');
const client = new required(opts)
client.login();