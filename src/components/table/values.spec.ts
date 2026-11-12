import { isEmpty, toNumber, toText } from './values';

describe('isEmpty', () => {
    it('is true for null, undefined and an empty string', () => {
        expect(isEmpty(null)).toBe(true);
        expect(isEmpty(undefined)).toBe(true);
        expect(isEmpty('')).toBe(true);
    });

    it('is false for 0 and false', () => {
        expect(isEmpty(0)).toBe(false);
        expect(isEmpty(false)).toBe(false);
    });
});

describe('toNumber', () => {
    it('returns numbers and numeric strings as numbers', () => {
        expect(toNumber(12)).toBe(12);
        expect(toNumber('12.5')).toBe(12.5);
    });

    it('returns nothing for anything else', () => {
        expect(toNumber('')).toBeUndefined();
        expect(toNumber('  ')).toBeUndefined();
        expect(toNumber('text')).toBeUndefined();
        expect(toNumber(NaN)).toBeUndefined();
        expect(toNumber(true)).toBeUndefined();
        expect(toNumber(null)).toBeUndefined();
    });
});

describe('toText', () => {
    it('shows numbers and booleans as text', () => {
        expect(toText(0)).toBe('0');
        expect(toText(false)).toBe('false');
    });

    it('shows nothing for missing values', () => {
        expect(toText(null)).toBe('');
        expect(toText(undefined)).toBe('');
    });

    it('shows a list as its items, separated by commas', () => {
        expect(toText(['sales', 'vip'])).toBe('sales,vip');
    });

    it('shows a date and other objects with a text form of their own', () => {
        const date = new Date('2024-05-01T10:00:00Z');

        expect(toText(date)).toBe(date.toString());
        expect(toText({ toString: () => 'custom' })).toBe('custom');
    });

    it('shows nothing for plain objects and functions', () => {
        expect(toText({ foo: 'bar' })).toBe('');
        expect(toText(() => 'text')).toBe('');
    });

    it('shows nothing for an object whose text form cannot be called', () => {
        expect(toText(Object.create(null))).toBe('');
        expect(toText({ toString: null })).toBe('');
    });
});
