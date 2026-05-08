import {
    compositeOver,
    contrastRatio,
    parseColor,
    relativeLuminance,
} from './adapt-color-contrast';

describe('parseColor', () => {
    it.each([
        ['rgb(0, 0, 0)', { r: 0, g: 0, b: 0, a: 1 }],
        ['rgb(255,255,255)', { r: 255, g: 255, b: 255, a: 1 }],
        ['rgba(10, 20, 30, 0.5)', { r: 10, g: 20, b: 30, a: 0.5 }],
        ['rgba(10, 20, 30, 1)', { r: 10, g: 20, b: 30, a: 1 }],
    ])('parses "%s"', (input, expected) => {
        expect(parseColor(input)).toEqual(expected);
    });

    it('treats "transparent" as fully transparent black', () => {
        expect(parseColor('transparent')).toEqual({ r: 0, g: 0, b: 0, a: 0 });
    });

    it.each(['', 'red', '#fff', 'hsl(0, 0%, 0%)', 'currentColor', null as any])(
        'returns null for unsupported input "%s"',
        (input) => {
            expect(parseColor(input)).toBeNull();
        }
    );
});

describe('relativeLuminance', () => {
    it('returns 1 for pure white', () => {
        expect(relativeLuminance({ r: 255, g: 255, b: 255 })).toBeCloseTo(1, 5);
    });

    it('returns 0 for pure black', () => {
        expect(relativeLuminance({ r: 0, g: 0, b: 0 })).toBeCloseTo(0, 5);
    });

    it('is monotonic across grayscale', () => {
        const dark = relativeLuminance({ r: 50, g: 50, b: 50 });
        const mid = relativeLuminance({ r: 128, g: 128, b: 128 });
        const light = relativeLuminance({ r: 200, g: 200, b: 200 });
        expect(dark).toBeLessThan(mid);
        expect(mid).toBeLessThan(light);
    });
});

describe('contrastRatio', () => {
    it('returns 21 for black on white (and vice versa)', () => {
        const black = relativeLuminance({ r: 0, g: 0, b: 0 });
        const white = relativeLuminance({ r: 255, g: 255, b: 255 });
        expect(contrastRatio(black, white)).toBeCloseTo(21, 1);
        expect(contrastRatio(white, black)).toBeCloseTo(21, 1);
    });

    it('returns 1 for identical colors', () => {
        const l = relativeLuminance({ r: 128, g: 128, b: 128 });
        expect(contrastRatio(l, l)).toBe(1);
    });

    it('passes WCAG AA for a dark navy on white', () => {
        const navy = relativeLuminance({ r: 0x1f, g: 0x49, b: 0x7d });
        const white = relativeLuminance({ r: 255, g: 255, b: 255 });
        expect(contrastRatio(navy, white)).toBeGreaterThan(4.5);
    });
});

describe('compositeOver', () => {
    it('returns the foreground when alpha is 1', () => {
        const fg = { r: 100, g: 150, b: 200, a: 1 };
        const bg = { r: 0, g: 0, b: 0 };
        expect(compositeOver(fg, bg)).toEqual({ r: 100, g: 150, b: 200 });
    });

    it('returns the background when alpha is 0', () => {
        const fg = { r: 100, g: 150, b: 200, a: 0 };
        const bg = { r: 50, g: 60, b: 70 };
        expect(compositeOver(fg, bg)).toEqual({ r: 50, g: 60, b: 70 });
    });

    it('blends 50/50 when alpha is 0.5', () => {
        const fg = { r: 0, g: 0, b: 0, a: 0.5 };
        const bg = { r: 255, g: 255, b: 255 };
        expect(compositeOver(fg, bg)).toEqual({ r: 128, g: 128, b: 128 });
    });
});
