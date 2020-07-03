
module.exports = {

    fallbackErrorMessage: "❌ Uhoh... Something went wrong...",
    helpGreeting: "👋 Hi! I am the AltoidMojito discord bot. I respond to the following commands",

    letMeCheckStatus: "⏱ Let me see if AltoidMojito is running. One sec...",
    failedToGetStatus: "🤔 Sorry, I cannot determine the status of the AltoidMojito server...",
    vmIsRunning: "✅ It looks like AltoidMojito is up and running!\nYou can connect to the server at `altoidmojito.men`",
    vmStartedRecently: "⏱ AltoidMojito was recently started. It should be ready to connect at `altoidmojito.men` in a couple minutes!",
    vmIsNotRunning: "💤 AltoidMojito is not running at the moment. Feel free to start it with the **start** command!",
    vmIsStopping: "🟡 AltoidMojito just stopped. Please wait a few minutes before starting it up again.",

    startingVM: "👃 Ok, I'll start AltoidMojito! Please be sure to stop it when you are done.",
    doneStartingVM: "👍 I just started AltoidMojito. It should be ready to connect at `altoidmojito.men` in a couple minutes!",
    cantStartInvalidStatus: (status) => `⌛️ AltoidMojito cannot be started right now because it is **${status}**`,

    stoppingVM: "🚧 Ok, I'll stop AltoidMojito.",
    doneStoppingVM: "✌️ I just stopped AltoidMojito. See ya later!",
    cantStopInvalidStatus: (status) => `⌛ AltoidMojito cannot be stopped right now because it is **${status}**`,

    helpText: {
        status: "Shows the current status of AltoidMojito",
        start: "Start AltoidMojito. This can only be done if AltoidMojito is stopped.",
        stop: "Stop AltoidMojito. This can only be done if AltoidMojito is started.",
        help: "Shows this help message",
    },
};
