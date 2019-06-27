const { EventEmitter } = require("events");

/* 
    Utilizar um dos dois modulos abaixo, para obter fluxo da stream.
    Recomendado: 'youtube-dl'
    Obs: caso for utilizar 'ytdl-core' use as opções listadas abaixo!.
*/

// const ytdl = require("ytdl-core");
const YoutubeDl = require('youtube-dl');

const streamOptions = {
    seek: 0,
    passes: 0,
    bitrate: 120000
}

const ytdlOptions = {
    filter: 'audioonly',
    quality: 'highestaudio'
}

module.exports = class GuildMusic extends EventEmitter {
    constructor(guild, client) {
        super();
        this.client = client
        this.guild = guild
        this.connection = false
        this.dispatcher = false

        this.on('stopForce', () => {
            this.dispatcher.end(true);
            this.removeAllListeners();
            this.connection.disconnect();
            this.client.music.module.queue.delete(this.guild.id);
        });
        this.on('stop', async () => {
            this.dispatcher.end(true);
            this.removeAllListeners();
            this.client.music.module.queue.delete(this.guild.id);
        });
    }

    async play(song) {
        if (!song || !song.url) throw new Error('No song identify');
        streamOptions['volume'] = this._queue.setVol(this._queue.volume);
        // ytdl(song.url, ytdlOptions), streamOptions);
        this.dispatcher = await this.connection.playStream(YoutubeDl(song.url), streamOptions);
        this.emiters(song);
        this._queue.playing = true
        this._queue.songPlaying = song
    }

    async goPlay(num) {
        let song = this._queue.songs[num];
        if (!song || !song.url) throw new Error('No song identify');
        this.connection = await this._queue.voiceChannel.join();
        return this.play(song);
    }

    emiters(s) {
        if (this.dispatcher) {
            this.dispatcher.on('end', (s) => {
                if (s !== true) this.viewQueueContent();
            });
            this.dispatcher.on('start', () => this.emit('start', s));
        }
    }

    setSongDuration(s) {
        const durationTags = ['weeks', 'years', 'months', 'days', 'hours', 'minutes', 'seconds'];
        let durationTotal = []
        for (let tag of durationTags) {
            let inTag = s.duration[tag];
            if (inTag) {
                durationTotal.push(inTag > 9 ? inTag : `0${inTag}`)
            }
        }
        return durationTotal.map(d => d).join(':');
    }

    async viewQueueContent() {
        let UltSong = this._queue.songs[0];
        this.emit('end', UltSong);
        this._queue.songs.shift();

        let queueSong = this._queue.songs;
        if (!queueSong.length) {
            return this.emit('stop', UltSong.addedBy);
        }
        queueSong = queueSong[0]
        return this.play(queueSong);
    }

    async pushSongs(songs, addedBy, returnPlayer = false) {
        await Promise.all(songs.map(song => {
            song['addedBy'] = addedBy;
            song['durationContent'] = this.setSongDuration(song);
            this._queue.songs.push(song);
        }));
        if (returnPlayer) this.play(this._queue.songs[0]);
        return this.emit('queue', songs, addedBy);
    }
}