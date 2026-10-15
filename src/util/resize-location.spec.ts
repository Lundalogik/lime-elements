import {
    getKeyboardSizeChange,
    getOrientation,
    measureSize,
    ResizeLocation,
} from './resize-location';

describe('getOrientation', () => {
    it.each([
        ['left', 'vertical'],
        ['right', 'vertical'],
        ['top', 'horizontal'],
        ['bottom', 'horizontal'],
    ] as const)(
        'returns the orientation of a %s handle',
        (location, expected) => {
            expect(getOrientation(location)).toBe(expected);
        }
    );
});

describe('getKeyboardSizeChange', () => {
    it.each([
        ['left', 'ArrowLeft', 8],
        ['left', 'ArrowRight', -8],
        ['right', 'ArrowRight', 8],
        ['right', 'ArrowLeft', -8],
        ['top', 'ArrowUp', 8],
        ['top', 'ArrowDown', -8],
        ['bottom', 'ArrowDown', 8],
        ['bottom', 'ArrowUp', -8],
    ] as const)(
        'makes a %s handle change the size by %i px for %s',
        (location, key, change) => {
            expect(getKeyboardSizeChange(location, key)).toBe(change);
        }
    );

    it.each([
        ['left', 'ArrowUp'],
        ['left', 'ArrowDown'],
        ['right', 'ArrowUp'],
        ['right', 'ArrowDown'],
        ['top', 'ArrowLeft'],
        ['top', 'ArrowRight'],
        ['bottom', 'ArrowLeft'],
        ['bottom', 'ArrowRight'],
        ['left', 'Enter'],
        ['bottom', 'a'],
    ] as const)('does not resize a %s handle for %s', (location, key) => {
        expect(getKeyboardSizeChange(location, key)).toBeUndefined();
    });
});

describe('measureSize', () => {
    const element = { offsetWidth: 400, offsetHeight: 200 } as HTMLElement;

    it.each([
        ['left', 400],
        ['right', 400],
        ['top', 200],
        ['bottom', 200],
    ] as [ResizeLocation, number][])(
        "returns the %s handle's dimension: %i",
        (location, expected) => {
            expect(measureSize(element, location)).toBe(expected);
        }
    );
});
