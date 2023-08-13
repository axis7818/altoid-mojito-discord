const prefix = ['altoidmojito', 'altoid', 'mojito', 'altmoj'];

module.exports = {
	prefix,

	fallbackErrorMessage: "❌ Uhoh... Something went wrong...",
	helpGreeting: `👋 Hi! I am the AltoidMojito discord bot. I respond to the following commands after the prefix '${prefix[0]}'`,

	showVersion: (v) => `⚙️ My current version is ${v}`,

	helpText: {
		ror2Survivor: "Roll a random Risk of Rain 2 survivor with loadout",
		ror2Artifacts: "Roll a random set of Risk of Rain 2 artifacts",
		help: "Shows this help message",
		version: `Shows AltoidMojito's version number`,
	},
};
