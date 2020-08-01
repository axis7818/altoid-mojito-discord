require('../test/env');
const version = require('./version');
const Messages = require('../messages');

const currentVersion = require('../../package.json').version;

describe(version.name, function () {
    it("should show the version number", function () {
        const msg = { reply: jest.fn() };

        version(msg);

        expect(msg.reply.mock.calls).toHaveLength(1);
        expect(msg.reply.mock.calls[0][0]).toBe(Messages.showVersion(currentVersion));
    });
});
