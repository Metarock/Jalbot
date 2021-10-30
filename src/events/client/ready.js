const chalk = require('chalk');

module.exports = (client) => {
    client.manager.init(client.user.id);
    console.log(`${chalk.bold.green('[BOT]')} Logged in as ${client.user.username}#${client.user.discriminator}.`);
};