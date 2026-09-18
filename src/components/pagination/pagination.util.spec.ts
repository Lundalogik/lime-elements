import { getPageSlots, PageSlot, VISIBLE_SLOTS } from './pagination.util';

const pageNumbers = (slots: PageSlot[]): number[] =>
    slots
        .filter((slot) => slot.kind === 'page')
        .map((slot) => (slot as { page: number }).page);

const gaps = (slots: PageSlot[]) => slots.filter((slot) => slot.kind === 'gap');

describe('getPageSlots', () => {
    describe('when every page fits in the window', () => {
        it('renders them all, with no gaps', () => {
            const slots = getPageSlots(2, 4);

            expect(pageNumbers(slots)).toEqual([1, 2, 3, 4]);
            expect(gaps(slots)).toHaveLength(0);
        });

        it('renders a single page on its own', () => {
            expect(pageNumbers(getPageSlots(1, 1))).toEqual([1]);
        });
    });

    describe('when there are more pages than the window holds', () => {
        // The point of a constant slot count is that the control keeps its
        // width. Counting page numbers alone would miss the case this exists
        // to stop: a gap collapsing into the single page it would have hidden,
        // which adds a number without adding a position.
        it.each([1, 2, 3, 4, 5, 50, 245, 246, 247, 248])(
            'renders the same number of slots on page %i',
            (page) => {
                expect(getPageSlots(page, 248)).toHaveLength(VISIBLE_SLOTS);
            }
        );

        it.each([1, 2, 50, 247, 248])(
            'renders the first and the last page on page %i',
            (page) => {
                const pages = pageNumbers(getPageSlots(page, 248));

                expect(pages[0]).toBe(1);
                expect(pages.at(-1)).toBe(248);
            }
        );

        it('keeps the current page between its neighbours', () => {
            expect(pageNumbers(getPageSlots(50, 248))).toEqual([
                1, 49, 50, 51, 248,
            ]);
        });

        it('fills the room forwards at the start of the set', () => {
            expect(pageNumbers(getPageSlots(1, 248))).toEqual([
                1, 2, 3, 4, 5, 248,
            ]);
        });

        it('fills the room backwards at the end of the set', () => {
            expect(pageNumbers(getPageSlots(248, 248))).toEqual([
                1, 244, 245, 246, 247, 248,
            ]);
        });
    });

    describe('input it cannot use', () => {
        // The magnitudes here are the interesting ones: past 2^53 a counting
        // loop stops advancing, because the gap between one number and the
        // next is greater than one. It ran forever, during render.
        it.each([
            ['no pages', 0],
            ['a negative count', -1],
            ['a fractional count', 2.5],
            ['not a number', Number.NaN],
            ['no end', Infinity],
            ['more pages than a number can count', 2 ** 53],
            ['one past the last countable page', Number.MAX_SAFE_INTEGER + 1],
        ])('renders nothing for %s', (_, totalPages) => {
            expect(getPageSlots(1, totalPages as number)).toEqual([]);
        });

        it('finishes on the last page of the largest countable set', () => {
            const last = Number.MAX_SAFE_INTEGER;
            const slots = getPageSlots(last, last);

            expect(pageNumbers(slots).at(-1)).toBe(last);
        });

        it.each([
            ['not a number', Number.NaN],
            ['no end', Infinity],
            ['no beginning', -Infinity],
            ['far past the end', 3_000_000_000],
            ['too large to count with', 2 ** 53],
            ['before the first page', -5],
        ])('pulls a current page that is %s into the set', (_, page) => {
            const slots = getPageSlots(page as number, 5);

            expect(pageNumbers(slots)).toEqual([1, 2, 3, 4, 5]);
        });
    });

    describe('gaps', () => {
        it('marks a gap wherever the rendered pages are not consecutive', () => {
            const slots = getPageSlots(50, 248);

            expect(gaps(slots)).toEqual([
                { kind: 'gap', from: 2, to: 48 },
                { kind: 'gap', from: 52, to: 247 },
            ]);
        });

        it('renders the page itself rather than a gap hiding one page', () => {
            // `1 … 4 5 6 … 8` would spend a marker to hide only page 7, which
            // is no narrower than the page and takes it away for nothing.
            const slots = getPageSlots(5, 8);

            expect(pageNumbers(slots)).toEqual([1, 4, 5, 6, 7, 8]);
            expect(gaps(slots)).toEqual([{ kind: 'gap', from: 2, to: 3 }]);
        });

        it('spends no extra slot when it does so', () => {
            // One page in place of one marker, so swapping them costs nothing.
            expect(getPageSlots(5, 8)).toHaveLength(7);
            expect(getPageSlots(50, 248)).toHaveLength(7);
        });

        it('renders the gap in the position the skipped pages occupy', () => {
            const slots = getPageSlots(1, 248);

            expect(slots.at(-2)).toEqual({ kind: 'gap', from: 6, to: 247 });
            expect(slots.at(-1)).toEqual({ kind: 'page', page: 248 });
        });
    });
});
