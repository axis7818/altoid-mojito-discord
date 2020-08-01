const Discord = require('discord.js');
const Messages = require('./messages');
const package = require('./package.json');

require('./commands/status');
require('./commands/start');
require('./commands/stop');
require('./commands/roll4chub');
const helpCommand = require('./commands/help');
require('./commands/version');

function start(TOKEN) {
    const client = new Discord.Client();
    let commands = [];

    client.on('ready', () => {
        console.log(`AltoidMojito Discord Bot (version=${package.version})`)
        console.log(`Logged in as ${client.user.tag}!`);
        commands = require('./commands/all').commands;
    });

    client.on('message', msg => {
        if (msg.author.bot) {
            return;
        }
        const parts = msg.content.split(/\s/);
        if (parts.length < 2) {
            return;
        }
        if (!isPrefix(parts[0])) {
            return;
        }
        const cmd = parts[1].toLowerCase();
        const c = commands.find(c => c.command === cmd) || helpCommand;
        try {
            const result = c(msg)
            if (result) {
                result.catch(errorHanlder);
            }
        } catch (err) {
            errorHanlder(err);
        }
    });

    client.login(TOKEN);
}

module.exports = { start };

function errorHanlder(err) {
    console.error(err);
    msg.reply(Messages.fallbackErrorMessage);
}


function isPrefix(x) {
    return !!Messages.prefix.find(p => p === x.trim().toLowerCase());
}
