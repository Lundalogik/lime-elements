const assert = require('assert');

describe('webdriver.io page', () => {
    it('should have the right title', () => {
        browser.url('#/date-picker');
        const title = browser.getTitle();
        assert.equal(title, 'Lime Elements');
    });
});
