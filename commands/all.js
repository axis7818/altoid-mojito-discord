
const commands = [];

function registerCommand(c) {
    commands.push(c);
}

module.exports = { commands, registerCommand };
