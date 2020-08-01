const roll4chub = require('./roll4chub');

describe(roll4chub.name, function () {

    it("should be hidden", function () {
        expect(roll4chub.hidden).toBeTruthy();
    });

    it("should roll a chub between 0 and 100", function () {
        for (let i = 0; i < 10; i += 1) {
            const mockMsg = {
                author: { id: '', username: 'user' },
                reply: jest.fn(),
            };
            roll4chub(mockMsg);
            expect(mockMsg.reply.mock.calls).toHaveLength(1);
            const call = mockMsg.reply.mock.calls[0];
            expect(call[0]).toMatch(/^Your chub is ([1-9][0-9]{0,1})\.$/);
        }
    });

});
