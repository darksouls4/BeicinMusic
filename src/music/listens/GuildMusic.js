const { EventEmitter } = require("events");
const moment = require("moment");

const ytdlDiscord = require('ytdl-core-discord');

const streamOptions = {
    fec: true,
    seek: 0,
    passes: 12,
    type: 'opus',
    bitrate: 524,
    highWaterMark: 32
}

module.exports = class GuildMusic extends EventEmitter {
    constructor(guild, client) {
        super();
        this.client = client
        this.guild = guild
        this.connection = false
        this.dispatcher = false
        this.streamDispatcher = false

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
        this.on('errorInStream', (s, e) => {
            console.log(('StreamError in guild ' + `${this.guild.name}/-ID: ${this.guild.id}`), e);
            this.emit('errorSong', s /*, e */)
            return this.viewQueueContent();
        })
    }

    async play(song) {
        if (!song || !song.url) throw new Error('No song identify');
        streamOptions['volume'] = this._queue.setVol(this._queue.volume);
        this._queue.songs.shift();

        try {
            const stream = await ytdlDiscord(song.url);
            stream.on('error', (e) => this.emit('errorInStream', song, e));
            this.streamDispatcher = await this.dispatcher.play(stream, streamOptions);
            this.streamDispatcher.setFEC(true);
        } catch (e) {
            return this.emit('errorInStream', song, e);
        }

        this.emiters(song);
        this._queue.playing = true
        this._queue.songPlaying = song

        if (!this._queue.modifyVolume) this.streamDispatcher.setVolumeLogarithmic(1.80);
        return this.client.emit('updatePresenceForMusic');
    }

    async goPlay(num) {
        let song = this._queue.songs[num];
        if (!song || !song.url) throw new Error('No song identify');
        this.connection = await this._queue.voiceChannel.join();
        this.dispatcher = this.connection;
        return this.play(song);
    }

    emiters(s) {
        if (this.dispatcher && this.streamDispatcher) {
            this.streamDispatcher.on('start', () => this.emit('start', s));
            this.streamDispatcher.on('error', (e) => this.emit('errorSong', s, e));
            this.streamDispatcher.on('finish', () => {
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
        return this.play(this._queue.songs[0]);
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
}