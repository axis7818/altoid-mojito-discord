const AzureVM = require('./utils/azure-vm');
const Messages = require('./utils/messages');

/**
 * Get the status of the VM
 */
function statusCommand(msg) {
    msg.reply(Messages.letMeCheckStatus);
    return AzureVM.getVMStatus()
        .then(AzureVM.determineVMStatus)
        .then(s => msg.reply(AzureVM.statusToMessage[s]));
}
statusCommand.command = 'status';
statusCommand.helpText = Messages.helpText.status;

module.exports = statusCommand;
require('./all').registerCommand(statusCommand);
