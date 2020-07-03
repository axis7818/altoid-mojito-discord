const Discord = require('discord.js');
const AzureVM = require('./azure-vm');
const Messages = require('./messages');
const roll4Chub = require('./roll4chub');

function start(TOKEN) {
    const client = new Discord.Client();

    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
    });

    client.on('message', msg => {
        if (!msg.author.bot) {
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
 * Show help information.
 */
function helpCommand(msg) {
    msg.reply(helpText);
    return Promise.resolve();
}
helpCommand.command = 'help';
helpCommand.helpText = Messages.helpText.help;

/**
 * Get the status of the VM
 */
function statusCommand(msg) {
    msg.reply(Messages.letMeCheckStatus);
    return AzureVM.getVMStatus()
        .then(determineVMStatus)
        .then(s => msg.reply(statusToMessage[s]));
}
statusCommand.command = 'status';
statusCommand.helpText = Messages.helpText.status;

/**
 * Start the VM
 */
function startCommand(msg) {
    return AzureVM.getVMStatus()
        .then(determineVMStatus)
        .then(status => {
            if (status !== Status.Stopped) {
                msg.reply(Messages.cantStartInvalidStatus(status));
                return;
            }

            msg.reply(Messages.startingVM);
            return AzureVM.startVM().then(() => {
                msg.reply(Messages.doneStartingVM);
            });
        });
}
startCommand.command = 'start';
startCommand.helpText = Messages.helpText.start;

function stopCommand(msg) {
    return AzureVM.getVMStatus()
        .then(determineVMStatus)
        .then(status => {
            if (status !== Status.Started) {
                msg.reply(Messages.cantStopInvalidStatus(status));
                return;
            }

            msg.reply(Messages.stoppingVM);
            return AzureVM.stopVM().then(() => {
                msg.reply(Messages.doneStoppingVM);
            });
        });

}
stopCommand.command = 'stop';
stopCommand.helpText = Messages.helpText.stop;

const allCommands = [helpCommand, statusCommand, startCommand, stopCommand, roll4Chub.roll4ChubCommand];

const helpText = `${Messages.helpGreeting}:\n\n`
    + allCommands
        .filter(cmd => !cmd.hidden)
        .map(cmd => `**${cmd.command}**: ${cmd.helpText}`).join('\n');

module.exports = { start };

const Status = { Started: "started", Starting: "starting", Stopped: "stopped", Stopping: "stopping", Unknown: "unknown" };
const statusToMessage = {
    [Status.Started]: Messages.vmIsRunning,
    [Status.Starting]: Messages.vmStartedRecently,
    [Status.Stopped]: Messages.vmIsNotRunning,
    [Status.Stopping]: Messages.vmIsStopping,
    [Status.Unknown]: Messages.failedToGetStatus,
};

function determineVMStatus(vm) {
    console.log("Determining the VM status");
    if (!vm.instanceView && !vm.instanceView.statuses) {
        return Status.Unknown;
    }

    const powerStatePrefix = 'PowerState';
    const provisioningStatePrefix = 'ProvisioningState';
    const startupGracePeriodMs = 3 * 60 * 1000;
    const statuses = vm.instanceView.statuses;

    const powerStatus = statuses.find(s => s.code.startsWith(powerStatePrefix));
    if (!powerStatus) {
        return Status.Unknown;
    }
    const provisioningState = statuses.find(s => s.code.startsWith(provisioningStatePrefix));

    switch (powerStatus.code) {

        // When running, check if it has recently started.
        // If it has, might still need to wait a few minutes.
        case `${powerStatePrefix}/running`:
            if (!provisioningState) {
                return Status.Started;
            }
            const now = Date.now();
            const startedAt = provisioningState.time.getTime();
            const diffMs = now - startedAt;
            if (diffMs >= 0 && diffMs < startupGracePeriodMs) {
                return Status.Starting;
            }
            return Status.Started;


        case `${powerStatePrefix}/starting`:
            return Status.Starting;

        case `${powerStatePrefix}/deallocating`:
            return Status.Stopping;

        case `${powerStatePrefix}/deallocated`:
            return Status.Stopped;

        // Handle unknown states...
        default:
            console.warn(`Unknown status`, powerStatus);
            return Status.Unknown;
    }
}
