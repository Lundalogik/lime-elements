/**
 * One rendered position in the pagination component.
 *
 * A `gap` stands for one or more pages that the window does not have room for.
 */
export type PageSlot = { kind: 'page'; page: number } | { kind: 'gap' };

/**
 * How many positions are rendered at once, counting both page numbers and gap
 * markers. Constant, so the control keeps its width as the user pages through
 * a set — a gap and a page number take up the same room, so what matters is
 * how many positions there are, not how many of them are numbers.
 */
export const VISIBLE_SLOTS = 7;

/** How many pages to keep either side of the current one. */
const SIBLINGS = 1;

const FIRST_PAGE = 1;

/**
 * Build the list of positions to render for a given page count.
 *
 * The first and the last page are always included, so both ends of the set are
 * always one click away. The rest of the room goes to the pages around the
 * current one, and whatever is skipped becomes a gap.
 *
 * `Number.isSafeInteger` rather than `Number.isInteger`: past 2^53 arithmetic
 * on page numbers stops being exact. The component validates these too; this
 * guards them again because the cost of being wrong here is a wrong window
 * during render.
 *
 * @param currentPage - the page the user is on, 1-based
 * @param totalPages - how many pages there are in total
 * @returns the positions to render, in order
 */
export function getPageSlots(
    currentPage: number,
    totalPages: number
): PageSlot[] {
    if (!Number.isSafeInteger(totalPages) || totalPages < FIRST_PAGE) {
        return [];
    }

    const pages = collectVisiblePages(
        clampToSet(currentPage, totalPages),
        totalPages
    );

    return withGaps(pages);
}

/**
 * @param page - the page to pull into the set
 * @param totalPages - how many pages there are in total
 * @returns a whole page number within `1..totalPages`
 */
function clampToSet(page: number, totalPages: number): number {
    if (!Number.isSafeInteger(Math.floor(page))) {
        return FIRST_PAGE;
    }

    return Math.min(Math.max(FIRST_PAGE, Math.floor(page)), totalPages);
}

/**
 * Pick which page numbers to render, so that `withGaps` turns them into
 * exactly `VISIBLE_SLOTS` positions.
 *
 * Which of the three shapes applies depends only on whether there is anything
 * to skip on each side. With one gap there is room for six numbers, with two
 * there is room for five, and the gaps make up the difference.
 *
 * @param currentPage - the page the user is on, 1-based
 * @param totalPages - how many pages there are in total
 * @returns the page numbers to render, ascending
 */
function collectVisiblePages(
    currentPage: number,
    totalPages: number
): number[] {
    if (totalPages <= VISIBLE_SLOTS) {
        return range(FIRST_PAGE, totalPages);
    }

    const firstSibling = Math.max(currentPage - SIBLINGS, FIRST_PAGE);
    const lastSibling = Math.min(currentPage + SIBLINGS, totalPages);

    if (firstSibling <= FIRST_PAGE + 1) {
        return [...range(FIRST_PAGE, VISIBLE_SLOTS - 2), totalPages];
    }

    if (lastSibling >= totalPages - 1) {
        return [
            FIRST_PAGE,
            ...range(totalPages - (VISIBLE_SLOTS - 3), totalPages),
        ];
    }

    return [FIRST_PAGE, ...range(firstSibling, lastSibling), totalPages];
}

/**
 * @param from - the first number, inclusive
 * @param to - the last number, inclusive
 * @returns every whole number between the two
 */
function range(from: number, to: number): number[] {
    return Array.from({ length: to - from + 1 }, (_, step) => from + step);
}

/**
 * Insert a gap wherever the rendered page numbers are not consecutive.
 *
 * A gap that would hide a single page is rendered as that page instead: the
 * marker is as wide as a page number, so it would save no room.
 *
 * @param pages - the page numbers to render, ascending
 * @returns the positions to render, in order
 */
function withGaps(pages: number[]): PageSlot[] {
    return pages.flatMap((page, index) => {
        const slot: PageSlot = { kind: 'page', page: page };

        if (index === 0) {
            return [slot];
        }

        const skipped = page - pages[index - 1] - 1;

        if (skipped === 0) {
            return [slot];
        }

        if (skipped === 1) {
            return [{ kind: 'page', page: page - 1 } as PageSlot, slot];
        }

        return [{ kind: 'gap' } as PageSlot, slot];
    });
}
