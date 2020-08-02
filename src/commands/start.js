const AzureVM = require('../services/azure-vm');
const Messages = require('../messages');

/**
 * Start the VM
 */
function startCommand(msg) {
    return AzureVM.getVMStatus()
        .then(status => {
            if (status !== AzureVM.Status.Stopped) {
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
