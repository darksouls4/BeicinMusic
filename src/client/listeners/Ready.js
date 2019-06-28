module.exports = class MessageEvent {
    constructor(client) {
        this.client = client
        this.name = 'ready'
    }

    async ON() {
        return this.client.user.setPresence({
            activity: {
                name: 'Online e sossegado!'
            },
            status: 'online'
        })
    }
}