const snekfetch = require('snekfetch');

const TOKEN_URL = 'https://accounts.spotify.com/api/token'
const API_URL = 'https://api.spotify.com/v1'

module.exports = class SpotifySearch {
    constructor(client) {
        this.client = client
        this.api = false
        this.token = false
        this.name = 'SpotifyApi'
    }

    get isTokenExpired() {
        return this.token ? this.token.expiresAt - new Date() <= 0 : true
    }

    get tokenHeaders() {
        return this.token ? { 'Authorization': `${this.token.tokenType} ${this.token.accessToken}` } : {}
    }

    get credentialHeaders() {
        const credential = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')
        return { 'Authorization': `Basic ${credential}`, 'Content-Type': 'application/x-www-form-urlencoded' }
    }

    async load(err = false) {
        try {
            this.api = this;
        } catch (e) {
            this.client.LOG_ERR(e, this.name)
            err = true
        } finally {
            if (err) this.api = false;
            else {
                this.client.music.apis['spotify'] = this;
            }
        }
        return true;
    }

    async getPlaylistById(id) {
        try {
            let tracks = [];
            const getPlaylist = await this.request(`/playlists/${id}`);
            if (!getPlaylist) return [];

            for (let song of getPlaylist.tracks.items) {
                try {
                    song = await this.client.music.apis.youtube.getSongByTitle(song.track.name);
                    if (song.length) tracks = tracks.concat(song);
                } catch (e) { }
            }

            return tracks;
        } catch (e) {
            return [];
        }
    }

    async getSongById(id) {
        try {
            const song = await this.request(`/tracks/${id}`);
            if (!song) return [];
            return await this.client.music.apis.youtube.getSongByTitle(song.name);
        } catch (e) {
            return [];
        }
    }

    async request(endpoint, queryParams = {}) {
        if (this.isTokenExpired) await this.getToken()
        return await snekfetch.get(`${API_URL}${endpoint}`).query(queryParams).set(this.tokenHeaders).then(r => r.body)
    }

    async getToken() {
        const {
            access_token: accessToken,
            token_type: tokenType,
            expires_in: expiresIn
        } = await snekfetch.post(TOKEN_URL).set(this.credentialHeaders).query({ 'grant_type': 'client_credentials' }).then(r => r.body);
        const now = new Date();

        this.token = {
            accessToken,
            tokenType,
            expiresIn,
            expiresAt: new Date(now.getTime() + (expiresIn * 1000))
        }
    }
}