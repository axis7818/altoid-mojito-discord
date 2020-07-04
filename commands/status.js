const AzureVM = require('../azure-vm');
const Messages = require('../messages');
const vmUtils = require('./utils/vm-utils');

/**
 * Get the status of the VM
 */
function statusCommand(msg) {
    msg.reply(Messages.letMeCheckStatus);
    return AzureVM.getVMStatus()
        .then(vmUtils.determineVMStatus)
        .then(s => msg.reply(vmUtils.statusToMessage[s]));
}
statusCommand.command = 'status';
statusCommand.helpText = Messages.helpText.status;

module.exports = statusCommand;
require('./all').registerCommand(statusCommand);
