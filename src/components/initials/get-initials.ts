import { InitialsNameType } from './initials.types';

/**
 * Legal-form tokens dropped from a company name, matched anywhere in it, so
 * that `AB Volvo` reads `V` rather than `AV`. See `get-initials.spec.ts` for
 * the cases this set is chosen against.
 */
const LEGAL_FORM_TOKENS: ReadonlySet<string> = new Set([
    // Nordics
    'ab',
    'hb',
    'kb',
    'as',
    'asa',
    'a/s',
    'aps',
    'oy',
    'oyj',
    'ou',
    'oü',
    'hf',
    'ehf',
    // German-speaking
    'ag',
    'gmbh',
    'mbh',
    'ug',
    'kg',
    'kgaa',
    'gbr',
    // Benelux
    'bv',
    'nv',
    'vof',
    // Romance
    'sa',
    'sas',
    'sarl',
    'srl',
    'spa',
    'lda',
    // Anglosphere
    'ltd',
    'inc',
    'llc',
    'llp',
    'plc',
    'pty',
    'pte',
    'sdn',
    'bhd',
    // Baltic and Central European
    'uab',
    'sia',
    'kft',
    'zrt',
    'ооо',
    'зао',
    'оао',
    'пао',
    'ао',
]);

const LETTER = /\p{L}/u;

/**
 * Decimal digits only: a superscript or a fraction is punctuation here.
 */
const LETTER_OR_DIGIT = /[\p{L}\p{Nd}]/u;

const LETTER_NUMBER_OR_MARK = /[\p{L}\p{N}\p{M}]/u;

/**
 * Latin, Greek and Cyrillic letters, digits, punctuation, symbols and spaces.
 * Without a mark or a format character among them, every code point is a
 * grapheme of its own, so such a name is walked by code point, which is much
 * cheaper than segmenting. Any other text goes to the segmenter.
 */
const SIMPLE_TEXT =
    /^[\p{Script=Latin}\p{Script=Greek}\p{Script=Cyrillic}\p{N}\p{P}\p{S}\p{Z}]*$/u;

const MARK_OR_FORMAT = /[\p{M}\p{Cf}]/u;

const MAX_INITIALS_LENGTH = 3;

const MAX_NAME_LENGTH = 128;

interface WordRules {
    stripLegalForms: boolean;
    keepWholeToken: boolean;
    readLastWord: boolean;
}

/**
 * Works out the letters to show in the tile.
 *
 * @param name - The name to read.
 * @param nameType - How to read the name. Defaults to `default`.
 * @returns One to three uppercase letters or digits, or `undefined` when the
 * name has none.
 */
export function getInitials(
    name: string | undefined | null,
    nameType: InitialsNameType = 'default'
): string | undefined {
    switch (nameType) {
        case 'company': {
            return getCompanyInitials(name);
        }
        case 'initials': {
            return getGivenInitials(name);
        }
        case 'default': {
            return getDefaultInitials(name);
        }
        default: {
            warnAboutUnknownNameType(nameType);

            return getDefaultInitials(name);
        }
    }
}

const warnedNameTypes = new Set<string>();

function warnAboutUnknownNameType(nameType: string) {
    if (warnedNameTypes.has(nameType)) {
        return;
    }

    warnedNameTypes.add(nameType);
    console.warn(
        `limel-initials: unknown nameType "${nameType}"; using the default rule`
    );
}

/**
 * The first letter of each of the first two words, once legal forms are
 * removed. A short all-capitals first word is kept whole instead.
 *
 * `Vara Metallindustri HB` → `VM`, `AB Volvo` → `V`, `TNK Logistics` → `TNK`.
 *
 * @param name - The company name.
 * @returns One to three uppercase letters or digits, or `undefined`.
 */
export function getCompanyInitials(
    name: string | undefined | null
): string | undefined {
    return initialsFromWords(name, {
        stripLegalForms: true,
        keepWholeToken: true,
        readLastWord: false,
    });
}

/**
 * The first letter of the first, the second and the last word, so that
 * `Anna Maria Svensson` reads `AMS` and `Jan Erik Karl Berg` reads `JEB`.
 * The company rules stay off, or `Ab Rahman` would read `R`.
 *
 * @param name - The name.
 * @returns One to three uppercase letters or digits, or `undefined`.
 */
export function getDefaultInitials(
    name: string | undefined | null
): string | undefined {
    return initialsFromWords(name, {
        stripLegalForms: false,
        keepWholeToken: false,
        readLastWord: true,
    });
}

function getGivenInitials(
    initials: string | undefined | null
): string | undefined {
    if (!initials) {
        return undefined;
    }

    const chars = initialCharsOf(
        initials.slice(0, MAX_NAME_LENGTH),
        MAX_INITIALS_LENGTH
    );

    return chars.length > 0
        ? chars.map((char) => toInitial(char)).join('')
        : undefined;
}

function initialsFromWords(
    name: string | undefined | null,
    rules: WordRules
): string | undefined {
    const words = pickWords(readableWords(name, rules), rules);

    if (words.length === 0) {
        return undefined;
    }

    if (rules.keepWholeToken) {
        const whole = asWholeToken(words[0]);

        if (whole && LETTER.test(words[0])) {
            return whole;
        }

        if (whole) {
            const next = words[1] ? firstInitial(words[1]) : undefined;

            return [...graphemes(whole), ...(next ? [next] : [])]
                .slice(0, MAX_INITIALS_LENGTH)
                .join('');
        }
    }

    return words
        .map((word) => firstInitial(word))
        .filter((initial): initial is string => !!initial)
        .join('');
}

function pickWords(words: string[], rules: WordRules): string[] {
    if (!rules.readLastWord || words.length <= MAX_INITIALS_LENGTH) {
        return words;
    }

    return [words[0], words[1], words.at(-1)!];
}

function readableWords(
    name: string | undefined | null,
    rules: WordRules
): string[] {
    if (!name) {
        return [];
    }

    const words: string[] = [];

    for (const token of name.trim().slice(0, MAX_NAME_LENGTH).split(/\s+/)) {
        const word = trimPunctuation(token);
        const skip =
            !word ||
            !LETTER_OR_DIGIT.test(word) ||
            (rules.stripLegalForms &&
                LEGAL_FORM_TOKENS.has(word.normalize('NFC').toLowerCase()));

        if (!skip) {
            words.push(word);
        }

        if (!rules.readLastWord && words.length === 2) {
            break;
        }
    }

    return words;
}

/**
 * Trims only the edges, so `Ltd.` and `(AB)` are recognised as legal forms
 * while the slash in `A/S` survives.
 *
 * @param token - The raw token.
 * @returns The token without leading or trailing punctuation.
 */
function trimPunctuation(token: string): string {
    let start = -1;
    let end = 0;
    let index = 0;

    for (const character of token) {
        if (LETTER_NUMBER_OR_MARK.test(character)) {
            if (start < 0) {
                start = index;
            }

            end = index + character.length;
        }

        index += character.length;
    }

    return start < 0 ? '' : token.slice(start, end);
}

function firstInitial(word: string): string | undefined {
    for (const grapheme of graphemes(word)) {
        if (LETTER_OR_DIGIT.test(grapheme)) {
            return toInitial(grapheme);
        }
    }

    return undefined;
}

/**
 * Composing first keeps an accent attached. Taking the first grapheme of the
 * uppercase form keeps a vowel sign with its letter, as in `की`, and bounds an
 * uppercase mapping that expands, such as `ﬁ` → `FI`.
 *
 * @param grapheme - The letter to reduce.
 * @returns A single uppercase letter.
 */
function toInitial(grapheme: string): string {
    const uppercase = grapheme.normalize('NFC').toLocaleUpperCase();

    return graphemes(uppercase).next().value ?? uppercase;
}

/**
 * Counts letters as a reader sees them, so that a vowel sign or an accent
 * written as its own code point does not count as a letter of its own.
 *
 * @param value - The initials to count.
 * @returns The number of graphemes in `value`.
 */
export function countGraphemes(value: string): number {
    return [...graphemes(value)].length;
}

function initialCharsOf(word: string, max: number): string[] {
    const chars: string[] = [];

    for (const grapheme of graphemes(word)) {
        if (!LETTER_OR_DIGIT.test(grapheme)) {
            continue;
        }

        chars.push(grapheme);

        if (chars.length === max) {
            break;
        }
    }

    return chars;
}

/**
 * A short first word written in capitals, or made of digits, is how people
 * know the company (`TNK`, `3M`), so it is kept whole. A word with letters
 * must be all-capitals, and not in a caseless script.
 *
 * @param word - A single word, already trimmed of punctuation.
 * @returns The word's letters and digits, or `undefined`.
 */
function asWholeToken(word: string): string | undefined {
    const chars = initialCharsOf(word, MAX_INITIALS_LENGTH + 1);

    if (chars.length < 2 || chars.length > MAX_INITIALS_LENGTH) {
        return undefined;
    }

    if (
        LETTER.test(word) &&
        (word !== word.toLocaleUpperCase() || word === word.toLocaleLowerCase())
    ) {
        return undefined;
    }

    return chars.map((char) => toInitial(char)).join('');
}

function needsSegmenter(value: string): boolean {
    return !SIMPLE_TEXT.test(value) || MARK_OR_FORMAT.test(value);
}

function* graphemes(value: string): Generator<string> {
    const segmenter = needsSegmenter(value) ? getSegmenter() : undefined;

    if (!segmenter) {
        yield* value;

        return;
    }

    for (const { segment } of segmenter.segment(value)) {
        yield segment;
    }
}

let sharedSegmenter: Intl.Segmenter | undefined | null = null;

function getSegmenter(): Intl.Segmenter | undefined {
    if (sharedSegmenter === null) {
        try {
            // eslint-disable-next-line unicorn/no-top-level-assignment-in-function -- built once, shared by every call
            sharedSegmenter = new Intl.Segmenter(undefined, {
                granularity: 'grapheme',
            });
        } catch {
            // eslint-disable-next-line unicorn/no-top-level-assignment-in-function -- remembered, so it is not retried per name
            sharedSegmenter = undefined;
        }
    }

    return sharedSegmenter;
}
