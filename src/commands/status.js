const AzureVM = require('../services/azure-vm');
const MinecraftServer = require('../services/minecraft-server');
const Messages = require('../messages');

const vmNotStartedResponses = {
    [AzureVM.Status.Stopped]: Messages.vmIsNotRunning,
    [AzureVM.Status.Stopping]: Messages.vmIsStopping,
    [AzureVM.Status.Starting]: Messages.vmStartedRecently,
    [AzureVM.Status.Unknown]: Messages.failedToGetStatus,
};

/**
 * Get the status of the VM
 */
async function statusCommand(msg) {
    msg.reply(Messages.letMeCheckStatus);
    const vmStatus = await AzureVM.getVMStatus();

    if (vmStatus !== AzureVM.Status.Started) {
        msg.reply(vmNotStartedResponses[vmStatus] || Messages.failedToGetStatus);
        return;
    }

    msg.reply(Messages.vmIsRunning);
    const serverStatus = await MinecraftServer.getStatus();
    if (serverStatus.online) {
        msg.reply(Messages.serverIsRunning(serverStatus));
    } else {
        msg.reply(Messages.vmStartedRecently);
    }
}
statusCommand.command = 'status';
statusCommand.helpText = Messages.helpText.status;

module.exports = statusCommand;
