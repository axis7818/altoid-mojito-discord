require('dotenv').config();

const process = require('process');
const bot = require('./bot');
const config = require('./config');

/** Entry point for the program */
function main() {
	// Make sure discord configuration is provided.
	const TOKEN = config.TOKEN;
	if (!TOKEN) {
		console.error("Missing bot token, please set the ALTOIDMOJITO_TOKEN environment variable");
		process.exit(1);
	}

	// Start the bot
	bot.start(TOKEN);

	// Log the URL for adding the bot to a server
	const CLIENT_ID = config.CLIENT_ID;
	if (CLIENT_ID) {
		console.log(`Add AltoidMojito to your server with this URL: https://discordapp.com/oauth2/authorize?client_id=${CLIENT_ID}&scope=bot`);
	}
}

main();
