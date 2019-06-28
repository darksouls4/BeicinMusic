const { Command, ClientEmbed } = require("../../");

module.exports = class Skip extends Command {
    constructor(client) {
        super(client, {
            name: 'skip',
            aliases: ['sk']
        })
    }

    async run({ voiceChannel, message, channel, guild, author }) {
        const trueResult = await this.verifyVoice(guild, channel, author, voiceChannel);
        if (!trueResult) return;

        const embed = new ClientEmbed(author);
        const guildQueue = await this.client.music.module.queue.get(guild.id);
        if (guildQueue && guildQueue.songs.length > 0) {
            return message.react('⏩').then(() => guildQueue.skip());
        } else {
            if (guildQueue) {
                return channel.send(embed
                    .setTitle('Não há nehuma música depois dessa!')
                    .setColor(process.env.ERR_COLOR)
                )
            } else {
                return channel.send(embed
                    .setTitle('Não estou tocando nada no **momento**')
                    .setColor(process.env.ERR_COLOR)
                )
            }
        }
    }
}