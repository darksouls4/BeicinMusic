const SongParameters = require("./utils/SongParameters.js");
const { readdirSync } = require("fs");

module.exports = class MusicUtils {
    constructor(client) {
        this.client = client
    }

    async loadUtils(dirPath = 'src/music/apis') {
        const apis = await readdirSync(dirPath);

        for (let api of apis) {
            api = new (require(`./apis/${api}`))(this.client);
            api.load().then(() => this.client.LOG('Api was successfully loaded!', api.name));
        }
    }

    async playUrl(url) {
        switch (SongParameters.typeUrl(url)) {
            case 'youtubeTrack': {
                return await this.client.music.apis.youtube.getUrlSong(url, 'video');
            }
            case 'youtubePlaylist': {
                return await this.client.music.apis.youtube.getUrlSong(url, 'playlist');
            }
            case 'spotifyTrack': {
                return await this.client.music.apis.spotify.getSongById(url.includes(':track:')
                    ? url.split(':track:')[1]
                    : url.split('/track/')[1]
                )
            }
            case 'spotifyPlaylist': {
                return await this.client.music.apis.spotify.getPlaylistById(url.includes(':playlist:')
                    ? url.split(':playlist:')[1]
                    : url.split('/playlist/')[1]
                )
            }
            default: []
        }
    }
}