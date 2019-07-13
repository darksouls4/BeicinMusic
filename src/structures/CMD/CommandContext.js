module.exports = class CommandContext {
    constructor(options = {}) {
        this.client = options.client
        this.message = options.message
        this.author = options.message.author
        this.member = options.message.member
        this.channel = options.message.channel
        this.prefix = options.prefix
        this.voiceChannel = options.message.member.voiceChannel
        this.guild = options.message.guild
        this.command = options.command
        this.args = options.args
    }
}