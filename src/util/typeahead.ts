/**
 * These helpers implement "type to jump", the behavior a native `<select>` has:
 * typing characters moves to the option whose text starts with those
 * characters. Characters accumulate into a short-lived buffer, so typing
 * `n`, `e` finds "Netherlands" instead of re-matching on `n` every time.
 *
 * The matching itself is pure and stateless — all the state lives in a
 * `TypeaheadBuffer`, which owns the timer that discards the buffer once the
 * user stops typing.
 */

/**
 * How long a buffer of typed characters is kept before it is discarded, in
 * milliseconds. Roughly matches a native `<select>`.
 */
export const TYPEAHEAD_BUFFER_TIMEOUT = 1000;

/**
 * Returned by `findTypeaheadMatch` when nothing matched.
 */
export const NO_TYPEAHEAD_MATCH = -1;

/**
 * An entry that typeahead can match the typed characters against.
 */
export interface TypeaheadCandidate {
    /**
     * The text to match against. Candidates without text never match.
     */
    readonly text?: string;

    /**
     * Disabled candidates are never matched.
     */
    readonly disabled?: boolean;
}

/**
 * Whether a keyboard event should be treated as a typed character.
 *
 * The space bar counts as a character here. Whether a *bare* space should
 * start a buffer, or keep whatever meaning it has in the consuming component,
 * is the consumer's decision.
 *
 * `shiftKey` is allowed, since capital letters are typed with it, and
 * `event.repeat` is allowed, since holding a key down cycles through matches
 * in a native `<select>` too.
 *
 * @param event - the keyboard event to inspect
 * @returns `true` when the event represents a typed character
 */
export function isTypeaheadKey(event: KeyboardEvent): boolean {
    return (
        event.key.length === 1 &&
        !event.altKey &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.isComposing
    );
}

/**
 * Find the candidate to move to for a given buffer of typed characters.
 *
 * Two different searches are used, mirroring a native `<select>`:
 * - When the buffer is a single character, possibly repeated (`b`, `bb`,
 *   `bbb`), only that character is matched and the search starts *after*
 *   `currentIndex`. Pressing the same key repeatedly therefore cycles through
 *   all candidates starting with it.
 * - Otherwise the whole buffer is matched and the search starts *at*
 *   `currentIndex`, so continuing to type on an already-matching candidate
 *   keeps it rather than jumping to the next one.
 *
 * Both searches wrap around the end of the list.
 *
 * @param candidates - the candidates to search, index-aligned with the rows
 * they are rendered as. Use `null` for rows that can never match, such as
 * separators, so that they still occupy their index.
 * @param buffer - the characters typed so far
 * @param currentIndex - the index to search from. Anything outside
 * `candidates` is treated as "no current candidate", and the search starts
 * from the beginning.
 * @returns the index of the matching candidate, or `NO_TYPEAHEAD_MATCH`
 */
export function findTypeaheadMatch(
    candidates: ReadonlyArray<TypeaheadCandidate | null>,
    buffer: string,
    currentIndex: number
): number {
    const count = candidates.length;
    const query = buffer.toLowerCase();
    if (!query || count === 0) {
        return NO_TYPEAHEAD_MATCH;
    }

    const characters = [...query];
    const cycles = isSingleDistinctCharacter(characters);
    const needle = cycles ? characters[0] : query;

    // Cycling starts one past the current candidate, so that pressing the same
    // key again advances. Matching several characters starts at it, so that
    // continuing to type keeps a candidate that already matches.
    const offset = cycles ? 1 : 0;
    const hasCurrent = currentIndex >= 0 && currentIndex < count;
    const start = hasCurrent ? (currentIndex + offset) % count : 0;

    for (let step = 0; step < count; step += 1) {
        const index = (start + step) % count;
        if (candidateMatches(candidates[index], needle)) {
            return index;
        }
    }

    return NO_TYPEAHEAD_MATCH;
}

/**
 * Whether a string consists of a single character, possibly repeated. Also
 * `true` for one character on its own, which is what makes a single key press
 * advance past the current candidate rather than re-matching it.
 *
 * Takes the characters already split apart, so that the caller and this
 * function agree on what "a character" is for anything outside the basic
 * multilingual plane.
 *
 * @param characters - the characters of the string
 * @returns `true` when every character is the same
 */
function isSingleDistinctCharacter(characters: readonly string[]): boolean {
    return characters.every((character) => character === characters[0]);
}

/**
 * @param candidate - the candidate to test, or `null` for a row that can
 * never match
 * @param needle - the lower cased characters to match
 * @returns `true` when the candidate starts with the given characters
 */
function candidateMatches(
    candidate: TypeaheadCandidate | null,
    needle: string
): boolean {
    if (!candidate || candidate.disabled) {
        return false;
    }

    const text = candidate.text?.trim().toLowerCase();

    return !!text && text.startsWith(needle);
}

/**
 * Accumulates typed characters, and discards them again once the user stops
 * typing for `TYPEAHEAD_BUFFER_TIMEOUT`.
 */
export class TypeaheadBuffer {
    private buffer: string = '';
    private resetTimeoutId: ReturnType<typeof setTimeout>;
    private readonly timeout: number;

    constructor(timeout: number = TYPEAHEAD_BUFFER_TIMEOUT) {
        this.timeout = timeout;
    }

    /**
     * The characters typed so far.
     */
    public get value(): string {
        return this.buffer;
    }

    /**
     * Whether nothing has been typed, or the buffer has been discarded.
     */
    public get isEmpty(): boolean {
        return this.buffer === '';
    }

    /**
     * Append a character, and restart the timer that discards the buffer.
     *
     * @param character - the character to append
     * @returns the buffer, including the appended character
     */
    public append(character: string): string {
        this.buffer += character;

        clearTimeout(this.resetTimeoutId);
        this.resetTimeoutId = setTimeout(() => {
            this.clear();
        }, this.timeout);

        return this.buffer;
    }

    /**
     * Discard the buffer, and cancel the timer that would have discarded it.
     */
    public clear(): void {
        this.buffer = '';

        clearTimeout(this.resetTimeoutId);
        this.resetTimeoutId = undefined;
    }
}
