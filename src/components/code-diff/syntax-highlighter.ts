/**
 * A syntax token representing a colored segment of code.
 */
export interface SyntaxToken {
    value: string;
    type: SyntaxTokenType;
}

export type SyntaxTokenType =
    | 'plain'
    | 'string'
    | 'number'
    | 'boolean'
    | 'null'
    | 'key'
    | 'punctuation';

/**
 * Tokenize a text fragment for syntax highlighting.
 * Returns the original text as a single plain token when the
 * language is not supported.
 *
 * @param text - the text to tokenize
 * @param language - the language identifier (e.g. "json")
 * @returns array of syntax tokens
 */
export function tokenize(text: string, language?: string): SyntaxToken[] {
    if (!language || text.length === 0) {
        return [{ value: text, type: 'plain' }];
    }

    if (language === 'json') {
        return tokenizeJson(text);
    }

    return [{ value: text, type: 'plain' }];
}

// ─── JSON tokenizer ─────────────────────────────────────────────────

/**
 * Regex-based JSON tokenizer.
 * Handles partial lines (individual lines of a JSON document).
 */
const JSON_PATTERNS: Array<[RegExp, SyntaxTokenType]> = [
    // String literals (keys and values)
    [/"(?:[^"\\]|\\.)*"/, 'string'],
    // Numbers
    [/-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/, 'number'],
    // Booleans
    [/\b(?:true|false)\b/, 'boolean'],
    // Null
    [/\bnull\b/, 'null'],
    // Punctuation
    [/[{}[\]:,]/, 'punctuation'],
];

const JSON_REGEX = new RegExp(
    JSON_PATTERNS.map(([re]) => `(${re.source})`).join('|'),
    'g'
);

function tokenizeJson(text: string): SyntaxToken[] {
    const tokens: SyntaxToken[] = [];
    let lastIndex = 0;

    JSON_REGEX.lastIndex = 0;

    let match = JSON_REGEX.exec(text);
    while (match !== null) {
        // Plain text before this match
        if (match.index > lastIndex) {
            tokens.push({
                value: text.slice(lastIndex, match.index),
                type: 'plain',
            });
        }

        // Determine which capture group matched
        const tokenType = getMatchedTokenType(match);
        const value = match[0];

        // Distinguish JSON keys from string values:
        // A key is a string followed by optional whitespace and a colon
        if (tokenType === 'string') {
            const afterMatch = text.slice(match.index + value.length);
            if (/^\s*:/.test(afterMatch)) {
                tokens.push({ value, type: 'key' });
            } else {
                tokens.push({ value, type: 'string' });
            }
        } else {
            tokens.push({ value, type: tokenType });
        }

        lastIndex = match.index + value.length;
        match = JSON_REGEX.exec(text);
    }

    // Remaining plain text
    if (lastIndex < text.length) {
        tokens.push({ value: text.slice(lastIndex), type: 'plain' });
    }

    return tokens;
}

/**
 * Determine which pattern matched by checking capture groups.
 * @param match - the regex match result
 */
function getMatchedTokenType(match: RegExpExecArray): SyntaxTokenType {
    for (const [index, [, type]] of JSON_PATTERNS.entries()) {
        if (match[index + 1] !== undefined) {
            return type;
        }
    }

    return 'plain';
}
