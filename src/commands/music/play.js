const { Command, ClientEmbed } = require("../../");
const { Util } = require("discord.js");

module.exports = class Play extends Command {
    constructor(client) {
        super(client, {
            name: 'play',
            aliases: ['tocar', 'p']
        })
    }

    async run({ voiceChannel, channel, guild, author, args }) {
        const trueResult = await this.verifyVoice(guild, channel, author, voiceChannel);
        if (!trueResult) return;

        const paramUrl = /(?:www\.)?(?:youtu\.be|youtube\.com)/;
        const search = args.slice(0).join(' ');
        const embed = new ClientEmbed(author);

        if (search) {
            let result = false;
            if (search.match(paramUrl)) {
                const url = args.find(m => m.match(paramUrl));
                result = await this.client.music.utils.getUrlSong(url);
            } else {
                result = await this.client.music.utils.getSongByTitle(Util.escapeMarkdown(search));
            }

            if (result.length) {
                let queueBreak = this.client.music.module.queue.get(guild.id);
                try {
                    this.client.music.module.play(result, guild, voiceChannel, author);
                    let guildQueue = this.client.music.module.queue.get(guild.id);
                    if (queueBreak) return;
                    return this.responseMusic(guildQueue, channel);
                } catch (err) {
                    return channel.send(embed
                        .setTitle('Ocorreu um erro!')
                        .setDescription(err.message)
                        .setColor(process.env.ERR_COLOR)
                    )
                }
            } else {
                return channel.send(embed
                    .setTitle('Ocorreu um erro!')
                    .setDescription('Não consegui encontrar nenhum resultado para a música inserida!')
                    .setColor(process.env.ERR_COLOR)
                )
            }
        } else {
            return channel.send(embed
                .setTitle('Ocorreu um erro!')
                .setDescription('Por favor insira o **link** ou o **nome** da música desejada! (Youtube)')
                .setColor(process.env.ERR_COLOR)
            )
        }
    }

    responseMusic(queue, channel) {
        const send = async (e) => { return channel.send(e) };
        const embed = (u, d, c) => {
            const e = new ClientEmbed(u).setDescription(d);
            return c ? e.setColor(process.env.ERR_COLOR) : e;
        }

        queue.on('stop', (u, l) => l || send(embed(u, 'A lista de reprodução acabou!', true)));
        queue.on('start', (s) => send(embed(s.addedBy, `Começando a tocar: **[${s.name}](${s.url})** \`[${s.durationContent}]\``)).then((m) => queue.setLastMesage(m)));
        queue.on('error', (s) => send(embed(s.addedBy, `Ocorreu um erro ao tentar reproduzir a música: **[${s.name}](${s.url})**`, true)));
        queue.on('queue', (s, u) => {
            if (s.length > 1) {
                send(embed(u, `Adicionei **${s.length}** musicas na queue!`)).then(m => m.delete({ timeout: 30000 }));
            } else {
                send(embed(u, `Adicionei a música **[${s[0].name}](${s[0].url})** na queue!`)).then(m => m.delete({ timeout: 20000 }));
            }
        })
    }
}