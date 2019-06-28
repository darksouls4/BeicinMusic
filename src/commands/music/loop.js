const { Command, ClientEmbed } = require("../../");

module.exports = class Loop extends Command {
    constructor(client) {
        super(client, {
            name: 'loop',
            aliases: ['repetir']
        })
    }

    async run({ channel, guild, author }) {
        const embed = new ClientEmbed(author);
        const guildQueue = await this.client.music.module.queue.get(guild.id);
        if (guildQueue) {
            let loopActive = guildQueue.loop ? false : true;
            return channel.send(embed
                .setTitle(loopActive ? 'A auto repetição da queue foi **habilitada**!' : 'A auto repetição da queue foi **desabilitada**!')
            ).then(() => guildQueue.queueLoop(loopActive))
        } else {
            return channel.send(embed
                .setTitle('Não estou tocando nada no **momento**')
                .setColor(process.env.ERR_COLOR)
            )
        }
    }
}