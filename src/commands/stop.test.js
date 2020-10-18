require('../test/env');

jest.mock('../services/azure-vm');
const MockAzureVM = require('../services/azure-vm');
const Status = jest.requireActual('../services/azure-vm').Status;

jest.mock('../services/minecraft-server');
const MockMinecraftServer = require('../services/minecraft-server');

const stop = require('./stop');

describe(stop.name, function() {
	it("should stop the server if it is running and nobody is logged in", async function() {
		const msg = { reply: jest.fn() };
		MockAzureVM.getVMStatus = jest.fn().mockResolvedValue(Status.Started);
		MockAzureVM.stopVM = jest.fn().mockResolvedValue();
		MockMinecraftServer.getStatus = jest.fn().mockResolvedValue({ online: true, players: 0, maxPlayers: 20 });

		await stop(msg);

		expect(MockAzureVM.getVMStatus).toHaveBeenCalledTimes(1);
		expect(MockMinecraftServer.getStatus).toHaveBeenCalledTimes(1);
		expect(MockAzureVM.stopVM).toHaveBeenCalledTimes(1);
		expect(msg.reply).toHaveBeenCalledTimes(2);
		expect(msg.reply).toHaveBeenNthCalledWith(1, '🚧 Ok, I\'ll stop server-name.');
		expect(msg.reply).toHaveBeenNthCalledWith(2, '✌️ I just stopped server-name. See ya later!');
	});

	const blockedStatuses = [Status.Starting, Status.Stopped, Status.Stopping, Status.Unknown];
	blockedStatuses.forEach(status => {
		it(`should not stop the VM if it is ${status}`, async function() {
			const msg = { reply: jest.fn() };
			MockAzureVM.getVMStatus = jest.fn().mockResolvedValue(status);
			MockAzureVM.stopVM = jest.fn().mockResolvedValue();
			MockMinecraftServer.getStatus = jest.fn().mockResolvedValue();

			await stop(msg);

			expect(MockAzureVM.getVMStatus).toHaveBeenCalledTimes(1);
			expect(MockMinecraftServer.getStatus).toHaveBeenCalledTimes(0);
			expect(MockAzureVM.stopVM).toHaveBeenCalledTimes(0);
			expect(msg.reply).toHaveBeenCalledTimes(1);
			expect(msg.reply).toHaveBeenCalledWith(`⌛ server-name cannot be stopped right now because it is **${status}**`);
		});
	});

	it("should not stop the VM if anyone is logged in", async function() {
		const msg = { reply: jest.fn() };
		MockAzureVM.getVMStatus = jest.fn().mockResolvedValue(Status.Started);
		MockAzureVM.stopVM = jest.fn().mockResolvedValue();
		MockMinecraftServer.getStatus = jest.fn().mockResolvedValue({ online: true, players: 1, maxPlayers: 20 });

		await stop(msg);

		expect(MockAzureVM.getVMStatus).toHaveBeenCalledTimes(1);
		expect(MockMinecraftServer.getStatus).toHaveBeenCalledTimes(1);
		expect(MockAzureVM.stopVM).toHaveBeenCalledTimes(0);
		expect(msg.reply).toHaveBeenCalledTimes(1);
		expect(msg.reply).toHaveBeenCalledWith('🐿 Looks like there are 1 hooligan(s) playing, it isn\'t polite to stop server-name while others are using it.');
	});
});
