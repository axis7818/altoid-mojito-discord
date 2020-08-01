const msRestAzure = require('ms-rest-azure');
const ComputeManagementClient = require('azure-arm-compute');
const botConfig = require('../config');

async function getVMStatus() {
    console.log("Getting VM status");
    const config = getConfig();

    const vm = await getClient().then(computeClient => {
        const rg = config['RESOURCE_GROUP'];
        const vm = config['VM_NAME'];
        console.log(`Getting Virtual Machine Information (rg=${rg}, vm=${vm})`);
        return computeClient.virtualMachines.get(rg, vm, { expand: 'instanceView' });
    });

    return determineVMStatus(vm);
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

const PowerStatePrefix = 'PowerState';
const PowerStateToStatus = {
    [`${PowerStatePrefix}/running`]: Status.Started,
    [`${PowerStatePrefix}/starting`]: Status.Starting,
    [`${PowerStatePrefix}/deallocating`]: Status.Stopping,
    [`${PowerStatePrefix}/deallocated`]: Status.Stopped,
};

function determineVMStatus(vm) {
    console.log("Determining the VM status");
    if (!vm.instanceView || !vm.instanceView.statuses) {
        return Status.Unknown;
    }

    const statuses = vm.instanceView.statuses;

    const powerStatus = statuses.find(s => s.code.startsWith(PowerStatePrefix));
    if (!powerStatus) {
        return Status.Unknown;
    }

    const result = PowerStateToStatus[powerStatus.code] || Status.Unknown;
    if (result === Status.Unknown) {
        console.warn(`Unknown status`, powerStatus);
    }
    return result;
}

module.exports = { getVMStatus, startVM, stopVM, Status };
