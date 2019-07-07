const { Command, ClientEmbed } = require("../../");

module.exports = class Stop extends Command {
    constructor(client) {
        super(client, {
            name: 'stop',
            aliases: ['s', 'parar'],
            roleDj: true
        })
    }

    async run({ voiceChannel, channel, guild, author }) {
        const trueResult = await this.verifyVoice(guild, channel, author, voiceChannel);
        if (trueResult) {
            const embed = new ClientEmbed(author);
            const guildQueue = await this.client.music.module.queue.get(guild.id);
            if (guildQueue && guildQueue.songPlaying) {
                return channel.send(embed
                    .setTitle('A queue foi finalizada!')
                ).then(() => guildQueue.stop());
            } else {
                return channel.send(embed
                    .setTitle('Não estou tocando nada no **momento**')
                    .setColor(process.env.ERR_COLOR)
                )
            }
        }
    }
}