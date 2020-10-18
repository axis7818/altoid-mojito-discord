const config = require('../config').MINECRAFT;
const McStatus = require('mcstatus');

const options = {
	host: config.SERVER_URL,
	port: config.SERVER_PORT,
};

/**
 * Get the status of the minecraft server.
 * This includes whether the server is online,
 * number of logged in players, and the maximum
 * allowed number of players.
 */
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
		const offline = error &&
            (error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED');
		if (offline) {
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

module.exports = {
	getStatus,
};
