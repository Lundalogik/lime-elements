import { hotkeyFromKeyboardEvent, normalizeHotkeyString } from './hotkeys';

describe('hotkeys util', () => {
    describe('normalizeHotkeyString', () => {
        it('keeps + as a key', () => {
            expect(normalizeHotkeyString('+')).toBe('+');
        });

        it('supports ++ as the + key token', () => {
            expect(normalizeHotkeyString('meta++')).toBe('meta++');
        });

        it('keeps backspace and delete as distinct keys', () => {
            expect(normalizeHotkeyString('backspace')).toBe('backspace');
            expect(normalizeHotkeyString('delete')).toBe('delete');
            expect(normalizeHotkeyString('del')).toBe('delete');
        });
    });

    describe('hotkeyFromKeyboardEvent', () => {
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
