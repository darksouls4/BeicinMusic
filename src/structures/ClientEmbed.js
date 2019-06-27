const { RichEmbed } = require("discord.js");

module.exports = class ClientEmbed extends RichEmbed {
    constructor(user, data = {}) {
        super(data);
        this.setColor(process.env.COLOR_EMBED).setTimestamp();
        if (user) this.setFooter(user.username, user.displayAvatarURL)
    }
}