const Guild = require("./Guild.js");
const moment = require("moment");

require("moment-duration-format");

module.exports = class MusicQueue extends Guild {
    constructor(guild, channel, client) {
        super(guild, client);
        this.voiceChannel = channel
        this.client = client
        this.guild = guild
        this.songs = []
        this.volume = 200
        this.playing = false
        this.songPlaying = false
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

    async volUpdate(vol) {
        this.volume = vol;
        vol = this.setVol(vol);
        let VOL1 = vol + (vol / 2);
        this.dispatcher.setVolumeLogarithmic(VOL1 + (VOL1 / 5));
        await new Promise((resolve, reject) => setTimeout(resolve, 2000));
        this.dispatcher.setVolumeLogarithmic(VOL1);
        return this.dispatcher.setVolumeLogarithmic(vol);
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
}