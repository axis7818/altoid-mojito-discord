const Discord = require('discord.js');
const Messages = require('./messages');
const package = require('../package.json');
const helpCommand = require('./commands/help');
const commands = require('./commands/all');

function start(TOKEN) {
	const client = new Discord.Client();

	client.on('ready', () => {
		console.log(`AltoidMojito Discord Bot (version=${package.version})`);
		console.log(`Logged in as ${client.user.tag}!`);
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
			const result = c(msg);
			if (result) {
				result.catch((err) => errorHanlder(msg, err));
			}
		} catch (err) {
			errorHanlder(msg, err);
		}
	});

	client.login(TOKEN);

	// TODO: start polling the server
	// If it has been running for 12 hours, and no one is logged in,
	// Then send a message to Cameron
}

module.exports = { start };

function errorHanlder(msg, err) {
	console.error(err);
	msg.reply(Messages.fallbackErrorMessage);
}


function isPrefix(x) {
	return !!Messages.prefix.find(p => p === x.trim().toLowerCase());
}
