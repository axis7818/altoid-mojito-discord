
function roll4ChubCommand(msg) {
	const chub = rollBothDice();
	console.log(`${msg.author.username}'s chub is ${chub}`);
	msg.reply(`Your chub is ${chub}.`);
}
roll4ChubCommand.command = 'roll4chub';
roll4ChubCommand.hidden = true;

module.exports = roll4ChubCommand;

const min = 0;
const max = 9;
function rollOneDice() {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rollBothDice() {
	const dice1 = 10 * rollOneDice();
	const dice2 = rollOneDice();
	const result = dice1 === 0 && dice2 === 0 ? 100 : dice1 + dice2;
	return result;
}
