const { Command, ClientEmbed } = require("../../");
const moment = require("moment")

moment.locale('pt-BR');

const getSong = (args, queue) => {
    args = Array.isArray(args) ? args.join(' ') : args;
    let type = 'name';
    let songs = queue.songs.concat([queue.songPlaying]);
    if (!isNaN(args)) type = 'number'
    else type = 'name';
    switch (type) {
        case 'name': {
            return songs.find(({ name }) => (name.toLowerCase() == args.toLowerCase()
                || name.toLowerCase().includes(args.toLowerCase()))
            )
        }
        case 'number': {
            return songs[(Number(args) - 1)]
        }
    }
}

module.exports = class SearchSong extends Command {
    constructor(client) {
        super(client, {
            name: 'search',
            aliases: ['searchsong'],
            roleDj: false
        })
    }

    async run({ args, channel, guild, author }) {
        const embed = new ClientEmbed(author);
        const guildQueue = await this.client.music.module.queue.get(guild.id);
        if (guildQueue && guildQueue.songPlaying) {
            if (args[0]) {
                const song = await getSong(args, guildQueue);
                if (song) {
                    return channel.send(embed
                        .addField('Nome da Música', `[${song.name}](${song.url})`)
                        .addField('Adicionado Por', song.addedBy.toString(), true)
                        .addField('Posição na Queue', ([guildQueue.songPlaying].indexOf(song) != -1
                            ? '**Tocando Agora**'
                            : `**${(guildQueue.songs.indexOf(song) + 1)}°**`
                        ))
                        .addField('Canal Postado', `**${song.channelOwner}**`)
                        .addField('Data de Postagem', `**${moment(song.publishedAt).format('LLLL')}**`)
                        .setThumbnail(song.thumbnail.url)
                    )
                } else {
                    return channel.send(embed
                        .setTitle('Desculpe não encontrei nehuma música com o que você inseriu!')
                    )
                }
            } else {
                return channel.send(embed
                    .setTitle('Por favor insira o **nome** ou o **número** da música que deseja obter!')
                )
            }
        } else {
            return channel.send(embed
                .setTitle('Não estou tocando nada no **momento**')
                .setColor(process.env.ERR_COLOR)
            )
        }
    }
}