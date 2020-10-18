
const commands = [
	require('./help'),
	require('./version'),
	require('./start'),
	require('./status'),
	require('./stop'),
	require('./roll4chub'),
	require('./ror2-survivor'),
	require('./ror2-artifacts'),
];

module.exports = commands;
