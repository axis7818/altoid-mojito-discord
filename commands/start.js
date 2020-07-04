const AzureVM = require('../azure-vm');
const Messages = require('../messages');
const vmUtils = require('./utils/vm-utils');

/**
 * Start the VM
 */
function startCommand(msg) {
    return AzureVM.getVMStatus()
        .then(vmUtils.determineVMStatus)
        .then(status => {
            if (status !== vmUtils.Status.Stopped) {
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

module.exports = startCommand;
require('./all').registerCommand(startCommand);
