const Messages = require('../messages');
const version = require('../package.json').version;

function versionCommand(msg) {
    msg.reply(Messages.showVersion(version));
}
versionCommand.command = 'version';
versionCommand.helpText = Messages.helpText.version;

module.exports = versionCommand;
require('./all').registerCommand(versionCommand);