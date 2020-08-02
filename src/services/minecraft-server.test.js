require('../test/env');
jest.mock('mcstatus');
const McStatus = require('mcstatus');
const MinecraftServer = require('./minecraft-server');

describe('minecraft-server', function() {
    describe('getStatus()', function() {
        it('should return the server status', async function() {
            McStatus.checkStatus = jest.fn().mockResolvedValue({
                players: 3,
                max_players: 20,
            });

            const status = await MinecraftServer.getStatus();

            expect(McStatus.checkStatus).toHaveBeenCalledTimes(1);
            expect(status.online).toBeTruthy();
            expect(status.players).toBe(3);
            expect(status.maxPlayers).toBe(20);
        });

        const unavailableErrors = ['ETIMEDOUT', 'ECONNREFUSED'];
        unavailableErrors.forEach((err) => {
            it(`should handle ${err} as unavailable`, async function() {
                McStatus.checkStatus = jest.fn().mockRejectedValue({
                    code: err,
                });

                const status = await MinecraftServer.getStatus();

                expect(McStatus.checkStatus).toHaveBeenCalledTimes(1);
                expect(status.online).toBeFalsy();
                expect(status.players).toBe(0);
                expect(status.maxPlayers).toBe(0);
            });
        });
    });
});
