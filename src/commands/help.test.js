require('../test/env');
const help = require('./help');

function fakeCommand() { }
fakeCommand.command = 'fake';
fakeCommand.helpText = "This is a fake command";

function hiddenCommand() { }
hiddenCommand.command = 'hidden';
hiddenCommand.helpText = "This is a hidden command";
hiddenCommand.hidden = true;

describe(help.name, function() {
	it("should show help and hide hidden commands", function() {
		jest.mock('./all');
		const allCommands = require('./all');
		allCommands.push(fakeCommand);
		allCommands.push(hiddenCommand);

		const msg = { reply: jest.fn() };
		const expectedMsg = `👋 Hi! I am the AltoidMojito discord bot. I respond to the following commands after the prefix 'altoidmojito':\n\n**fake**: This is a fake command`;

		help(msg);

		expect(msg.reply.mock.calls).toHaveLength(1);
		const call = msg.reply.mock.calls[0];
		expect(call[0]).toBe(expectedMsg);
	});
});
