const config = require('./config');

const prefix = ['altoidmojito', 'altoid', 'mojito', 'altmoj'];

module.exports = {
	prefix,

	fallbackErrorMessage: "❌ Uhoh... Something went wrong...",
	helpGreeting: `👋 Hi! I am the AltoidMojito discord bot. I respond to the following commands after the prefix '${prefix[0]}'`,

	letMeCheckStatus: `⏱ Let me see if ${config.SERVER_NAME} is running. One sec...`,
	failedToGetStatus: `🤔 Sorry, I cannot determine the status of the ${config.SERVER_NAME} server...`,
	vmIsNotRunning: `💤 ${config.SERVER_NAME} is not running at the moment. Feel free to start it with the **start** command!`,
	vmIsStopping: `🟡 ${config.SERVER_NAME} is stopping. Please wait a few minutes before starting it up again.`,
	vmStartedRecently: `⏱ ${config.SERVER_NAME} was recently started. It should be ready to connect at ${config.MINECRAFT.SERVER_URL} in a couple minutes!`,
	vmIsRunning: `👃 The ${config.SERVER_NAME} VM has started, let me make sure it is ready to join...`,
	serverIsRunning: (serverStatus) => {
		const hooliganCount = serverStatus.players ? ` and there are already ${serverStatus.players} hooligan(s) logged in` : ``;
		return `✅ It looks like ${config.SERVER_NAME} is up and running${hooliganCount}. You can connect to the server at ${config.MINECRAFT.SERVER_URL}.`;
	},

	startingVM: `👃 Ok, I'll start ${config.SERVER_NAME}! Please be sure to stop it when you are done.`,
	doneStartingVM: `👍 I just started ${config.SERVER_NAME}. It should be ready to connect at ${config.MINECRAFT.SERVER_URL} in a couple minutes!`,
	cantStartInvalidStatus: (status) => `⌛️ ${config.SERVER_NAME} cannot be started right now because it is **${status}**`,

	stoppingVM: `🚧 Ok, I'll stop ${config.SERVER_NAME}.`,
	doneStoppingVM: `✌️ I just stopped ${config.SERVER_NAME}. See ya later!`,
	cantStopInvalidStatus: (status) => `⌛ ${config.SERVER_NAME} cannot be stopped right now because it is **${status}**`,
	cantStopPeopleArePlaying: (serverStatus) => `🐿 Looks like there are ${serverStatus.players} hooligan(s) playing, it isn't polite to stop ${config.SERVER_NAME} while others are using it.`,

	showVersion: (v) => `⚙️ My current version is ${v}`,

	helpText: {
		status: "Shows the current status of AltoidMojito",
		start: `Start ${config.SERVER_NAME}. This can only be done if ${config.SERVER_NAME} is stopped.`,
		stop: `Stop ${config.SERVER_NAME}. This can only be done if ${config.SERVER_NAME} is started.`,
		help: "Shows this help message",
		version: `Shows AltoidMojito's version number`,
	},
};
