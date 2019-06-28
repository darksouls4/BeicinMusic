const { Command, ClientEmbed } = require("../../");

module.exports = class Remove extends Command {
    constructor(client) {
        super(client, {
            name: 'remove',
            aliases: ['tirar']
        })
    }

    async run({ args, channel, guild, author }) {
        const embed = new ClientEmbed(author);
        const guildQueue = await this.client.music.module.queue.get(guild.id);
        if (guildQueue && guildQueue.songs.length) {
            if (args[0]) {
                let remove = Number(args[0]);
                if (!(!isNaN(Number(args[0])))) return channel.send(embed
                    .setTitle(`Por favor insira um valor numérico! de **1 á ${guildQueue.songs.length}**`)
                    .setColor(process.env.ERR_COLOR)
                );
                remove = Math.round(remove);
                if (remove > guildQueue.songs.length || remove < 1) return channel.send(embed
                    .setTitle(`Por favor insira um número de **1 á ${guildQueue.songs.length}**!`)
                    .setColor(process.env.ERR_COLOR)
                );
                let song = guildQueue.songs[remove - 1];
                guildQueue.removeOne(remove);
                return channel.send(embed
                    .setDescription(`Removi a música **[${song.name}](${song.url})** da queue!`)
                );
            } else {
                return channel.send(embed
                    .setTitle(`Por favor insira o numero da música para eu remover! **[1 á ${guildQueue.songs.length}]**`)
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