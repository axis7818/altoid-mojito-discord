const process = require('process');
const { isObject } = require('util');

const prefix = 'ALTOIDMOJITO';
const config = {
	// Discord Bot
	TOKEN: null,
	CLIENT_ID: null,
};

function parseConfig(config, prefix) {
	for (const key of Object.keys(config)) {
		if (config[key] === undefined) {
			continue;
		}
		if (isObject(config[key]) && config[key] !== null) {
			parseConfig(config[key], [prefix, key].join('_'));
		} else {
			const value = process.env[`${prefix}_${key}`];
			if (value) {
				config[key] = value;
			} else if (config[key] === null) {
				throw new Error(`Missing configuration value. ${prefix}_${key} is required.`);
			}
		}
	}
}

parseConfig(config, prefix);

module.exports = config;
