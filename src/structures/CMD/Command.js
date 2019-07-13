const ClientEmbed = require("../ClientEmbed.js");

module.exports = class Command {
    constructor(client, options) {
        this.client = client
        this.name = options.name || 'Nenhum'
        this.aliases = options.aliases || []
        this.djRoleNeed = options.roleDj != undefined ? options.roleDj : false
        this.managerNeed = options.managerPermission != undefined ? options.managerPermission : false
    }

    async _run(command, context, { author, member, channel } = context) {
        try {
            if (this.managerNeed && !this.client.managers.includes(author.id)) return channel.send(new ClientEmbed(author)
                .setTitle('Ocorreu um erro!')
                .setColor(process.env.ERR_COLOR)
                .setDescription('Desculpe, você precisa ser **bot manager** para executar esse comando!')
            )
            else {
                if (this.djRoleNeed
                    && !(member.roles.find(role => role.name.toLowerCase() == 'dj'.toLowerCase()) ||
                        member.hasPermission('MANAGE_GUILD')
                    )
                ) return channel.send(new ClientEmbed(author)
                    .setTitle('Ocorreu um erro!')
                    .setColor(process.env.ERR_COLOR)
                    .setDescription('Desculpe, você precisa ter a role **dj** ou ter a permissão **gerenciar servidor** para executar esse comando!')
                )
            }
            return await command.commandHelp.run(context);
        } catch (e) {
            this.client.LOG_ERR(e, 'RunCommand', command.commandHelp.name)
            return channel.send(new ClientEmbed(author)
                .setTitle('Ocorreu um erro ao executar o comando!')
                .setDescription(e.message)
                .setColor(process.env.ERR_COLOR)
            )
        }
    }

    verifyVoice(guild, channel, author, voiceChannel, playCommand = false) {
        const embed = new ClientEmbed(author);
        const guildQueue = this.client.music.module.queue.get(guild.id);

        if (voiceChannel && playCommand && !guildQueue && !(voiceChannel.joinable && voiceChannel.speakable)) {
            const err = voiceChannel.joinable ? 'falar' : 'conectar';
            channel.send(embed
                .setTitle(`Não possuo permissões necessárias para ${err} nesse canal de voz!`)
                .setColor(process.env.ERR_COLOR)
            )
            return false;
        }

        if (!voiceChannel) {
            let response = 'Por favor conecte-se a um canal de voz!'
            if (guildQueue) response = 'Por favor conecte-se ao canal de voz que eu estou!'
            channel.send(embed
                .setTitle(response)
                .setColor(process.env.ERR_COLOR)
            )
            return false;
        } else if (guildQueue) {
            if (guildQueue.voiceChannel.id !== voiceChannel.id) {
                channel.send(embed
                    .setTitle('Por favor conecte-se ao canal de voz que eu estou!')
                    .setColor(process.env.ERR_COLOR)
                )
                return false;
            }
        }
        return true;
    }
}