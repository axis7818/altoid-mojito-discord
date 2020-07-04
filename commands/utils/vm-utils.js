const Messages = require('../../messages');

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

module.exports = { determineVMStatus, Status, statusToMessage };
