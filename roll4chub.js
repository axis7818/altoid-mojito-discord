
function roll4ChubCommand(msg) {
    const isMarty = msg.author.username === 'mb4747';
    let chub = rollBothDice();
    while (isMarty && chub > 42) {
        chub = rollBothDice();
    }

    msg.reply(`Your chub is ${chub}.`);
    return Promise.resolve();
}
roll4ChubCommand.command = 'roll4chub';
roll4ChubCommand.hidden = true;
roll4ChubCommand.disabled = false;

module.exports = { roll4ChubCommand };

const min = 0;
const max = 9;
function rollOneDice() {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rollBothDice() {
    let dice1 = 10 * rollOneDice();
    let dice2 = rollOneDice();
    let result = dice1 === 0 && dice2 === 0 ? 100 : dice1 + dice2;
    return result;
}
