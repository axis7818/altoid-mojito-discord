require('../test/env');

jest.mock('../services/azure-vm');
const MockAzureVM = require('../services/azure-vm');
const Status = jest.requireActual('../services/azure-vm').Status;

const start = require('./start');

describe(start.name, function() {
	it("should start the VM if it is stopped", async function() {
		const msg = { reply: jest.fn() };
		MockAzureVM.getVMStatus = jest.fn().mockResolvedValue(Status.Stopped);
		MockAzureVM.startVM = jest.fn().mockResolvedValue();

		await start(msg);

		expect(MockAzureVM.getVMStatus).toHaveBeenCalledTimes(1);
		expect(MockAzureVM.startVM).toHaveBeenCalledTimes(1);
		expect(msg.reply).toHaveBeenCalledTimes(2);
		expect(msg.reply).toHaveBeenNthCalledWith(1, `👃 Ok, I'll start server-name! Please be sure to stop it when you are done.`);
		expect(msg.reply).toHaveBeenNthCalledWith(2, `👍 I just started server-name. It should be ready to connect at minecraft-server-url in a couple minutes!`);
	});

	const blockedStatuses = [Status.Started, Status.Starting, Status.Stopping, Status.Unknown];
	blockedStatuses.forEach(status => {
		it(`should not start the VM if it is ${status}`, async function() {
			const msg = { reply: jest.fn() };
			MockAzureVM.getVMStatus = jest.fn().mockResolvedValue(status);
			MockAzureVM.startVM = jest.fn();

			await start(msg);

			expect(MockAzureVM.getVMStatus).toHaveBeenCalledTimes(1);
			expect(MockAzureVM.startVM).toHaveBeenCalledTimes(0);
			expect(msg.reply).toHaveBeenCalledTimes(1);
			expect(msg.reply).toHaveBeenCalledWith(`⌛️ server-name cannot be started right now because it is **${status}**`);
		});
	});
});
