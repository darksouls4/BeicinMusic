const { Client, Collection } = require("discord.js");
const loaders = require("./loaders/");

/**
 * @constructor
 */
module.exports = class BeicinMusic extends Client {
    /**
     * @param {object} options As opções especificadas para o client do Bot 
     */
    constructor(options = {}) {
        super(options)
        this.prefix = 'bm!'
        this.managers = ['id1', 'id2'] // Esse é o item que você deve localizar!
        this.collection = Collection
    }

    /**
     * @param {number} loadeds número dos modulos que foram carregados com sucesso
     */
    async login(loadeds = 0) {
        // loadeds não precisa ser passado como parâmetro na index.
        const token = process.env.TOKEN || this.Error('No token identify!');
        const LOADERS = Object.values(loaders);

        return super.login(token).then(async () => {
            for (let loader of LOADERS) {
                try {
                    loader = new loader(this);
                    await loader.call();
                    ++loadeds
                } catch (err) {
                    this.LOG_ERR(err, loader.name)
                }
            }
            this.LOG(`I successfully loaded ${loadeds} modules from ${LOADERS.length} modules`, 'LOADERS');
        })
    }

    LOG(...args) {
        const Sendlog = (args.length > 1 ? `\x1b[32m${args.map(t => `[${t}]`).slice(1).join(' ')}\x1b[0m` : '') + ` \x1b[34m${args[0]}\x1b[0m`
        console.log(Sendlog)
    }

    LOG_ERR(...args) {
        const error = args[0];
        const Sendlog = (args.length > 1 ? args.slice(1).map(t => `\x1b[33m[${t}]\x1b[0m`) : '')
        console.error('\x1b[31m[ERROR]\x1b[0m', ...Sendlog, error);
    }

    Error(err) {
        throw new Error(err);
    }
}