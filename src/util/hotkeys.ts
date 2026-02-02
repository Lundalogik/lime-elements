/**
 * These helpers provide a consistent way to:
 * - Normalize user-defined hotkey strings (e.g. "cmd+k", "ctrl+shift+p")
 * - Normalize `KeyboardEvent`s into the same canonical hotkey format
 * - Detect when a keyboard event likely originated from a text-input context
 *
 * **Canonical format**
 * - Modifiers are ordered: `meta`, `ctrl`, `alt`, `shift`
 * - Tokens are joined with `+`
 * - The final token is the non-modifier key
 *
 * Examples:
 * - `"cmd+k"` → `"meta+k"`
 * - `"return"` → `"enter"`
 * - `"backspace"` → `"backspace"`
 * - `"alt+shift+l"` → `"alt+shift+l"`
 */
const NORMALIZED_HOTKEY_SEPARATOR = '+';

const KEY_ALIASES: Record<string, string> = {
    cmd: 'meta',
    command: 'meta',
    win: 'meta',
    windows: 'meta',
    control: 'ctrl',
    option: 'alt',
    esc: 'escape',
    return: 'enter',
    del: 'delete',
    up: 'arrowup',
    down: 'arrowdown',
    left: 'arrowleft',
    right: 'arrowright',
    spacebar: 'space',
};

export const tokenizeHotkeyString = (hotkey: string): string[] => {
    const raw = (hotkey ?? '').trim();
    if (!raw) {
        return [];
    }

    // Allow `+` as a hotkey.
    if (raw === '+') {
        return ['+'];
    }

    // Split on `+`, but treat `++` as the `+` key.
    const tokens: string[] = [];
    let current = '';
    let index = 0;

    while (index < raw.length) {
        const char = raw[index];
        if (char !== '+') {
            current += char;
            index++;
            continue;
        }

        const nextChar = raw[index + 1];
        if (nextChar === '+') {
            const token = current.trim();
            if (token) {
                tokens.push(token);
            }
            tokens.push('+');
            current = '';
            index += 2;
            continue;
        }

        const token = current.trim();
        if (token) {
            tokens.push(token);
        }
        current = '';
        index++;
    }

    const tail = current.trim();
    if (tail) {
        tokens.push(tail);
    }

    return tokens;
};

const normalizeKey = (key: string): string | null => {
    const normalized = key.trim().toLowerCase();
    if (!normalized) {
        return null;
    }

    if (KEY_ALIASES[normalized]) {
        return KEY_ALIASES[normalized];
    }

    return normalized;
};

const normalizeModifiersAndKey = (input: {
    key: string;
    alt: boolean;
    ctrl: boolean;
    meta: boolean;
    shift: boolean;
}): string | null => {
    const normalizedKey = normalizeKey(input.key);
    if (!normalizedKey) {
        return null;
    }

    // Ignore pure modifier presses
    if (['shift', 'alt', 'ctrl', 'meta'].includes(normalizedKey)) {
        return null;
    }

    const parts: string[] = [];

    if (input.meta) {
        parts.push('meta');
    }
    if (input.ctrl) {
        parts.push('ctrl');
    }
    if (input.alt) {
        parts.push('alt');
    }
    if (input.shift) {
        parts.push('shift');
    }

    parts.push(normalizedKey);

    return parts.join(NORMALIZED_HOTKEY_SEPARATOR);
};

/**
 * Normalize a user-defined hotkey string to the canonical format.
 *
 * Returns `null` for empty/invalid inputs or if the string only contains
 * modifiers (e.g. `"ctrl+shift"`).
 *
 * @param hotkey - User-provided hotkey string.
 */
export const normalizeHotkeyString = (hotkey: string): string | null => {
    if (!hotkey) {
        return null;
    }

    const tokens = tokenizeHotkeyString(hotkey);
    if (tokens.length === 0) {
        return null;
    }

    let alt = false;
    let ctrl = false;
    let meta = false;
    let shift = false;
    let key: string | null = null;

    for (const token of tokens) {
        const normalized = normalizeKey(token);
        if (!normalized) {
            continue;
        }

        if (normalized === 'alt') {
            alt = true;
            continue;
        }
        if (normalized === 'ctrl') {
            ctrl = true;
            continue;
        }
        if (normalized === 'meta') {
            meta = true;
            continue;
        }
        if (normalized === 'shift') {
            shift = true;
            continue;
        }

        // Last non-modifier wins
        key = normalized;
    }

    if (!key) {
        return null;
    }

    return normalizeModifiersAndKey({ key, alt, ctrl, meta, shift });
};

const normalizeEventKey = (event: KeyboardEvent): string | null => {
    const code = (event.code || '').trim();
    if (/^Key[A-Z]$/.test(code)) {
        return code.slice(3).toLowerCase();
    }

    if (/^Digit\d$/.test(code)) {
        return code.slice(5);
    }

    const key = event.key;

    if (key === ' ') {
        return 'space';
    }

    return normalizeKey(key);
};

/**
 * Convert a `KeyboardEvent` into a canonical hotkey string.
 *
 * Uses `event.code` when possible for letter/digit keys to avoid
 * layout-dependent results.
 *
 * @param event - Keyboard event to normalize.
 */
export const hotkeyFromKeyboardEvent = (
    event: KeyboardEvent
): string | null => {
    const key = normalizeEventKey(event);
    if (!key) {
        return null;
    }

    // `+` typically requires Shift on many keyboard layouts, but users expect to
    // write hotkeys like `meta++` (⌘+) without explicitly adding `shift`.
    const shift = key === '+' ? false : event.shiftKey;

    return normalizeModifiersAndKey({
        key,
        alt: event.altKey,
        ctrl: event.ctrlKey,
        meta: event.metaKey,
        shift,
    });
};

/**
 * Check whether a `KeyboardEvent` likely originated from a typing context.
 *
 * Returns `true` for events coming from:
 * - `input`, `textarea`, `select`
 * - `contenteditable` elements
 * - elements with `role="textbox"`
 *
 * @param event - Keyboard event to inspect.
 */
export const isKeyboardEventFromTextInput = (event: KeyboardEvent): boolean => {
    const path =
        typeof event.composedPath === 'function' ? event.composedPath() : [];

    for (const node of path) {
        if (!(node instanceof Element)) {
            continue;
        }

        if ((node as HTMLElement).isContentEditable) {
            return true;
        }

        const tagName = node.tagName;
        if (
            tagName === 'INPUT' ||
            tagName === 'TEXTAREA' ||
            tagName === 'SELECT'
        ) {
            return true;
        }

        // Common pattern: elements with role=textbox
        if (node.getAttribute('role') === 'textbox') {
            return true;
        }
    }

    return false;
};
