const process = require('process');

const unitTestEnv = {
	ALTOIDMOJITO_TOKEN: 'token',
	ALTOIDMOJITO_CLIENT_ID: 'client-id',
	ALTOIDMOJITO_SERVER_NAME: 'server-name',
	ALTOIDMOJITO_AZURE_SUBSCRIPTION_ID: 'azure-subscription-id',
	ALTOIDMOJITO_AZURE_CLIENT_ID: 'azure-client-id',
	ALTOIDMOJITO_AZURE_APPLICATION_SECRET: 'azure-application-secret',
	ALTOIDMOJITO_AZURE_DOMAIN: 'azure-domain',
	ALTOIDMOJITO_AZURE_RESOURCE_GROUP: 'azure-resource-group',
	ALTOIDMOJITO_AZURE_VM_NAME: 'azure-vm-name',
	ALTOIDMOJITO_MINECRAFT_SERVER_URL: 'minecraft-server-url',
	ALTOIDMOJITO_MINECRAFT_SERVER_PORT: '25565',
};

for (const key of Object.keys(unitTestEnv)) {
	process.env[key] = unitTestEnv[key];
}
