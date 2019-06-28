const { Command, ClientEmbed } = require("../../");

module.exports = class Jump extends Command {
    constructor(client) {
        super(client, {
            name: 'jump',
            aliases: ['jm', 'pular']
        })
    }

    async run({ message, args, channel, guild, author }) {
        const embed = new ClientEmbed(author);
        const guildQueue = await this.client.music.module.queue.get(guild.id);
        if (guildQueue && guildQueue.songs.length) {
            if (args[0]) {
                let jump = Number(args[0]);
                if (!(!isNaN(Number(args[0])))) return channel.send(embed
                    .setTitle(`Por favor insira um valor numérico! de **1 á ${guildQueue.songs.length}**`)
                    .setColor(process.env.ERR_COLOR)
                );
                jump = Math.round(jump);
                if (jump > guildQueue.songs.length || jump < 1) return channel.send(embed
                    .setTitle(`Por favor insira um número de **1 á ${guildQueue.songs.length}**!`)
                    .setColor(process.env.ERR_COLOR)
                );
                return message.react('⤴').then(() => guildQueue.jump(jump));
            } else {
                return channel.send(embed
                    .setTitle(`Por favor insira o numero da música para eu pular! **[1 á ${guildQueue.songs.length}]**`)
                    .setColor(process.env.ERR_COLOR)
                )
            }
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