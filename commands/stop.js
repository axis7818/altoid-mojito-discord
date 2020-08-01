const AzureVM = require('../services/azure-vm');
const Messages = require('../messages');

function stopCommand(msg) {
    return AzureVM.getVMStatus()
        .then(AzureVM.determineVMStatus)
        .then(status => {
            if (status !== AzureVM.Status.Started) {
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

module.exports = stopCommand;
require('./all').registerCommand(stopCommand);
