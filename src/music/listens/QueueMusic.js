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

    get queueFullDuration() {
        let arr = this.songs.concat([this.songPlaying]);
        for (let i = 0; i < arr.length; i++) arr[i] = arr[i].ms;
        let calcInSeconds = (arr.reduce((a, b) => a + b, 0)) - (this.dispatcher.streamTime / 1000);
        return moment.duration(calcInSeconds, 'seconds').format('hh:mm:ss', { stopTrim: 'm' });
    }

    get nowDuration() {
        let stopTrim = this.songPlaying.durationContent.split(':').length > 2 ? 'h' : 'm';
        return moment.duration(this.dispatcher.streamTime, 'milliseconds').format('hh:mm:ss', { stopTrim });
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

    resetQueue() {
        this.songs.splice(0);
        this.songsBackup.splice(0);
        this.loop = false;
        this.volume = 120
    }

    async volUpdate(vol) {
        this.volume = vol;
        let volume = this.setVol(vol);
        return this.dispatcher.setVolume(volume);
    }
}