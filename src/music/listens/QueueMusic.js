const GuildMusic = require("./GuildMusic.js");
const moment = require("moment");

require("moment-duration-format");

module.exports = class MusicQueue extends GuildMusic {
    constructor(guild, channel, client) {
        super(guild, client);
        this.voiceChannel = channel
        this.client = client
        this.guild = guild
        this.songs = []
        this.songsBackup = []
        this.volume = 150
        this.loop = false
        this.playing = false
        this.songPlaying = false
        this.lastMessage = false
        this.lastMessageId = false
        this.setVol = (vol) => vol / 100;
    }

    get _queue() {
        return this;
    }

    get nowDuration() {
        return moment.duration(this.dispatcher.time, 'milliseconds').format('hh:mm:ss', {
            stopTrim: 'm'
        })
    }

    set() {
        return this.client.music.module.queue.set(this.guild.id, this);
    }

    stop() {
        return this.emit('stopForce');
    }

    skip() {
        return this.dispatcher.end();
    }

    queueLoop(l) {
        this.loop = l;
    }

    clearQueue() {
        return this.songs.splice(0);
    }

    removeOne(num) {
        return this.songs.splice((num - 1), 1);
    }

    jump(num) {
        this.songs = this.songs.splice(num - 1);
        return this.dispatcher.end();
    }

    setLastMesage(msg) {
        this.lastMessage = msg;
        this.lastMessageId = msg.id;
    }

    async volUpdate(vol) {
        this.volume = vol;
        let VOL1 = (this.volume > 250 ? 180 : this.volume > 150 ? 100 : this.volume > 50 ? 100 : 80) / 100;
        vol = this.setVol(vol);
        this.dispatcher.setVolumeLogarithmic(VOL1 + (VOL1 / 5));
        await new Promise((resolve, reject) => setTimeout(resolve, 2000));
        this.dispatcher.setVolumeLogarithmic(VOL1);
        await new Promise((resolve, reject) => setTimeout(resolve, 1000));
        return this.dispatcher.setVolumeLogarithmic(vol);
    }
}