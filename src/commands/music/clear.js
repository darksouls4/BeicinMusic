const { Command, ClientEmbed } = require("../../");

module.exports = class Clear extends Command {
    constructor(client) {
        super(client, {
            name: 'clear',
            aliases: []
        })
    }

    async run({ channel, guild, author }) {
        const embed = new ClientEmbed(author);
        const guildQueue = await this.client.music.module.queue.get(guild.id);
        if (guildQueue && guildQueue.songs.length) {
            guildQueue.clearQueue();
            return channel.send(embed
                .setTitle('Queue limpa com sucesso!')
            )
        } else {
            if (guildQueue) {
                return channel.send(embed
                    .setTitle('Não há nehuma música depois da atual!')
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