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
        if (guildQueue && guildQueue.songPlaying) {
            return channel.send(embed
                .setTitle(`Lista de Reprodução - **${guild.name}**`)
                .setDescription(
                    [`🎵 Tempo estimado de Reprodução: **\`[${guildQueue.queueFullDuration}]\`**`,
                    `<a:wait:585264392711438344> Loop: **\`${guildQueue.loop ? 'Ativado' : 'Desativado'}\`**`,
                    `▶ Atual: **\`[${guildQueue.nowDuration}/${guildQueue.songPlaying.durationContent}]\`** - **[${guildQueue.songPlaying.name}](${guildQueue.songPlaying.url})**`,
                    '\n🎶 Lista de Reprodução\n' + (!guildQueue.songs.length
                        ? 'Nenhuma música após a atual.'
                        : guildQueue.songs.length <= 5
                            ? guildQueue.songs.map((s, n) => `\`${n + 1}.\` - **[${s.name}](${s.url})**, por **${s.addedBy.toString()}**`).join('\n')
                            : guildQueue.songs.map((s, n) => `\`${n + 1}.\` - **[${s.name}](${s.url})**, por **${s.addedBy.toString()}**`).slice(0, 5).join('\n')
                            + `\nE mais **${(guildQueue.songs.length - 5)}**...`
                    )].join('\n')
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