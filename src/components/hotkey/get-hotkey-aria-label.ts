import { tokenizeHotkeyString } from '../../util/hotkeys';
import { formatDisplayToken } from './format-display-token';

/**
 * Get the text that a screen reader reads for a hotkey, e.g. `"Command K"`.
 *
 * @param hotkey - The hotkey string, e.g. `"meta+k"`.
 * @param isApple - Whether the current device is an Apple device.
 */
export function getHotkeyAriaLabel(hotkey: string, isApple: boolean): string {
    return tokenizeHotkeyString(hotkey)
        .map((token) => formatDisplayToken(token, isApple).ariaName)
        .filter(Boolean)
        .join(' ');
}
