module.exports = class UrlParameters {
    static typeUrl(url, type = false) {
        const regexp = [
            {
                type: 'spotifyTrack',
                tests: [
                    /^(?:https?:\/\/|)?(?:www\.)?open\.spotify\.com\/track\/([a-zA-Z\d-_]+)/,
                    /spotify:track:([a-zA-Z\d-_]+)$/
                ]
            }, {
                type: 'spotifyPlaylist',
                tests: [
                    /^(?:https?:\/\/|)?(?:www\.)?open\.spotify\.com(?:\/user\/[a-zA-Z\d-_]+)?\/playlist\/([a-zA-Z\d-_]+)/,
                    /^spotify(?::user:[a-zA-Z\d-_]+)?:playlist:([a-zA-Z\d-_]+)/
                ]
            }, {
                type: 'youtubeTrack',
                tests: [
                    /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/
                ]
            },
            {
                type: 'youtubePlaylist',
                tests: [
                    /https?:\/\/(www.youtube.com|youtube.com)\/playlist\?list=/g
                ]
            }
        ];

        for (let t of regexp) {
            for (let test of t.tests) {
                if (url.match(test)) return type = t.type;
            }
        }
        return type;
    }

    static getDurationInSeconds(duration, sec = 0) {
        const durationTags = [
            {
                name: 'years',
                parse: (y) => y * 31536000
            }, {
                name: 'months',
                parse: (m) => m * 2592000
            }, {
                name: 'weeks',
                parse: (w) => w * 604800
            }, {
                name: 'days',
                parse: (d) => d * 86400
            }, {
                name: 'hours',
                parse: (h) => h * 3600
            }, {
                name: 'minutes',
                parse: (m) => m * 60
            }, {
                name: 'seconds',
                parse: (s) => s
            }
        ]
        for (let dTag of durationTags) {
            if (duration[dTag.name]) {
                sec += dTag.parse(duration[dTag.name])
            }
        }
        return sec;
    }
}