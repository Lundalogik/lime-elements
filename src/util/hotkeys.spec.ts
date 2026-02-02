import {
    hotkeyFromKeyboardEvent,
    normalizeHotkeyString,
    tokenizeHotkeyString,
} from './hotkeys';

describe('hotkeys util', () => {
    describe('tokenizeHotkeyString', () => {
        it('returns empty array for empty string', () => {
            expect(tokenizeHotkeyString('')).toEqual([]);
        });

        it('returns empty array for whitespace-only string', () => {
            expect(tokenizeHotkeyString('   ')).toEqual([]);
        });

        it('returns empty array for null/undefined', () => {
            expect(tokenizeHotkeyString(null as any)).toEqual([]);
            expect(tokenizeHotkeyString(undefined as any)).toEqual([]);
        });

        it('tokenizes a single key', () => {
            expect(tokenizeHotkeyString('a')).toEqual(['a']);
        });

        it('tokenizes modifier+key', () => {
            expect(tokenizeHotkeyString('ctrl+k')).toEqual(['ctrl', 'k']);
        });

        it('handles + as a standalone key', () => {
            expect(tokenizeHotkeyString('+')).toEqual(['+']);
        });

        it('handles ++ as modifier followed by literal +', () => {
            expect(tokenizeHotkeyString('meta++')).toEqual(['meta', '+']);
        });

        it('handles +++ as modifier + literal + key', () => {
            expect(tokenizeHotkeyString('ctrl+++')).toEqual(['ctrl', '+']);
        });

        it('trims whitespace from tokens', () => {
            expect(tokenizeHotkeyString(' ctrl + k ')).toEqual(['ctrl', 'k']);
        });

        it('handles spaced + as literal plus key', () => {
            expect(tokenizeHotkeyString('ctrl + +')).toEqual(['ctrl', '+']);
        });
    });

    describe('normalizeHotkeyString', () => {
        it('returns null for null/undefined/empty', () => {
            expect(normalizeHotkeyString(null as any)).toBeNull();
            expect(normalizeHotkeyString(undefined as any)).toBeNull();
            expect(normalizeHotkeyString('')).toBeNull();
        });

        it('returns null for modifier-only input', () => {
            expect(normalizeHotkeyString('ctrl+shift')).toBeNull();
            expect(normalizeHotkeyString('meta')).toBeNull();
        });

        it('resolves aliases to canonical names', () => {
            expect(normalizeHotkeyString('cmd+k')).toBe('meta+k');
            expect(normalizeHotkeyString('command+k')).toBe('meta+k');
            expect(normalizeHotkeyString('option+x')).toBe('alt+x');
            expect(normalizeHotkeyString('control+a')).toBe('ctrl+a');
            expect(normalizeHotkeyString('return')).toBe('enter');
            expect(normalizeHotkeyString('esc')).toBe('escape');
        });

        it('orders modifiers as meta+ctrl+alt+shift', () => {
            expect(normalizeHotkeyString('shift+ctrl+alt+meta+k')).toBe(
                'meta+ctrl+alt+shift+k'
            );
        });

        it('keeps + as a key', () => {
            expect(normalizeHotkeyString('+')).toBe('+');
        });

        it('supports ++ as the + key token', () => {
            expect(normalizeHotkeyString('meta++')).toBe('meta++');
        });

        it('drops shift for the + key to match KeyboardEvent canonicalization', () => {
            expect(normalizeHotkeyString('ctrl+shift++')).toBe('ctrl++');
        });

        it('handles spaced + as literal plus key', () => {
            expect(normalizeHotkeyString('ctrl + +')).toBe('ctrl++');
        });

        it('keeps backspace and delete as distinct keys', () => {
            expect(normalizeHotkeyString('backspace')).toBe('backspace');
            expect(normalizeHotkeyString('delete')).toBe('delete');
            expect(normalizeHotkeyString('del')).toBe('delete');
        });
    });

    describe('hotkeyFromKeyboardEvent', () => {
        it('returns null for pure modifier presses', () => {
            expect(
                hotkeyFromKeyboardEvent({
                    key: 'Shift',
                    code: 'ShiftLeft',
                    altKey: false,
                    ctrlKey: false,
                    metaKey: false,
                    shiftKey: true,
                } as any)
            ).toBeNull();

            expect(
                hotkeyFromKeyboardEvent({
                    key: 'Control',
                    code: 'ControlLeft',
                    altKey: false,
                    ctrlKey: true,
                    metaKey: false,
                    shiftKey: false,
                } as any)
            ).toBeNull();
        });

        it('includes multiple modifiers', () => {
            const pressed = hotkeyFromKeyboardEvent({
                key: 'a',
                code: 'KeyA',
                altKey: true,
                ctrlKey: true,
                metaKey: false,
                shiftKey: false,
            } as any);

            expect(pressed).toBe('ctrl+alt+a');
        });

        it('handles function keys', () => {
            expect(
                hotkeyFromKeyboardEvent({
                    key: 'F1',
                    code: 'F1',
                    altKey: false,
                    ctrlKey: false,
                    metaKey: false,
                    shiftKey: false,
                } as any)
            ).toBe('f1');

            expect(
                hotkeyFromKeyboardEvent({
                    key: 'F12',
                    code: 'F12',
                    altKey: false,
                    ctrlKey: false,
                    metaKey: false,
                    shiftKey: false,
                } as any)
            ).toBe('f12');
        });

        it('handles arrow keys', () => {
            expect(
                hotkeyFromKeyboardEvent({
                    key: 'ArrowLeft',
                    code: 'ArrowLeft',
                    altKey: false,
                    ctrlKey: false,
                    metaKey: false,
                    shiftKey: false,
                } as any)
            ).toBe('arrowleft');

            expect(
                hotkeyFromKeyboardEvent({
                    key: 'ArrowRight',
                    code: 'ArrowRight',
                    altKey: false,
                    ctrlKey: false,
                    metaKey: false,
                    shiftKey: false,
                } as any)
            ).toBe('arrowright');
        });

        it('uses event.code for non-QWERTY letter normalization', () => {
            const pressed = hotkeyFromKeyboardEvent({
                key: '@',
                code: 'KeyQ',
                altKey: false,
                ctrlKey: false,
                metaKey: false,
                shiftKey: false,
            } as any);

            // Uses code "KeyQ" to normalize to "q" (layout-independent)
            expect(pressed).toBe('q');
        });

        it('uses event.code for digit normalization', () => {
            const pressed = hotkeyFromKeyboardEvent({
                key: ')',
                code: 'Digit0',
                altKey: false,
                ctrlKey: false,
                metaKey: false,
                shiftKey: false,
            } as any);

            // Uses code "Digit0" to normalize to "0" (layout-independent)
            expect(pressed).toBe('0');
        });

        it('does not include shift for the + key', () => {
            const pressed = hotkeyFromKeyboardEvent({
                key: '+',
                code: 'Equal',
                altKey: false,
                ctrlKey: false,
                metaKey: false,
                shiftKey: true,
            } as any);

            expect(pressed).toBe('+');
        });

        it('still includes shift for letter keys', () => {
            const pressed = hotkeyFromKeyboardEvent({
                key: 'A',
                code: 'KeyA',
                altKey: false,
                ctrlKey: false,
                metaKey: false,
                shiftKey: true,
            } as any);

            expect(pressed).toBe('shift+a');
        });

        it('keeps Backspace and Delete as distinct keys', () => {
            const backspace = hotkeyFromKeyboardEvent({
                key: 'Backspace',
                code: 'Backspace',
                altKey: false,
                ctrlKey: false,
                metaKey: false,
                shiftKey: false,
            } as any);

            const del = hotkeyFromKeyboardEvent({
                key: 'Delete',
                code: 'Delete',
                altKey: false,
                ctrlKey: false,
                metaKey: false,
                shiftKey: false,
            } as any);

            expect(backspace).toBe('backspace');
            expect(del).toBe('delete');
        });
    });
});
