const Messages = require('../messages');
const msRestAzure = require('ms-rest-azure');
const ComputeManagementClient = require('azure-arm-compute');
const botConfig = require('../config');

function getVMStatus() {
    console.log("Getting VM status");
    const config = getConfig();

    return getClient().then(computeClient => {
        const rg = config['RESOURCE_GROUP'];
        const vm = config['VM_NAME'];
        console.log(`Getting Virtual Machine Information (rg=${rg}, vm=${vm})`);
        return computeClient.virtualMachines.get(rg, vm, { expand: 'instanceView' });
    });
}

function startVM() {
    console.log("Starting VM");
    return getClient().then(computeClient => {
        const rg = config['RESOURCE_GROUP'];
        const vm = config['VM_NAME'];
        console.log(`Starting Virtual Machine (rg=${rg}, vm=${vm})`);
        return computeClient.virtualMachines.start(rg, vm);
    });
}

function stopVM() {
    console.log("Stopping VM");
    return getClient().then(computeClient => {
        const rg = config['RESOURCE_GROUP'];
        const vm = config['VM_NAME'];
        console.log(`Stopping Virtual Machine (rg=${rg}, vm=${vm})`);
        return computeClient.virtualMachines.deallocate(rg, vm);
    });
}

// lazy load & cache
let config = null;
function getConfig() {
    if (config === null) {
        config = botConfig.AZURE;
        for (const { key, value } of Object.entries(config)) {
            if (key && !value) {
                throw new Error(`The Azure configuration field ${key} is required.`);
            }
        }
    }
    return config;
}

// lazy load & cache
let computeClient = null;
function getClient() {
    if (computeClient !== null) {
        return Promise.resolve(computeClient);
    }

    const config = getConfig();
    console.log("Logging in to Azure with Service Principal");

    return new Promise((resolve, reject) => {
        msRestAzure.loginWithServicePrincipalSecret(
            config['CLIENT_ID'],
            config['APPLICATION_SECRET'],
            config['DOMAIN'],
            (err, credentials) => {
                if (err) {
                    reject(err);
                }
                else {
                    console.log("Creating ComputeManagementClient");
                    computeClient = new ComputeManagementClient(credentials, config['SUBSCRIPTION_ID']);
                    resolve(computeClient);
                }
            },
        );
    });
}

const Status = { Started: "started", Starting: "starting", Stopped: "stopped", Stopping: "stopping", Unknown: "unknown" };
const statusToMessage = {
    [Status.Started]: Messages.vmIsRunning,
    [Status.Starting]: Messages.vmStartedRecently,
    [Status.Stopped]: Messages.vmIsNotRunning,
    [Status.Stopping]: Messages.vmIsStopping,
    [Status.Unknown]: Messages.failedToGetStatus,
};

function determineVMStatus(vm) {
    console.log("Determining the VM status");
    if (!vm.instanceView && !vm.instanceView.statuses) {
        return Status.Unknown;
    }

    const powerStatePrefix = 'PowerState';
    const provisioningStatePrefix = 'ProvisioningState';
    const startupGracePeriodMs = 3 * 60 * 1000;
    const statuses = vm.instanceView.statuses;

    const powerStatus = statuses.find(s => s.code.startsWith(powerStatePrefix));
    if (!powerStatus) {
        return Status.Unknown;
    }
    const provisioningState = statuses.find(s => s.code.startsWith(provisioningStatePrefix));

    switch (powerStatus.code) {

        // When running, check if it has recently started.
        // If it has, might still need to wait a few minutes.
        case `${powerStatePrefix}/running`:
            if (!provisioningState) {
                return Status.Started;
            }
            const now = Date.now();
            const startedAt = provisioningState.time.getTime();
            const diffMs = now - startedAt;
            if (diffMs >= 0 && diffMs < startupGracePeriodMs) {
                return Status.Starting;
            }
            return Status.Started;


        case `${powerStatePrefix}/starting`:
            return Status.Starting;

        case `${powerStatePrefix}/deallocating`:
            return Status.Stopping;

        case `${powerStatePrefix}/deallocated`:
            return Status.Stopped;

        // Handle unknown states...
        default:
            console.warn(`Unknown status`, powerStatus);
            return Status.Unknown;
    }
}

module.exports = { getVMStatus, startVM, stopVM, getConfig, determineVMStatus, Status, statusToMessage };
