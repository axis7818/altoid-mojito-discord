const config = require('../config').MINECRAFT;

async function getStatus() {
    const status = {
        serverUrl: config.SERVER_URL,
        serverPort: config.SERVER_PORT,
        online: false,
        currentPlayers: 0,
        maxPlayers: 0,
    };
    return status;
}

module.exports = { getStatus };