import { nextHeadingLevel } from './heading-level';

test('the next heading level is one more than the level', () => {
    expect(nextHeadingLevel(1)).toBe(2);
    expect(nextHeadingLevel(4)).toBe(5);
});

test('there is no heading level below h6', () => {
    expect(nextHeadingLevel(6)).toBe(6);
});
