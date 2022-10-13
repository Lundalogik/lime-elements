import { abbreviate } from './format';

describe('limel-badge', () => {
    it('Badge: returns 950 (3 digits)', () => {
        expect(abbreviate(950)).toBe(950);
    });

    it('Badge: returns 10k (4 digits)', () => {
        expect(abbreviate(9960)).toBe('10k');
    });

    it('Badge: returns 99.9k (5 digits), not round up to 100k', () => {
        expect(abbreviate(99940)).toBe('99.9k');
    });

    it('Badge: returns 1M (6 digits)', () => {
        expect(abbreviate(999990)).toBe('1M');
    });
});
