const AzureVM = require('../azure-vm');
const Messages = require('../messages');
const vmUtils = require('./utils/vm-utils');

function stopCommand(msg) {
    return AzureVM.getVMStatus()
        .then(vmUtils.determineVMStatus)
        .then(status => {
            if (status !== vmUtils.Status.Started) {
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
