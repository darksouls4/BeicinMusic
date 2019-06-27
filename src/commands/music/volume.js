const { Command, ClientEmbed } = require("../../");

module.exports = class Volume extends Command {
    constructor(client) {
        super(client, {
            name: 'volume',
            aliases: ['vol']
        })
    }
    async run({ channel, args, guild, author }) {
        const embed = new ClientEmbed(author);
        const guildQueue = await this.client.music.module.queue.get(guild.id);
        if (guildQueue && guildQueue.songPlaying) {
            if (args[0]) {
                let vol = Number(args[0]);
                if (!(!isNaN(Number(args[0])))) return channel.send(embed
                    .setTitle('Por favor insira um valor numérico!')
                    .setColor(process.env.ERR_COLOR)
                );
                if (vol > 300 || vol < 0) return channel.send(embed
                    .setTitle('Por favor insira o volume desejado de **0 á 300**')
                    .setColor(process.env.ERR_COLOR)
                );
                return channel.send(embed
                    .setTitle(`O volume foi alterado para: **${vol}**`)
                ).then(()=> guildQueue.volUpdate(vol));
            } else {
                return channel.send(embed
                    .setTitle('Por favor insira o volume desejado! **[0 - 300]**')
                    .setColor(process.env.ERR_COLOR)
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