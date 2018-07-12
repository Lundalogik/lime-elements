var assert = require('assert');

describe('webdriver.io page', function() {
    it('should have the right title - the fancy generator way', function () {
        browser.url('http://localhost:4567');
        var title = browser.getTitle();
        assert.equal(title, 'Lime Elements Documentation');
    });
});
