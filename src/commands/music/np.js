const { Command, ClientEmbed } = require("../../");

module.exports = class Nowplaying extends Command {
    constructor(client) {
        super(client, {
            name: 'nowplaying',
            aliases: ['np', 'tocando'],
            roleDj: false
        })
    }

    async run({ args, channel, guild, author }) {
        const embed = new ClientEmbed(author);
        const guildQueue = await this.client.music.module.queue.get(guild.id);
        if (guildQueue && guildQueue.songPlaying) {
            const argsSong = args[0] && !isNaN(args[0]) && guildQueue.songs[(Number(args[0]) - 1)];
            const { song, footer, duration, timestamp } = {
                song: argsSong || guildQueue.songPlaying,
                footer: argsSong
                    ? `Tocando agora: ${guildQueue.songPlaying.name}`
                    : author.username,
                duration: argsSong ? false : true,
                timestamp: argsSong ? false : true
            }
            const songDuration = this.getDuration(song, guildQueue, duration);
            return channel.send(new ClientEmbed(author, timestamp)
                .setDescription(`**[${song.name}](${song.url})**`)
                .addField('Adicionado Por', song.addedBy.toString(), false)
                .addField('Duração', songDuration, true)
                .addField('Posição na Queue', argsSong ? `**\`${(guildQueue.songs.indexOf(argsSong) + 1)}°\`**` : '**\`Tocando Agora\`**', true)
                .setFooter(footer, author.displayAvatarURL())
                .setImage(song.thumbnail.url)
            )
        } else {
            return channel.send(embed
                .setTitle('Não estou tocando nada no **momento**')
                .setColor(process.env.ERR_COLOR)
            )
        }
    }

    getDuration(s, q, d) {
        return d ? `**\`[${q.nowDuration}/${s.durationContent}]\`**` : `**\`[${s.durationContent}]\`**`;
    }
}