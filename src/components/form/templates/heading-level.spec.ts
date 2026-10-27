import { isHeadingLevel, nextHeadingLevel } from './heading-level';

test('the next heading level is one more than the level', () => {
    expect(nextHeadingLevel(1)).toBe(2);
    expect(nextHeadingLevel(4)).toBe(5);
});

test('there is no heading level below h6', () => {
    expect(nextHeadingLevel(6)).toBe(6);
});

test('the numbers from 1 to 6 are heading levels', () => {
    expect([1, 2, 3, 4, 5, 6].every(isHeadingLevel)).toBe(true);
});

test('nothing else is a heading level', () => {
    expect([0, 7, 1.5, NaN, '3', undefined, null].some(isHeadingLevel)).toBe(
        false
    );
});
