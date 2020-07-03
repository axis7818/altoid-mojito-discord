const msRestAzure = require('ms-rest-azure');
const process = require('process');
const ComputeManagementClient = require('azure-arm-compute');

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
        const prefix = 'ALTOIDMOJITO_AZURE_';
        const variables = [
            'SUBSCRIPTION_ID',
            'CLIENT_ID',
            'APPLICATION_SECRET',
            'DOMAIN',
            'RESOURCE_GROUP',
            'VM_NAME',
        ]

        config = {};
        variables.forEach(v => {
            const envVar = `${prefix}${v}`;
            const value = process.env[envVar];
            if (!value) {
                throw new Error(`The environment variable ${envVar} is required.`);
            }
            config[v] = value;
        });

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

module.exports = { getVMStatus, startVM, stopVM, getConfig };
