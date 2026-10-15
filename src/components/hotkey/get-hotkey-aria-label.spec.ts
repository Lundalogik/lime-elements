import { getHotkeyAriaLabel } from './get-hotkey-aria-label';

describe('getHotkeyAriaLabel()', () => {
    it('writes out the keys with the names of an Apple device', () => {
        expect(getHotkeyAriaLabel('meta+alt+k', true)).toBe('Command Option k');
    });

    it('writes out the keys with the names of other devices', () => {
        expect(getHotkeyAriaLabel('meta+alt+k', false)).toBe('Windows Alt k');
    });

    it('names keys that are shown as symbols', () => {
        expect(getHotkeyAriaLabel('ctrl+shift+enter', true)).toBe(
            'Control Shift Enter'
        );
    });

    it('names the plus key', () => {
        expect(getHotkeyAriaLabel('ctrl++', false)).toBe('Control plus');
    });

    it('returns an empty text for an empty hotkey', () => {
        expect(getHotkeyAriaLabel('', false)).toBe('');
    });
});
