const Discord = require('discord.js');

function start(TOKEN) {
    const client = new Discord.Client();

    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
    });

    client.on('message', msg => {
        console.log(`Received message`, msg);
        if (msg.content === 'ping') {
            msg.reply('pong');
        }
    });

    client.login(TOKEN);

}

module.exports = { start };