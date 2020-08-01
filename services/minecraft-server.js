const config = require('../config').MINECRAFT;
const McStatus = require('mcstatus');

const options = {
    host: config.SERVER_URL,
    port: config.SERVER_PORT,
}

async function getStatus() {
    try {
        const status = await McStatus.checkStatus(options);
        const result = {
            online: true,
            players: status.players,
            maxPlayers: status.max_players,
        };
        return result;
    } catch (error) {
        if (error && (error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED')) {
            return {
                online: false,
                players: 0,
                maxPlayers: 0,
            };
        } else {
            throw error;
        }
    }
}

module.exports = { getStatus };
