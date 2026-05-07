import {
    isValidCssColorValue,
    normalizeBackgroundColor,
    sanitizeStyle,
    sanitizeStyleValue,
} from './sanitize-style';

describe('sanitizeStyle', () => {
    it('sanitizes the `style` attribute of a node with a valid `style` property', () => {
        const node = {
            tagName: 'div',
            properties: {
                style: 'font-weight: bold; position: absolute;',
            },
        };
        sanitizeStyle(node);
        expect(node.properties.style).toContain('font-weight: bold');
        expect(node.properties.style).not.toContain('position: absolute');
    });

    it('does nothing if the node does not have a `style` attribute', () => {
        const node = {
            tagName: 'div',
            properties: {},
        };
        const originalProperties = { ...node.properties };
        sanitizeStyle(node);
        expect(node.properties).toEqual(originalProperties);
    });

    it('does nothing if the node does not have `properties`', () => {
        const node = {
            tagName: 'div',
        };
        const originalNode = { ...node };
        sanitizeStyle(node);
        expect(node).toEqual(originalNode);
    });

    it('does nothing to a text node (node without `tagName`)', () => {
        const node = {
            properties: {
                style: 'font-weight: bold; position: absolute;',
            },
        };
        const originalProperties = { ...node.properties };
        sanitizeStyle(node);
        expect(node.properties).toEqual(originalProperties);
    });

    it('applies sanitization to a node with a valid `style` property and retains other properties unchanged', () => {
        const node = {
            tagName: 'div',
            properties: {
                style: 'font-weight: bold; animation: slidein 3s;',
                id: 'test-node',
            },
        };
        // 'font-weight' is allowed, but 'animation' is not. Also checks that 'id' remains unchanged.
        sanitizeStyle(node);
        expect(node.properties.style).toContain('font-weight: bold');
        expect(node.properties.style).not.toContain('animation: slidein 3s');
        expect(node.properties.id).toBe('test-node');
    });
});

describe('sanitizeStyleValue', () => {
    describe('with valid CSS', () => {
        it('retains allowed CSS properties', () => {
            const style = 'font-weight: bold; text-decoration: underline;';
            const sanitized = sanitizeStyleValue(style);
            // 'font-weight' and 'text-decoration' are in the allowedCssProperties list
            expect(sanitized).toContain('font-weight: bold');
            expect(sanitized).toContain('text-decoration: underline');
        });

        it('removes disallowed CSS properties', () => {
            const style = 'font-weight: bold; margin: 10px;';
            const sanitized = sanitizeStyleValue(style);
            // 'margin' is not in the allowedCssProperties list
            expect(sanitized).toContain('font-weight: bold');
            expect(sanitized).not.toContain('margin: 10px');
        });

        it('strips color and background-color', () => {
            // Inline colors from email content can collide with the host
            // theme (e.g. white text on a light surface), so they are not
            // preserved by the markdown sanitizer.
            const style =
                'color: blue; background-color: red; font-weight: bold;';
            const sanitized = sanitizeStyleValue(style);
            expect(sanitized).toBe('font-weight: bold');
        });
    });

    describe('with invalid CSS', () => {
        beforeEach(() => {
            // Suppress console.error output
            vi.spyOn(console, 'error').mockImplementation(() => {});
        });
        afterEach(() => {
            vi.restoreAllMocks();
        });
        it('returns an empty string for invalid CSS syntax', () => {
            const style = 'font-weight bold'; // Missing colon
            const sanitized = sanitizeStyleValue(style);
            expect(sanitized).toBe('');
        });
        it('logs an error to the console for invalid CSS syntax', () => {
            const style = 'font-weight bold'; // Missing colon
            sanitizeStyleValue(style);
            expect(console.error).toHaveBeenCalledTimes(1);
        });
    });

    describe('special cases', () => {
        it('handles CSS with semi-colon at the end correctly', () => {
            const style = 'font-weight: bold;';
            const sanitized = sanitizeStyleValue(style);
            // Ensure proper handling of trailing semi-colons
            expect(sanitized).toBe('font-weight: bold');
        });

        it('handles CSS without semi-colon at the end correctly', () => {
            const style = 'font-weight: bold';
            const sanitized = sanitizeStyleValue(style);
            expect(sanitized).toBe('font-weight: bold');
        });
    });

    describe('integration with allowedCssProperties list', () => {
        it('only retains properties specified in allowedCssProperties', () => {
            const style =
                'font-style: italic; animation: slidein 3s; font-weight: bold;';
            const sanitized = sanitizeStyleValue(style);
            // 'animation' is not allowed, 'font-style' and 'font-weight' are allowed
            expect(sanitized).toContain('font-style: italic');
            expect(sanitized).toContain('font-weight: bold');
            expect(sanitized).not.toContain('animation: slidein 3s');
        });
    });

    describe('handling of complex properties', () => {
        it('retains complex text-decoration properties when allowed', () => {
            const style =
                'text-decoration-color: red; text-decoration-line: underline; text-decoration-style: solid;';
            const sanitized = sanitizeStyleValue(style);
            // All specified properties are in the allowed list
            expect(sanitized).toContain('text-decoration-color: red');
            expect(sanitized).toContain('text-decoration-line: underline');
            expect(sanitized).toContain('text-decoration-style: solid');
        });
    });
});

describe('normalizeBackgroundColor', () => {
    it('removes the `background` property from the input object', () => {
        const css = { background: 'red', color: 'blue' };
        const result = normalizeBackgroundColor(css);
        expect(result).not.toHaveProperty('background');
        expect(css).toHaveProperty('background'); // Ensure original object is unchanged
    });

    it.each(['red', '#ff0000', 'rgb(255, 0, 0)', 'hsl(0, 100%, 50%)'])(
        'converts a valid `background` value "%s" to `background-color`',
        (colorValue) => {
            const css = { background: colorValue };
            const result = normalizeBackgroundColor(css);
            expect(result['background-color']).toBe(colorValue);
        }
    );

    it('does not add a `background-color` property if `background` is not a valid CSS color', () => {
        const css = { background: 'invalid-color', color: 'blue' };
        const result = normalizeBackgroundColor(css);
        expect(result).not.toHaveProperty('background-color');
    });

    it('retains other CSS properties unchanged', () => {
        const css = { background: 'red', color: 'blue', margin: '10px' };
        const result = normalizeBackgroundColor(css);
        expect(result.color).toBe('blue');
        expect(result.margin).toBe('10px');
    });

    it('returns a copy of the input object when there is no `background` property', () => {
        const css = { color: 'blue', margin: '10px' };
        const result = normalizeBackgroundColor(css);
        expect(result).toEqual(css);
        expect(result).not.toBe(css); // Ensure that a copy is returned
    });
});

describe('isValidCssColorValue', () => {
    describe('with named colors', () => {
        it.each(['black', 'white', 'red', 'green', 'blue'])(
            'returns true for valid named color "%s"',
            (color) => {
                expect(isValidCssColorValue(color)).toBe(true);
            }
        );

        it('returns false for an invalid named color', () => {
            expect(isValidCssColorValue('bluish')).toBe(false);
        });
    });

    describe('with hex codes', () => {
        it.each(['#000', '#000000', '#000F', '#000000FF'])(
            'returns true for valid hex code "%s"',
            (color) => {
                expect(isValidCssColorValue(color)).toBe(true);
            }
        );

        it('returns false for an invalid hex code', () => {
            expect(isValidCssColorValue('#GGG')).toBe(false);
        });
    });

    describe('with RGB/A', () => {
        it.each([
            'rgb(0,0,0)',
            'rgba(0, 0, 0, 1)',
            'rgb(255,255,255)',
            'rgba(255, 255, 255, 0.5)',
        ])('returns true for valid RGB/A value "%s"', (color) => {
            expect(isValidCssColorValue(color)).toBe(true);
        });
    });

    describe('with HSL/A', () => {
        it.each([
            'hsl(0,100%,50%)',
            'hsla(0, 100%, 50%, 1)',
            'hsl(360,100%,50%)',
            'hsla(360, 100%, 50%, 0.5)',
        ])('returns true for valid HSL/A value "%s"', (color) => {
            expect(isValidCssColorValue(color)).toBe(true);
        });
    });

    describe('with special cases not supported', () => {
        it.each([
            'currentColor',
            'inherit',
            'var(--primary-color)',
            'rgb(var(--rgb-value))',
        ])(
            'returns false for special CSS values "%s" not supported',
            (value) => {
                expect(isValidCssColorValue(value)).toBe(false);
            }
        );
    });
});
