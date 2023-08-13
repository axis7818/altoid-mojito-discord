const process = require('process');

const unitTestEnv = {
	ALTOIDMOJITO_TOKEN: 'token',
	ALTOIDMOJITO_CLIENT_ID: 'client-id',
};

for (const key of Object.keys(unitTestEnv)) {
	process.env[key] = unitTestEnv[key];
}
