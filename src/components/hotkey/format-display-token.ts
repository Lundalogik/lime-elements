// Note: this function handles the same key aliases as `KEY_ALIASES` in
// `../../util/hotkeys.ts`, but maps them to display strings rather than
// canonical names. Keep both in sync when adding new aliases.

export interface DisplayToken {
    display: string;
    isGlyph: boolean;
    ariaName: string;
}

/**
 * Maps a single hotkey token to its display representation.
 *
 * @param token - A single token from `tokenizeHotkeyString` (e.g. `"meta"`, `"k"`, `"+"`).
 * @param isApple - Whether the current device is an Apple device.
 * @returns The display string, whether it is a glyph (for styling),
 *          and a human-readable name for screen readers.
 */
export function formatDisplayToken(
    token: string,
    isApple: boolean
): DisplayToken {
    const trimmed = (token ?? '').trim();
    if (!trimmed) {
        return { display: '', isGlyph: false, ariaName: '' };
    }

    if (trimmed === '+') {
        return { display: '+', isGlyph: false, ariaName: 'plus' };
    }

    const lower = trimmed.toLowerCase();

    switch (lower) {
        case 'meta':
        case 'win':
        case 'windows': {
            return isApple
                ? { display: '⌘', isGlyph: true, ariaName: 'Command' }
                : { display: '⊞ Win', isGlyph: false, ariaName: 'Windows' };
        }

        case 'cmd':
        case 'command': {
            return { display: '⌘', isGlyph: true, ariaName: 'Command' };
        }

        case 'alt':
        case 'option': {
            return isApple
                ? { display: '⌥', isGlyph: true, ariaName: 'Option' }
                : { display: 'Alt', isGlyph: false, ariaName: 'Alt' };
        }

        case 'shift': {
            return { display: '⇧', isGlyph: true, ariaName: 'Shift' };
        }

        case 'enter':
        case 'return': {
            return { display: '↩', isGlyph: true, ariaName: 'Enter' };
        }

        case 'tab': {
            return { display: '⇥', isGlyph: true, ariaName: 'Tab' };
        }

        case 'delete':
        case 'del':
        case 'backspace': {
            if (isApple) {
                return { display: '⌫', isGlyph: true, ariaName: 'Delete' };
            }
            return lower === 'backspace'
                ? {
                      display: 'Backspace',
                      isGlyph: false,
                      ariaName: 'Backspace',
                  }
                : { display: 'Del', isGlyph: false, ariaName: 'Delete' };
        }

        case 'ctrl':
        case 'control': {
            return isApple
                ? { display: '⌃', isGlyph: true, ariaName: 'Control' }
                : { display: 'Ctrl', isGlyph: false, ariaName: 'Control' };
        }

        case 'escape':
        case 'esc': {
            return { display: 'Esc', isGlyph: false, ariaName: 'Escape' };
        }

        case 'space':
        case 'spacebar': {
            return { display: '␣', isGlyph: true, ariaName: 'Space' };
        }

        case 'arrowup':
        case 'up': {
            return { display: '↑', isGlyph: true, ariaName: 'Up' };
        }

        case 'arrowdown':
        case 'down': {
            return { display: '↓', isGlyph: true, ariaName: 'Down' };
        }

        case 'arrowleft':
        case 'left': {
            return { display: '←', isGlyph: true, ariaName: 'Left' };
        }

        case 'arrowright':
        case 'right': {
            return { display: '→', isGlyph: true, ariaName: 'Right' };
        }
    }

    return { display: trimmed, isGlyph: false, ariaName: trimmed };
}
