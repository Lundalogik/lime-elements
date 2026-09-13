import { DateFormatter } from './date-formatter';

describe('DateFormatter', () => {
    describe('getLanguage', () => {
        it('maps Norwegian to the moment locale that exists', () => {
            expect(new DateFormatter('no').getLanguage()).toBe('nb');
        });

        it('resolves a regional tag to its primary subtag', () => {
            expect(new DateFormatter('nb-NO').getLanguage()).toBe('nb');
            expect(new DateFormatter('no-NO').getLanguage()).toBe('nb');
            expect(new DateFormatter('SV-SE').getLanguage()).toBe('sv');
        });
    });
});
