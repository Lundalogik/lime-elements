import { Badge } from './badge';

describe('limel-badge', () => {
    const badge = new Badge();
    it('builds', () => {
        expect(badge).toBeTruthy();
    });

    it('Badge: returns 950 (3 digits)', () => {
        const expectedCounter = (badge.label = 950);
        const actualNumber = badge.showRoundedNumber();
        expect(actualNumber).toBe(expectedCounter);
    });

    it('Badge: returns 10k (4 digits)', () => {
        const expectedCounter = '10k';
        badge.label = 9960;
        const actualNumber = badge.showRoundedNumber();
        expect(actualNumber).toBe(expectedCounter);
    });

    it('Badge: returns 99.9k (5 digits), not round up to 100k', () => {
        const expectedNumber = '99.9k';
        badge.label = 99940;
        const actualNumber = badge.showRoundedNumber();
        expect(actualNumber).toBe(expectedNumber);
    });

    it('Badge: returns 1M (6 digits)', () => {
        const expectedNumber = '1M';
        badge.label = 999990;
        const actualNumber = badge.showRoundedNumber();
        expect(actualNumber).toBe(expectedNumber);
    });
});
