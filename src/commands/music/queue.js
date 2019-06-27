const { Command, ClientEmbed } = require("../../");

module.exports = class Queue extends Command {
    constructor(client) {
        super(client, {
            name: 'queue',
            aliases: ['q', 'lista']
        })
    }

    async run({ channel, guild, author }) {
        const embed = new ClientEmbed(author);
        const guildQueue = await this.client.music.module.queue.get(guild.id);
        if (guildQueue && guildQueue.songs) {
            return channel.send(embed
                .setTitle(`Lista de Reprodução - **${guild.name}**`)
                .setDescription(
                    [
                        ('▶ Atual\n' + `**[${guildQueue.songPlaying.name}](${guildQueue.songPlaying.url})**`),
                        ('\n🎶 Lista de Reprodução\n' + (guildQueue.songs.length == 1
                            ? 'Nenhuma música após essa.'
                            : (guildQueue.songs.length - 1) <= 8
                                ? guildQueue.songs.map((s, n) => `\`${n}°\` - **[${s.name}](${s.url})**, por **${s.addedBy.tag}**`).slice(1, 9).join('\n')
                                : guildQueue.songs.map((s, n) => `\`${n}°\` - **[${s.name}](${s.url})**, por **${s.addedBy.tag}**`).slice(1, 9).join('\n')
                                + `\nE mais **${((guildQueue.songs.length - 1) - 8)}**...`
                        ))
                    ].join('\n')
                )
            )
        } else {
            return channel.send(embed
                .setTitle('Não estou tocando nada no **momento**')
                .setColor(process.env.ERR_COLOR)
            )
        }
    }
}