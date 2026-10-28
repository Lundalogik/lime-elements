import { isHeadingLevel } from './heading-level';

test('the numbers from 1 to 6 are heading levels', () => {
    expect([1, 2, 3, 4, 5, 6].every(isHeadingLevel)).toBe(true);
});

test('nothing else is a heading level', () => {
    expect([0, 7, 1.5, NaN, '3', undefined, null].some(isHeadingLevel)).toBe(
        false
    );
});
