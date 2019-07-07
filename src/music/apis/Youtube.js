const SongParameters = require("../utils/SongParameters.js");
const YouTube = require('simple-youtube-api');
const { Util } = require("discord.js");

const getOpts = (song) => {
    if (!song) return [];
    const { maxres, high, medium, standard } = song.thumbnails;
    return {
        name: Util.escapeMarkdown(song.title),
        url: `https://www.youtube.com/watch?v=${song.id}`,
        ms: SongParameters.getDurationInSeconds(song.duration) * 1000,
        id: song.id,
        thumbnail: maxres || high || medium || standard || song.thumbnails['default'],
        channelOwner: song.raw.snippet.channelTitle,
        tags: song.raw.snippet.tags,
        publishedAt: song.publishedAt,
        duration: song.duration,
        live: song.raw.snippet.liveBroadcastContent == 'live' ? true : false
    }
}

module.exports = class YoutubeSearch {
    constructor(client) {
        this.client = client
        this.api = false
        this.name = 'YoutubeApi'
    }

    async load(err = false) {
        try {
            this.api = new YouTube(process.env.YOUTUBE_API_KEY);
        } catch (e) {
            this.client.LOG_ERR(e, this.name)
            err = true
        } finally {
            if (err) this.api = false;
            else {
                this.client.music.apis['youtube'] = this;
            }
        }
        return true;
    }

    async getUrlSong(url, type) {
        if (!this.api || !this.client.music.module) throw new Error('No YoutubeApi loaded!');

        switch (type) {
            case 'video': {
                const song = await this.api.getVideo(url).catch(() => false);
                return song ? [getOpts(song)] : [];
            }
            case 'playlist': {
                const songs = [];
                const playlist = await this.api.getPlaylist(url)
                    .then(res => res.getVideos())
                    .catch(() => []);
                if (playlist.length) {
                    await Promise.all(playlist.map(async (song) => {
                        song = await this.api.getVideoByID(song.id).catch(() => false);
                        if (song) return songs.push(getOpts(song));
                    }))
                }
                return songs;
            }
            default: return [];
        }
    }

    async getSongByTitle(search) {
        if (!this.api || !this.client.music.module) throw new Error('No YoutubeApi loaded!');
        const song = await this.api.searchVideos(Util.escapeMarkdown(search), 1);
        return (song.length
            ? [getOpts(await this.api.getVideoByID(song[0].id))] : []
        )
    }
}