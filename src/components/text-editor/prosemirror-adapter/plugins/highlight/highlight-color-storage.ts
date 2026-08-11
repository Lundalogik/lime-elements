import { canonicalizeColor, DEFAULT_HIGHLIGHT_COLOR } from './highlight-mark';

const STORAGE_KEY = 'limel-text-editor.highlight-color';

/**
 * Reads the user's most recently applied highlight color from localStorage.
 *
 * Storage access is defensive: when localStorage is unavailable (server-side
 * rendering) or throws (some browser privacy modes), and when the stored
 * value is missing or not a valid color, the default highlight color is
 * returned. The stored value is never trusted as-is; it is canonicalized
 * before being returned.
 *
 * @returns the stored color as a canonical color string, or
 * `DEFAULT_HIGHLIGHT_COLOR` when no valid color is stored
 */
export const getStoredHighlightColor = (): string => {
    try {
        if (typeof localStorage === 'undefined') {
            return DEFAULT_HIGHLIGHT_COLOR;
        }

        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            return DEFAULT_HIGHLIGHT_COLOR;
        }

        return canonicalizeColor(stored) ?? DEFAULT_HIGHLIGHT_COLOR;
    } catch {
        return DEFAULT_HIGHLIGHT_COLOR;
    }
};

/**
 * Persists a highlight color to localStorage, so that the next highlight
 * (from the color menu or the keyboard shortcut) defaults to it.
 *
 * Storage access is defensive: when localStorage is unavailable or throws,
 * the color is silently not persisted.
 *
 * @param color - the color to store
 */
export const storeHighlightColor = (color: string): void => {
    try {
        if (typeof localStorage === 'undefined') {
            return;
        }

        localStorage.setItem(STORAGE_KEY, color);
    } catch {
        // Persisting the color is best-effort; a storage failure must not
        // break highlighting.
    }
};
