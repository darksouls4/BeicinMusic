const { Command, ClientEmbed } = require("../../");

module.exports = class Nowplaying extends Command {
    constructor(client) {
        super(client, {
            name: 'nowplaying',
            aliases: ['np', 'tocando']
        })
    }

    async run({ channel, guild, author }) {
        const embed = new ClientEmbed(author);
        const guildQueue = await this.client.music.module.queue.get(guild.id);
        if (guildQueue && guildQueue.songPlaying) {
            const song = guildQueue.songPlaying;
            const duration = this.getDuration(song, guildQueue);
            return channel.send(embed
                .setDescription(`Tocando Agora: **[${song.name}](${song.url})**`)
                .addField('Adicionado Por', song.addedBy.toString(), true)
                .addField('Duração', duration, true)
                .setThumbnail(song.thumbnail.url)
            )
        } else {
            return channel.send(embed
                .setTitle('Não estou tocando nada no **momento**')
                .setColor(process.env.ERR_COLOR)
            )
        }
    }

    getDuration(s, q) {
        return `\`[${q.nowDuration}/${s.durationContent}]\``
    }
}