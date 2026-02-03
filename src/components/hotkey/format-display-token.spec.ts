import { formatDisplayToken } from './format-display-token';

describe('formatDisplayToken', () => {
    describe('empty / null input', () => {
        it('returns empty display for empty string', () => {
            expect(formatDisplayToken('', true)).toEqual({
                display: '',
                isGlyph: false,
                ariaName: '',
            });
        });

        it('returns empty display for null', () => {
            expect(formatDisplayToken(null as any, true)).toEqual({
                display: '',
                isGlyph: false,
                ariaName: '',
            });
        });

        it('returns empty display for whitespace-only', () => {
            expect(formatDisplayToken('   ', false)).toEqual({
                display: '',
                isGlyph: false,
                ariaName: '',
            });
        });
    });

    describe('literal + key', () => {
        it('returns + as-is', () => {
            expect(formatDisplayToken('+', true)).toEqual({
                display: '+',
                isGlyph: false,
                ariaName: 'plus',
            });
        });
    });

    describe('meta key (platform-dependent)', () => {
        it('returns ⌘ on Apple', () => {
            expect(formatDisplayToken('meta', true)).toEqual({
                display: '⌘',
                isGlyph: true,
                ariaName: 'Command',
            });
        });

        it('returns ⊞ Win on non-Apple', () => {
            expect(formatDisplayToken('meta', false)).toEqual({
                display: '⊞ Win',
                isGlyph: false,
                ariaName: 'Windows',
            });
        });
    });

    describe('win / windows (same as meta)', () => {
        it('returns ⌘ for win on Apple', () => {
            expect(formatDisplayToken('win', true)).toEqual({
                display: '⌘',
                isGlyph: true,
                ariaName: 'Command',
            });
        });

        it('returns ⊞ Win for win on non-Apple', () => {
            expect(formatDisplayToken('win', false)).toEqual({
                display: '⊞ Win',
                isGlyph: false,
                ariaName: 'Windows',
            });
        });

        it('returns ⊞ Win for windows on non-Apple', () => {
            expect(formatDisplayToken('windows', false)).toEqual({
                display: '⊞ Win',
                isGlyph: false,
                ariaName: 'Windows',
            });
        });
    });

    describe('cmd / command (always ⌘)', () => {
        it('returns ⌘ for cmd on Apple', () => {
            expect(formatDisplayToken('cmd', true)).toEqual({
                display: '⌘',
                isGlyph: true,
                ariaName: 'Command',
            });
        });

        it('returns ⌘ for command on non-Apple', () => {
            expect(formatDisplayToken('command', false)).toEqual({
                display: '⌘',
                isGlyph: true,
                ariaName: 'Command',
            });
        });
    });

    describe('alt / option (platform-dependent)', () => {
        it('returns ⌥ on Apple', () => {
            expect(formatDisplayToken('alt', true)).toEqual({
                display: '⌥',
                isGlyph: true,
                ariaName: 'Option',
            });
        });

        it('returns Alt on non-Apple', () => {
            expect(formatDisplayToken('alt', false)).toEqual({
                display: 'Alt',
                isGlyph: false,
                ariaName: 'Alt',
            });
        });

        it('returns ⌥ for option on Apple', () => {
            expect(formatDisplayToken('option', true)).toEqual({
                display: '⌥',
                isGlyph: true,
                ariaName: 'Option',
            });
        });
    });

    describe('shift', () => {
        it('returns ⇧', () => {
            expect(formatDisplayToken('shift', true)).toEqual({
                display: '⇧',
                isGlyph: true,
                ariaName: 'Shift',
            });
        });
    });

    describe('enter / return', () => {
        it('returns ↩ for enter', () => {
            expect(formatDisplayToken('enter', true)).toEqual({
                display: '↩',
                isGlyph: true,
                ariaName: 'Enter',
            });
        });

        it('returns ↩ for return', () => {
            expect(formatDisplayToken('return', false)).toEqual({
                display: '↩',
                isGlyph: true,
                ariaName: 'Enter',
            });
        });
    });

    describe('tab', () => {
        it('returns ⇥', () => {
            expect(formatDisplayToken('tab', true)).toEqual({
                display: '⇥',
                isGlyph: true,
                ariaName: 'Tab',
            });
        });
    });

    describe('delete / del / backspace (platform-dependent)', () => {
        it('returns ⌫ for delete on Apple', () => {
            expect(formatDisplayToken('delete', true)).toEqual({
                display: '⌫',
                isGlyph: true,
                ariaName: 'Delete',
            });
        });

        it('returns ⌫ for backspace on Apple', () => {
            expect(formatDisplayToken('backspace', true)).toEqual({
                display: '⌫',
                isGlyph: true,
                ariaName: 'Delete',
            });
        });

        it('returns Del for delete on non-Apple', () => {
            expect(formatDisplayToken('delete', false)).toEqual({
                display: 'Del',
                isGlyph: false,
                ariaName: 'Delete',
            });
        });

        it('returns Del for del on non-Apple', () => {
            expect(formatDisplayToken('del', false)).toEqual({
                display: 'Del',
                isGlyph: false,
                ariaName: 'Delete',
            });
        });

        it('returns Backspace for backspace on non-Apple', () => {
            expect(formatDisplayToken('backspace', false)).toEqual({
                display: 'Backspace',
                isGlyph: false,
                ariaName: 'Backspace',
            });
        });
    });

    describe('ctrl / control (platform-dependent)', () => {
        it('returns ⌃ for ctrl on Apple', () => {
            expect(formatDisplayToken('ctrl', true)).toEqual({
                display: '⌃',
                isGlyph: true,
                ariaName: 'Control',
            });
        });

        it('returns Ctrl for ctrl on non-Apple', () => {
            expect(formatDisplayToken('ctrl', false)).toEqual({
                display: 'Ctrl',
                isGlyph: false,
                ariaName: 'Control',
            });
        });

        it('returns ⌃ for control on Apple', () => {
            expect(formatDisplayToken('control', true)).toEqual({
                display: '⌃',
                isGlyph: true,
                ariaName: 'Control',
            });
        });

        it('returns Ctrl for control on non-Apple', () => {
            expect(formatDisplayToken('control', false)).toEqual({
                display: 'Ctrl',
                isGlyph: false,
                ariaName: 'Control',
            });
        });
    });

    describe('escape / esc', () => {
        it('returns Esc for escape', () => {
            expect(formatDisplayToken('escape', true)).toEqual({
                display: 'Esc',
                isGlyph: false,
                ariaName: 'Escape',
            });
        });

        it('returns Esc for esc', () => {
            expect(formatDisplayToken('esc', false)).toEqual({
                display: 'Esc',
                isGlyph: false,
                ariaName: 'Escape',
            });
        });
    });

    describe('space / spacebar', () => {
        it('returns ␣ for space', () => {
            expect(formatDisplayToken('space', true)).toEqual({
                display: '␣',
                isGlyph: true,
                ariaName: 'Space',
            });
        });

        it('returns ␣ for spacebar', () => {
            expect(formatDisplayToken('spacebar', false)).toEqual({
                display: '␣',
                isGlyph: true,
                ariaName: 'Space',
            });
        });
    });

    describe('arrow keys', () => {
        it('returns ↑ for arrowup', () => {
            expect(formatDisplayToken('arrowup', true)).toEqual({
                display: '↑',
                isGlyph: true,
                ariaName: 'Up',
            });
        });

        it('returns ↑ for up', () => {
            expect(formatDisplayToken('up', true)).toEqual({
                display: '↑',
                isGlyph: true,
                ariaName: 'Up',
            });
        });

        it('returns ↓ for arrowdown', () => {
            expect(formatDisplayToken('arrowdown', true)).toEqual({
                display: '↓',
                isGlyph: true,
                ariaName: 'Down',
            });
        });

        it('returns ↓ for down', () => {
            expect(formatDisplayToken('down', true)).toEqual({
                display: '↓',
                isGlyph: true,
                ariaName: 'Down',
            });
        });

        it('returns ← for arrowleft', () => {
            expect(formatDisplayToken('arrowleft', true)).toEqual({
                display: '←',
                isGlyph: true,
                ariaName: 'Left',
            });
        });

        it('returns ← for left', () => {
            expect(formatDisplayToken('left', true)).toEqual({
                display: '←',
                isGlyph: true,
                ariaName: 'Left',
            });
        });

        it('returns → for arrowright', () => {
            expect(formatDisplayToken('arrowright', true)).toEqual({
                display: '→',
                isGlyph: true,
                ariaName: 'Right',
            });
        });

        it('returns → for right', () => {
            expect(formatDisplayToken('right', true)).toEqual({
                display: '→',
                isGlyph: true,
                ariaName: 'Right',
            });
        });
    });

    describe('unrecognized tokens', () => {
        it('returns the token as-is for a letter', () => {
            expect(formatDisplayToken('k', false)).toEqual({
                display: 'k',
                isGlyph: false,
                ariaName: 'k',
            });
        });

        it('returns the token as-is for a function key', () => {
            expect(formatDisplayToken('f1', false)).toEqual({
                display: 'f1',
                isGlyph: false,
                ariaName: 'f1',
            });
        });
    });

    describe('case insensitivity', () => {
        it('handles uppercase META', () => {
            expect(formatDisplayToken('META', true)).toEqual({
                display: '⌘',
                isGlyph: true,
                ariaName: 'Command',
            });
        });

        it('handles mixed case Shift', () => {
            expect(formatDisplayToken('Shift', false)).toEqual({
                display: '⇧',
                isGlyph: true,
                ariaName: 'Shift',
            });
        });
    });
});
