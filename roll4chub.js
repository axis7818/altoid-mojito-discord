
function roll4ChubCommand(msg) {
    const dice1 = rollOneDice();
    const dice2 = rollOneDice();

    msg.reply(`dice1: ${dice1}, dice2: ${dice2}`);
    return Promise.resolve();
}
roll4ChubCommand.command = 'roll4chub';
roll4ChubCommand.hidden = true;

module.exports = { roll4ChubCommand };

const min = 1;
const max = 10;
function rollOneDice() {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}