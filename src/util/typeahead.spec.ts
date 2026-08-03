import {
    findTypeaheadMatch,
    isTypeaheadKey,
    NO_TYPEAHEAD_MATCH,
    TypeaheadBuffer,
    TypeaheadCandidate,
    TYPEAHEAD_BUFFER_TIMEOUT,
} from './typeahead';

const FRUITS: Array<TypeaheadCandidate | null> = [
    { text: 'Apple' },
    { text: 'Banana' },
    { text: 'Blueberry' },
];

describe('findTypeaheadMatch', () => {
    it('finds nothing without a buffer', () => {
        expect(findTypeaheadMatch(FRUITS, '', 0)).toBe(NO_TYPEAHEAD_MATCH);
    });

    it('finds nothing without candidates', () => {
        expect(findTypeaheadMatch([], 'a', 0)).toBe(NO_TYPEAHEAD_MATCH);
    });

    it('finds nothing when nothing starts with the buffer', () => {
        expect(findTypeaheadMatch(FRUITS, 'z', 0)).toBe(NO_TYPEAHEAD_MATCH);
    });

    describe('with a single character', () => {
        it('finds the first match when nothing is current', () => {
            expect(findTypeaheadMatch(FRUITS, 'b', NO_TYPEAHEAD_MATCH)).toBe(1);
        });

        it('advances past the current candidate', () => {
            expect(findTypeaheadMatch(FRUITS, 'b', 1)).toBe(2);
        });

        it('wraps around the end of the candidates', () => {
            expect(findTypeaheadMatch(FRUITS, 'b', 2)).toBe(1);
        });

        it('advances even when the current candidate matches', () => {
            // Without this, pressing the same key twice would keep
            // re-matching the candidate that is already current.
            expect(findTypeaheadMatch(FRUITS, 'a', 0)).toBe(0);
            expect(findTypeaheadMatch(FRUITS, 'b', 1)).not.toBe(1);
        });
    });

    describe('with a repeated character', () => {
        it('cycles, rather than matching the repetition literally', () => {
            expect(findTypeaheadMatch(FRUITS, 'bb', 1)).toBe(2);
        });

        it('wraps around the end of the candidates', () => {
            expect(findTypeaheadMatch(FRUITS, 'bbb', 2)).toBe(1);
        });

        it('stays put when only one candidate matches', () => {
            expect(findTypeaheadMatch(FRUITS, 'aa', 0)).toBe(0);
        });

        it('cycles on a non-ascii character', () => {
            const names = [{ text: 'Åkesson' }, { text: 'Ångström' }];

            expect(findTypeaheadMatch(names, 'åå', 0)).toBe(1);
        });
    });

    describe('with several characters', () => {
        it('matches the whole buffer', () => {
            expect(findTypeaheadMatch(FRUITS, 'bl', 0)).toBe(2);
        });

        it('keeps a candidate that already matches', () => {
            expect(findTypeaheadMatch(FRUITS, 'bl', 2)).toBe(2);
        });

        it('finds nothing when only part of the buffer matches', () => {
            expect(findTypeaheadMatch(FRUITS, 'blake', 0)).toBe(
                NO_TYPEAHEAD_MATCH
            );
        });

        it('matches text containing spaces', () => {
            const cities = [{ text: 'New Delhi' }, { text: 'New York' }];

            expect(findTypeaheadMatch(cities, 'new y', 0)).toBe(1);
        });
    });

    describe('matching', () => {
        it('ignores case in the buffer', () => {
            expect(findTypeaheadMatch(FRUITS, 'APP', 0)).toBe(0);
        });

        it('ignores case in the candidates', () => {
            expect(findTypeaheadMatch([{ text: 'ÅKESSON' }], 'åk', 0)).toBe(0);
        });

        it('ignores surrounding whitespace in the candidates', () => {
            expect(findTypeaheadMatch([{ text: '  Cherry ' }], 'c', 0)).toBe(0);
        });

        it('skips disabled candidates', () => {
            const characters = [
                { text: 'Luke Skywalker' },
                { text: 'Han Solo', disabled: true },
                { text: 'Leia Organa' },
            ];

            expect(findTypeaheadMatch(characters, 'h', 0)).toBe(
                NO_TYPEAHEAD_MATCH
            );
            expect(findTypeaheadMatch(characters, 'l', 0)).toBe(2);
        });

        it('never matches candidates without text', () => {
            expect(findTypeaheadMatch([{ text: '' }, {}], 'a', 0)).toBe(
                NO_TYPEAHEAD_MATCH
            );
        });

        it('finds nothing when every candidate is unmatchable', () => {
            expect(
                findTypeaheadMatch(
                    [null, { text: 'Apple', disabled: true }],
                    'a',
                    0
                )
            ).toBe(NO_TYPEAHEAD_MATCH);
        });
    });

    describe('with rows that can never match', () => {
        it('lets them occupy their index', () => {
            // A separator at index 0 means "Apple" is at index 1, and that is
            // the index the caller has to be given back.
            expect(findTypeaheadMatch([null, ...FRUITS], 'a', 0)).toBe(1);
        });
    });

    describe('with a current index outside the candidates', () => {
        it('searches from the beginning when it is too high', () => {
            expect(findTypeaheadMatch(FRUITS, 'b', 99)).toBe(1);
        });

        it('searches from the beginning when it is negative', () => {
            expect(findTypeaheadMatch(FRUITS, 'b', -5)).toBe(1);
        });
    });
});

describe('isTypeaheadKey', () => {
    const keyboardEvent = (init: KeyboardEventInit): KeyboardEvent =>
        new KeyboardEvent('keydown', init);

    it.each([['a'], ['A'], ['1'], ['-'], ['å'], [' ']])(
        'accepts "%s"',
        (key: string) => {
            expect(isTypeaheadKey(keyboardEvent({ key: key }))).toBe(true);
        }
    );

    it.each([['Enter'], ['ArrowDown'], ['Escape'], ['Tab'], ['Shift'], ['F1']])(
        'rejects "%s"',
        (key: string) => {
            expect(isTypeaheadKey(keyboardEvent({ key: key }))).toBe(false);
        }
    );

    it('accepts a character typed with shift', () => {
        expect(
            isTypeaheadKey(keyboardEvent({ key: 'A', shiftKey: true }))
        ).toBe(true);
    });

    it.each([['altKey'], ['ctrlKey'], ['metaKey']])(
        'rejects a character typed with %s',
        (modifier: string) => {
            const event = keyboardEvent({ key: 'a', [modifier]: true });

            expect(isTypeaheadKey(event)).toBe(false);
        }
    );

    it('rejects a character that is being composed', () => {
        const event = keyboardEvent({ key: 'a', isComposing: true });

        expect(isTypeaheadKey(event)).toBe(false);
    });
});

describe('TypeaheadBuffer', () => {
    let buffer: TypeaheadBuffer;

    beforeEach(() => {
        vi.useFakeTimers();
        buffer = new TypeaheadBuffer();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('starts out empty', () => {
        expect(buffer.value).toBe('');
        expect(buffer.isEmpty).toBe(true);
    });

    it('accumulates the appended characters', () => {
        expect(buffer.append('a')).toBe('a');
        expect(buffer.append('b')).toBe('ab');
        expect(buffer.value).toBe('ab');
        expect(buffer.isEmpty).toBe(false);
    });

    it('discards the characters once typing stops', () => {
        buffer.append('a');

        vi.advanceTimersByTime(TYPEAHEAD_BUFFER_TIMEOUT - 1);
        expect(buffer.value).toBe('a');

        vi.advanceTimersByTime(1);
        expect(buffer.value).toBe('');
        expect(buffer.isEmpty).toBe(true);
    });

    it('keeps the characters as long as typing continues', () => {
        buffer.append('a');
        vi.advanceTimersByTime(TYPEAHEAD_BUFFER_TIMEOUT - 1);

        buffer.append('b');
        vi.advanceTimersByTime(TYPEAHEAD_BUFFER_TIMEOUT - 1);

        expect(buffer.value).toBe('ab');
    });

    it('discards the characters when cleared', () => {
        buffer.append('a');
        buffer.clear();

        expect(buffer.value).toBe('');
    });

    it('does not discard characters typed after being cleared', () => {
        buffer.append('a');
        buffer.clear();

        buffer.append('b');
        vi.advanceTimersByTime(TYPEAHEAD_BUFFER_TIMEOUT - 1);

        expect(buffer.value).toBe('b');
    });

    it('honors a custom timeout', () => {
        buffer = new TypeaheadBuffer(50);
        buffer.append('a');

        vi.advanceTimersByTime(50);
        expect(buffer.value).toBe('');
    });
});
