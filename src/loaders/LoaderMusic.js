module.exports = class MusicUtils {
    constructor(client) {
        this.client = client
        this.name = 'LoaderMusic'
        this.music = {
            module: false,
            utils: false,
            apis: {}
        }
    }

    async call() {
        this.client.music = this.music;
        return this.loaderModule()
            .then(() => this.client.LOG('LoaderMusicUtils was loaded!', this.name))
    }

    loaderModule() {
        const module = new (require("../music/MusicPlayer.js"))(this.client);
        const utils = new (require("../music/MusicUtils.js"))(this.client);

        this.client.music.module = module;
        this.client.music.utils = utils;
        return this.client.music.utils.loadUtils();
    }
}