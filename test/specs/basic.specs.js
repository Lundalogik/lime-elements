const assert = require('assert');

describe('docz page', () => {
    it('should have the right title', () => {
        browser.url('#/date-picker');
        const html = browser.$('body').getHTML();
        console.log('---');
        console.log('---');
        console.log('---');
        console.log(html);
        console.log('---');
        console.log('---');
        console.log('---');
        const title = browser.getTitle();
        assert.equal(title, 'Lime Elements');
    });
});
