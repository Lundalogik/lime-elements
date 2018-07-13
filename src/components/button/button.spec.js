var assert = require('assert');

describe('limel-button', function() {
    before(() => {
        browser.url('http://localhost:4567/test/limel-button');
    });
    it('should have the right title', function () {
        var title = browser.getTitle();
        assert.equal(title, 'Lime Elements Documentation');
    });
});
