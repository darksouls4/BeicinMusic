const { EventEmitter } = require("events");
const ytdlDiscord = require('ytdl-core-discord');
const moment = require("moment");

const streamOptions = {
    fec: true,
    seek: 0,
    passes: 10,
    type: 'opus',
    bitrate: 1024,
    highWaterMark: 36
}

module.exports = class GuildMusic extends EventEmitter {
    constructor(guild, client) {
        super();
        this.client = client
        this.guild = guild
        this.connection = false
        this.dispatcher = false

        this.on('stopForce', () => {
            this.removeAllListeners();
            this.deleteLastMessage();
            this.dispatcher.destroy();
            this.connection.disconnect();
            this.client.music.module.queue.delete(this.guild.id);
            return this.client.emit('updatePresenceForMusic');
        });
        this.on('stop', async () => {
            if (this._queue.loop) return this._queue.songsBackup && this.restartPlayerForLoop();
            this.removeAllListeners();
            this.client.music.module.queue.delete(this.guild.id);
            return this.client.emit('updatePresenceForMusic');
        });
    }

    async play(song) {
        if (!song || !song.url) throw new Error('No song identify');
        streamOptions['volume'] = this._queue.setVol(this._queue.volume);
        this._queue.songs.shift();

        try {
            const stream = ytdlDiscord(song.url);
            stream.on('error', () => {
                this.emit('error', song);
                this.viewQueueContent();
            });
            this.dispatcher = await this.connection.play(stream, streamOptions);
        } catch (e) {
            this.emit('error', song, e);
            return this.viewQueueContent();
        }

        this.emiters(song);
        this._queue.playing = true
        this._queue.songPlaying = song

        if (!this._queue.modifyVolume) this.dispatcher.setVolumeLogarithmic(1.2);
        return this.client.emit('updatePresenceForMusic');
    }

    async goPlay(num) {
        let song = this._queue.songs[num];
        if (!song || !song.url) throw new Error('No song identify');
        this.connection = await this._queue.voiceChannel.join();
        return this.play(song);
    }

    emiters(s) {
        if (this.dispatcher) {
            this.dispatcher.on('start', () => this.emit('start', s));
            this.dispatcher.on('error', () => this.emit('error', s));
            this.dispatcher.on('finish', () => {
                this.deleteLastMessage();
                this.viewQueueContent();
            });
        }
    }

    deleteLastMessage() {
        return this._queue.lastMessage && this._queue.lastMessage.delete().catch(() => { });
    }

    setSongDuration(s) {
        return moment.duration(s.ms, 'milliseconds').format('hh:mm:ss', { stopTrim: 'm' });
    }

    async viewQueueContent() {
        let queueSong = this._queue.songs;
        if (!queueSong.length) {
            return this.emit('stop', this._queue.songPlaying.addedBy, this._queue.loop);
        }
        return this.play(queueSong[0]);
    }

    async restartPlayerForLoop() {
        const songs = this._queue.songsBackup;
        await Promise.all(songs.map(song => this._queue.songs.push(song)));
        return this.goPlay(0);
    }

    async pushSongs(songs, addedBy, returnPlayer = false) {
        await Promise.all(songs.map(song => {
            song['addedBy'] = addedBy;
            song['durationContent'] = this.setSongDuration(song);
            this._queue.songs.push(song);
            this._queue.songsBackup = this._queue.songsBackup.concat([song]);
        }));
        if (returnPlayer) this.play(this._queue.songs[0]);
        return this.emit('queue', songs, addedBy);
    }

    errorResponse() {
        const songsBySkip = this._queue.songs.size;
        if (songsBySkip) {
            return this.goPlay(0);
        } else {
            if (this._queue.songsBackup.indexOf(this._queue.songPlaying) != -1) {
                this._queue.songsBackup.splice(this.songsBackup.indexOf(this._queue.songPlaying), 1);
            }
            return this.restartPlayerForLoop();
        }
    }
}