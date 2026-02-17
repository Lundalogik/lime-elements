interface AddressListSplitState {
    inQuotes: boolean;
    escapeNext: boolean;
    angleDepth: number;
}

/**
 * Splits a comma-separated email address list (e.g. `To:` / `Cc:`) into individual
 * recipient strings.
 *
 * In RFC 5322, address lists are comma-separated. However, commas can also appear
 * inside quoted display names (quoted-string) and must then be ignored as separators.
 * This splitter only treats a comma as a separator when it is outside quoted strings
 * and outside angle-bracketed address parts (`<...>`).
 *
 * Notes:
 * - If a display name contains a comma, it should be quoted or encoded to be
 *   unambiguous, e.g. `"Doe, Jane" <jane.doe@example.com>` or
 *   `=?UTF-8?Q?Doe,_Jane?= <jane.doe@example.com>`.
 * - Real-world `.eml` files are usually RFC-ish but not always perfectly compliant.
 *   Malformed input with unquoted commas in display names may be split incorrectly.
 *
 * @param value - A comma-separated list of recipients.
 * @returns An array of trimmed recipient strings.
 *
 * @example
 * splitEmailAddressList('"Doe, Jane" <jane@example.com>, Team <team@example.com>');
 * // => ['"Doe, Jane" <jane@example.com>', 'Team <team@example.com>']
 */
export function splitEmailAddressList(value: string): string[] {
    const parts: string[] = [];
    let current = '';
    const state: AddressListSplitState = {
        inQuotes: false,
        escapeNext: false,
        angleDepth: 0,
    };

    const append = (character: string) => {
        current += character;
    };

    const flush = () => {
        const trimmed = current.trim();
        if (trimmed) {
            parts.push(trimmed);
        }
        current = '';
    };

    for (const character of value) {
        if (consumeEscaped(character, state, append)) {
            continue;
        }

        if (beginEscape(character, state, append)) {
            continue;
        }

        if (toggleQuote(character, state, append)) {
            continue;
        }

        if (adjustAngleDepth(character, state, append)) {
            continue;
        }

        if (isAddressSeparator(character, state)) {
            flush();
            continue;
        }

        append(character);
    }

    flush();

    return parts;
}

function consumeEscaped(
    character: string,
    state: AddressListSplitState,
    append: (character: string) => void
): boolean {
    if (!state.escapeNext) {
        return false;
    }

    append(character);
    state.escapeNext = false;

    return true;
}

function beginEscape(
    character: string,
    state: AddressListSplitState,
    append: (character: string) => void
): boolean {
    if (!state.inQuotes || character !== '\\') {
        return false;
    }

    append(character);
    state.escapeNext = true;

    return true;
}

function toggleQuote(
    character: string,
    state: AddressListSplitState,
    append: (character: string) => void
): boolean {
    if (character !== '"' || state.angleDepth !== 0) {
        return false;
    }

    append(character);
    state.inQuotes = !state.inQuotes;

    return true;
}

function adjustAngleDepth(
    character: string,
    state: AddressListSplitState,
    append: (character: string) => void
): boolean {
    if (state.inQuotes) {
        return false;
    }

    if (character === '<') {
        append(character);
        state.angleDepth += 1;

        return true;
    }

    if (character !== '>' || state.angleDepth === 0) {
        return false;
    }

    append(character);
    state.angleDepth -= 1;

    return true;
}

function isAddressSeparator(
    character: string,
    state: AddressListSplitState
): boolean {
    return character === ',' && !state.inQuotes && state.angleDepth === 0;
}
