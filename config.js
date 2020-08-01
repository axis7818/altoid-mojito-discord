const process = require('process');
const { isObject } = require('util');

const prefix = 'ALTOIDMOJITO';
const config = {

    // Discord Bot
    TOKEN: '',
    CLIENT_ID: '',

    // Azure
    AZURE: {
        SUBSCRIPTION_ID: '',
        CLIENT_ID: '',
        APPLICATION_SECRET: '',
        DOMAIN: '',
        RESOURCE_GROUP: '',
        VM_NAME: '',
    },

    // Minecraft
    MINECRAFT: {
        SERVER_URL: '',
        SERVER_PORT: '',
    },

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
            }
        }
    }
}

parseConfig(config, prefix);

module.exports = config;