module.exports = class BotManagers {
    constructor(client) {
        this.client = client
        this.name = 'BotManagers'
    }

    call() {
        return this.addManagers()
            .then(() => this.client.LOG('loaded BotManagers was successfully', this.name))
    }

    async addManagers(role = process.env.managersROLE) {
        if (!role) throw new Error('No role(s) identify');

        const guild = this.client.guilds.get(process.env.guildID);
        const mangeROLES = (role.includes(']') && role.includes('[')
            ? JSON.parse(role)
            : role
        )

        if (Array.isArray(mangeROLES)) this.arrayParse(guild, mangeROLES);
        else {
            role = guild.roles.get(roles);
            if (role) {
                role.members.forEach((m) => {
                    this.client.managers.push(m.user.id)
                })
            }
        }
        return (() => {
            (guild.members
                .filter((m) => !m.user.bot && m.hasPermission('ADMINISTRATOR') && !this.client.managers.includes(m.user.id))
                .forEach((m) => this.client.managers.push(m.user.id))
            )
        })()
    }

    arrayParse(guild, roles) {
        const users = []
        for (let role of roles) {
            role = guild.roles.get(role);
            if (role) {
                role.members.forEach((m) => {
                    users.push(m.user.id)
                })
            }
        }
        return users.forEach((u) => {
            this.client.managers.push(u);
        })
    }
}