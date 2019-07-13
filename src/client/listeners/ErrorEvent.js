const ClientEmbed = require("../../structures/ClientEmbed.js");

module.exports = class MessageEvent {
    constructor(client) {
        this.client = client
        this.name = 'error'
    }

    ON(err) {
        (() => {
            console.log('Um erro aconteceu!!!\n', err);
            err = null;
        })()

        const streams = this.client.music.module.queue.size;
        if (streams) {
            return this.client.music.module.queue.forEach((queue) => {
                const channel = queue.msgChannel;
                if (channel && this.client.channels.get(channel.id)) {
                    channel.send(new ClientEmbed(this.client.user)
                        .setTitle('Ocorreu um erro inesperado na reprodução!')
                        .setDescription('Irei reiniciar a reprodução de onde parei')
                    )
                }
                return queue.errorResponse();
            })
        } else {
            process.exit(1);
        }
    }
}