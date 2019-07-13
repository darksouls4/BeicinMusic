const { QueueMusic } = require("./listens");

module.exports = class MusicPlayer {
    constructor(client) {
        this.client = client
        this.queue = new client.collection
    }

    async play(songs, guild, voiceChannel, channel, addedBy) {
        let guildQueue = this.queue.get(guild.id);

        if (!guildQueue) {
            guildQueue = new (QueueMusic)(guild, voiceChannel, channel, this.client);
            guildQueue.set();
        }

        if (guildQueue.songPlaying) {
            return guildQueue.pushSongs(songs, addedBy)
        } else {
            return this.player(guildQueue, songs, addedBy);
        }
    }

    async player(queue, songs, addedBy) {
        await queue.pushSongs(songs, addedBy);
        return queue.goPlay(0);
    }
}