module.exports = class MessageEvent {
    constructor(client) {
        this.client = client
        this.name = 'guildCreate'
    }

    ON(guild) {
        if (guild.id != ProcessingInstruction.env.guildID) guild.leave();
    }
}