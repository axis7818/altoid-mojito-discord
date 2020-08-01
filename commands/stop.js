const AzureVM = require('../services/azure-vm');
const MinecraftServer = require('../services/minecraft-server');
const Messages = require('../messages');

async function stopCommand(msg) {
    const vmStatus = await AzureVM.getVMStatus()
        .then(AzureVM.determineVMStatus);

    if (vmStatus !== AzureVM.Status.Started) {
        msg.reply(Messages.cantStopInvalidStatus(vmStatus));
        return;
    }

    const serverStatus = await MinecraftServer.getStatus();
    if (serverStatus.online && serverStatus.players > 0) {
        msg.reply(Messages.cantStopPeopleArePlaying(serverStatus));
        return;
    }

    msg.reply(Messages.stoppingVM);
    return AzureVM.stopVM().then(() => {
        msg.reply(Messages.doneStoppingVM);
    });
}
stopCommand.command = 'stop';
stopCommand.helpText = Messages.helpText.stop;

module.exports = stopCommand;
require('./all').registerCommand(stopCommand);
