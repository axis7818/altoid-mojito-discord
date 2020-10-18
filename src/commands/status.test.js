require('../test/env');

jest.mock('../services/azure-vm');
const MockAzureVM = require('../services/azure-vm');
const Status = jest.requireActual('../services/azure-vm').Status;

jest.mock('../services/minecraft-server');
const MockMinecraftServer = require('../services/minecraft-server');

const statusCommand = require('./status');

describe(statusCommand.name, function() {
	const vmNotStartedStatuses = [
		{ status: Status.Stopped, expectedResponse: '💤 server-name is not running at the moment. Feel free to start it with the **start** command!' },
		{ status: Status.Stopping, expectedResponse: '🟡 server-name is stopping. Please wait a few minutes before starting it up again.' },
		{ status: Status.Starting, expectedResponse: '⏱ server-name was recently started. It should be ready to connect at minecraft-server-url in a couple minutes!' },
		{ status: Status.Unknown, expectedResponse: '🤔 Sorry, I cannot determine the status of the server-name server...' },
	];
	vmNotStartedStatuses.forEach(({ status, expectedResponse }) => {
		it(`should respond when the vm is ${status} and not check the minecraft server`, async function() {
			const msg = { reply: jest.fn() };
			MockAzureVM.getVMStatus = jest.fn().mockResolvedValue(status);
			MockMinecraftServer.getStatus = jest.fn();

			await statusCommand(msg);

			expect(MockAzureVM.getVMStatus).toHaveBeenCalledTimes(1);
			expect(MockMinecraftServer.getStatus).toHaveBeenCalledTimes(0);
			expect(msg.reply).toHaveBeenCalledTimes(2);
			expect(msg.reply).toHaveBeenNthCalledWith(1, '⏱ Let me see if server-name is running. One sec...');
			expect(msg.reply).toHaveBeenNthCalledWith(2, expectedResponse);
		});
	});

	it("should respond that the server is ready", async function() {
		const msg = { reply: jest.fn() };
		MockAzureVM.getVMStatus = jest.fn().mockResolvedValue(Status.Started);
		MockMinecraftServer.getStatus = jest.fn().mockResolvedValue({ online: true, players: 0, maxPlayers: 20 });

		await statusCommand(msg);

		expect(MockAzureVM.getVMStatus).toHaveBeenCalledTimes(1);
		expect(MockMinecraftServer.getStatus).toHaveBeenCalledTimes(1);
		expect(msg.reply).toHaveBeenCalledTimes(3);
		expect(msg.reply).toHaveBeenNthCalledWith(1, '⏱ Let me see if server-name is running. One sec...');
		expect(msg.reply).toHaveBeenNthCalledWith(2, '👃 The server-name VM has started, let me make sure it is ready to join...');
		expect(msg.reply).toHaveBeenNthCalledWith(3, '✅ It looks like server-name is up and running. You can connect to the server at minecraft-server-url.');
	});

	it("should respond that the server is ready and people are logged in", async function() {
		const msg = { reply: jest.fn() };
		MockAzureVM.getVMStatus = jest.fn().mockResolvedValue(Status.Started);
		MockMinecraftServer.getStatus = jest.fn().mockResolvedValue({ online: true, players: 2, maxPlayers: 20 });

		await statusCommand(msg);

		expect(MockAzureVM.getVMStatus).toHaveBeenCalledTimes(1);
		expect(MockMinecraftServer.getStatus).toHaveBeenCalledTimes(1);
		expect(msg.reply).toHaveBeenCalledTimes(3);
		expect(msg.reply).toHaveBeenNthCalledWith(1, '⏱ Let me see if server-name is running. One sec...');
		expect(msg.reply).toHaveBeenNthCalledWith(2, '👃 The server-name VM has started, let me make sure it is ready to join...');
		expect(msg.reply).toHaveBeenNthCalledWith(3, '✅ It looks like server-name is up and running and there are already 2 hooligan(s) logged in. You can connect to the server at minecraft-server-url.');
	});
});
