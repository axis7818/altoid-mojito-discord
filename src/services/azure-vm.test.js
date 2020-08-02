require('../test/env');
const config = require('../config');

jest.mock('ms-rest-azure');
const msRestAzure = require('ms-rest-azure');
msRestAzure.loginWithServicePrincipalSecret = jest.fn()
    .mockImplementation((_0, _1, _2, cb) => cb(undefined, {}));

jest.mock('azure-arm-compute');
const ComputeManagementClient = require('azure-arm-compute');

const AzureVM = require('./azure-vm');

describe('azure-vm', function() {
    describe('getVMStatus()', function() {
        /**
         * Mock the call to get a Virtual Machine.
         * @param {*} vm
         * @return {*} mock function
         */
        function mockComputeManagementClientVirtualMachinesGet(vm) {
            const mockGet = jest.fn().mockReturnValue(vm);
            ComputeManagementClient.ComputeManagementClient.prototype.virtualMachines = {
                get: mockGet,
            };
            return mockGet;
        }

        const PowerStateToStatus = {
            [`PowerState/running`]: AzureVM.Status.Started,
            [`PowerState/starting`]: AzureVM.Status.Starting,
            [`PowerState/deallocating`]: AzureVM.Status.Stopping,
            [`PowerState/deallocated`]: AzureVM.Status.Stopped,
        };

        for (const powerState of Object.keys(PowerStateToStatus)) {
            const expectedStatus = PowerStateToStatus[powerState];
            it(`should return ${expectedStatus} when the VM's power state is ${powerState}`, async function() {
                const mockGet = mockComputeManagementClientVirtualMachinesGet({
                    instanceView: {
                        statuses: [
                            {
                                code: powerState,
                            },
                        ],
                    },
                });

                const actualStatus = await AzureVM.getVMStatus();

                expect(mockGet).toBeCalledTimes(1);
                expect(actualStatus).toBe(expectedStatus);
            });
        }

        it(`should return ${AzureVM.Status.Unknown} for unhandled power states`, async function() {
            const mockGet = mock_ComputeManagementClient_virtualMachines_get({
                instanceView: {
                    statuses: [
                        {
                            code: 'unknown-code',
                        },
                    ],
                },
            });

            const actualStatus = await AzureVM.getVMStatus();

            expect(mockGet).toBeCalledTimes(1);
            expect(actualStatus).toBe(AzureVM.Status.Unknown);
        });
    });

    describe('startVM()', function() {
        it('should start the VM', async function() {
            const mockStart = jest.fn();
            ComputeManagementClient.ComputeManagementClient.prototype.virtualMachines = {
                start: mockStart,
            };

            await AzureVM.startVM();
            expect(mockStart).toBeCalledTimes(1);
            const call = mockStart.mock.calls[0];
            expect(call[0]).toBe(config.AZURE.RESOURCE_GROUP);
            expect(call[1]).toBe(config.AZURE.VM_NAME);
        });
    });

    describe('stopVM()', function() {
        it('should stop the VM', async function() {
            const mockStop = jest.fn();
            ComputeManagementClient.ComputeManagementClient.prototype.virtualMachines = {
                deallocate: mockStop,
            };

            await AzureVM.stopVM();
            expect(mockStop).toBeCalledTimes(1);
            const call = mockStop.mock.calls[0];
            expect(call[0]).toBe(config.AZURE.RESOURCE_GROUP);
            expect(call[1]).toBe(config.AZURE.VM_NAME);
        });
    });
});
