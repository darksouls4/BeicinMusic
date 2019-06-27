module.exports = class MusicUtils {
    constructor(client) {
        this.client = client
    }

    loadUtils() {
        this.client.music.utils = this
    }

    async getUrlSong(url) {
        if (!this.client.music.api || !this.client.music.module) throw new Error('No YoutubeApi loaded!');
        const songs = [];

        if (url.includes('playlist?list=')) {
            try {
                const playlist = await this.client.music.api.getPlaylist(url).then(async res => {
                    return await res.getVideos()
                });
                await Promise.all(playlist.map(async song => {
                    try {
                        song = await this.client.music.api.getVideoByID(song.id).then(res => { return res });
                    } catch (e) { return false }
                    songs.push({
                        name: song.title,
                        url: `https://www.youtube.com/watch?v=${song.id}`,
                        thumbnail: song.thumbnails.default,
                        channelOwner: song.raw.snippet.channelTitle,
                        tags: song.raw.snippet.tags,
                        publishedAt: song.publishedAt,
                        duration: song.duration,
                        live: song.raw.snippet.liveBroadcastContent == 'live' ? true : false
                    })
                }))
            } catch (e) { }
        } else {
            try {
                const song = await this.client.music.api.getVideo(url).then(res => { return res });
                if (song.raw.snippet.liveBroadcastContent != 'live') {
                    songs.push({
                        name: song.title,
                        url: `https://www.youtube.com/watch?v=${song.id}`,
                        thumbnail: song.thumbnails.default,
                        channelOwner: song.raw.snippet.channelTitle,
                        tags: song.raw.snippet.tags,
                        publishedAt: song.publishedAt,
                        duration: song.duration,
                        live: song.raw.snippet.liveBroadcastContent == 'live' ? true : false
                    })
                }
            } catch (e) { }
        }
        if (!songs.length) return false;
        return songs;
    }

    async getSongByTitle(searsh) {
        if (!this.client.music.api || !this.client.music.module) throw new Error('No YoutubeApi loaded!');
        let song = await this.client.music.api.searchVideos(searsh, 1).then(res => { return res });
        if (!song.length) return false;
        song = await this.client.music.api.getVideoByID(song[0].id).then(res => { return res });
        if (song.raw.snippet.liveBroadcastContent != 'live') {
            let opts = {
                name: song.title,
                url: `https://www.youtube.com/watch?v=${song.id}`,
                thumbnail: song.thumbnails.default,
                channelOwner: song.raw.snippet.channelTitle,
                tags: song.raw.snippet.tags,
                publishedAt: song.publishedAt,
                duration: song.duration,
                live: song.raw.snippet.liveBroadcastContent == 'live' ? true : false
            }
            return [opts];
        }
        return false;
    }
}