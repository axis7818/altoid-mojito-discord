const Discord = require('discord.js');

function start(TOKEN) {
    const client = new Discord.Client();

    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
    });

    client.on('message', msg => {
        console.log(`Received message: ${msg.content.substr(0, 24)}`);

        if (!msg.author.bot) {
            const cmd = msg.content.split(/\s/)[0].toLowerCase();
            const commands = [statusCommand, startCommand, stopCommand, helpCommand];
            for (const c of commands) {
                if (c.command === cmd) {
                    c(msg);
                    break;
                }
            }
        }

    });

    client.login(TOKEN);

}

/**
 * Get the status of the VM
 */
function statusCommand(msg) {
    msg.reply('status');
}
statusCommand.command = 'status';
statusCommand.helpText = 'Shows the current status of the AltoidMojito VM';

/**
 * Start the VM
 */
function startCommand(msg) {
    msg.reply('start');
}
startCommand.command = 'start';
startCommand.helpText = 'Starts the AltoidMojito VM';

/**
 * Stop the VM
 */
function stopCommand(msg) {
    msg.reply('stop');
}
stopCommand.command = 'stop';
stopCommand.helpText = 'Stops the AltoidMojito VM';

/**
 * Show help information.
 */
function helpCommand(msg) {
    msg.reply(helpText);
}
helpCommand.command = 'help';
helpCommand.helpText = 'Shows this help message';

const allCommands = [helpCommand, statusCommand, startCommand, stopCommand];

const helpText = `Hi! I am the AltoidMojito discord bot. I respond to the following commands:\n\n`
    + allCommands.map(cmd => `**${cmd.command}**: ${cmd.helpText}`).join('\n');


module.exports = { start };
