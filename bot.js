const Discord = require('discord.js');
const AzureVM = require('./azure-vm');
const Messages = require('./messages');

function start(TOKEN) {
    const client = new Discord.Client();

    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
    });

    client.on('message', msg => {
        if (!msg.author.bot) {
            console.log(`Received message: ${msg.content.substr(0, 24)}`);

            const cmd = msg.content.split(/\s/)[0].toLowerCase();
            const c = allCommands.find(c => c.command === cmd) || helpCommand;
            try {
                c(msg).catch(errorHanlder);
            } catch (err) {
                errorHanlder(err);
            }
        }

    });

    client.login(TOKEN);
}

function errorHanlder(err) {
    console.error(err);
    msg.reply(Messages.fallbackErrorMessage);
}

/**
 * Get the status of the VM
 */
function statusCommand(msg) {
    msg.reply(Messages.letMeCheckStatus);
    return AzureVM.getVMStatus()
        .then(vm => {
            if (!vm.instanceView) {
                msg.reply(Messages.failedToGetStatus);
            } else {
                const status = determineVMStatus(vm);
                msg.reply(status);
            }
        });
}
statusCommand.command = 'status';
statusCommand.helpText = Messages.helpText.status;

/**
 * Show help information.
 */
function helpCommand(msg) {
    msg.reply(helpText);
    return Promise.resolve();
}
helpCommand.command = 'help';
helpCommand.helpText = Messages.helpText.help;

const allCommands = [helpCommand, statusCommand];

const helpText = `${Messages.helpGreeting}:\n\n`
    + allCommands.map(cmd => `**${cmd.command}**: ${cmd.helpText}`).join('\n');


module.exports = { start };

function determineVMStatus(vm) {
    const powerStatePrefix = 'PowerState';
    const provisioningStatePrefix = 'ProvisioningState';
    const startupGracePeriodMs = 3 * 60 * 1000;
    const statuses = vm.instanceView.statuses;

    const powerStatus = statuses.find(s => s.code.startsWith(powerStatePrefix));
    if (!powerStatus) {
        return Messages.failedToGetStatus;
    }
    const provisioningState = statuses.find(s => s.code.startsWith(provisioningStatePrefix));

    console.log(powerStatus);
    switch (powerStatus.code) {

        // When running, check if it has recently started.
        // If it has, might still need to wait a few minutes.
        case `${powerStatePrefix}/running`:
            if (!provisioningState) {
                return Messages.vmIsRunning;
            }
            const now = Date.now();
            const startedAt = provisioningState.time.getTime();
            const diffMs = now - startedAt;
            if (diffMs >= 0 && diffMs < startupGracePeriodMs) {
                return Messages.vmStartedRecently;
            }
            return Messages.vmIsRunning;


        case `${powerStatePrefix}/starting`:
            return Messages.vmStartedRecently;

        case `${powerStatePrefix}/deallocating`:
            return Messages.vmIsStopping;

        case `${powerStatePrefix}/deallocated`:
            return Messages.vmIsNotRunning;

        // Handle unknown states...
        default:
            return Messages.defaultGetStatus(powerStatus.displayStatus || 'unknown');
    }
}
