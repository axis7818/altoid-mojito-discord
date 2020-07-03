require('dotenv').config()

const process = require('process');
const bot = require('./bot');

/** Entry point for the program */
function main() {

    const TOKEN = process.env.ALTOIDMOJITO_TOKEN;
    if (!TOKEN) {
        console.error("Missing bot token, please set the ALTOIDMOJITO_TOKEN environment variable");
        process.exit(1);
    }

    bot.start(TOKEN);
    showAddBotMessage();
}

/** Log the URL for adding the bot to a server. */
function showAddBotMessage() {
    const CLIENT_ID = process.env.ALTOIDMOJITO_CLIENT_ID;
    if (CLIENT_ID) {
        console.log(`Add AltoidMojito to your server with this URL: https://discordapp.com/oauth2/authorize?client_id=${CLIENT_ID}&scope=bot`);
    }
}

main();
