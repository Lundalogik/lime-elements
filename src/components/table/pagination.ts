/**
 * What the counting rules need to know about a table. Deliberately not the
 * table itself: counting pages is arithmetic over three numbers, and keeping
 * it that way is what lets it be read and tested without a table at all.
 */
export interface RowCounts {
    /**
     * Whether the table holds one page of a set it cannot see the whole of
     */
    remote: boolean;
    /**
     * How many rows the table is holding right now
     */
    rows: number;
    /**
     * What the consumer says the whole set counts, if it says anything
     */
    totalRows: number;
}

/**
 * Describes a page the table was asked for and could not show.
 */
export interface RefusedPage {
    /**
     * The page that was asked for
     */
    page: number;
    /**
     * The last page the table has
     */
    lastPage: number;
    /**
     * Whether the table holds one page of a larger set
     */
    remote: boolean;
    /**
     * What the `page` prop says
     */
    pageProp: number;
    /**
     * What the `totalRows` prop says
     */
    totalRows: number;
    /**
     * How many rows the table is holding
     */
    rows: number;
}

/**
 * How many rows there are in total, or `null` when there is no way to know
 * yet.
 *
 * A local table holds the whole set and pages the rows it holds, so those
 * rows are the count. A total that says otherwise would offer pages the
 * table refuses, which is why it is ignored here and warned about instead.
 *
 * A remote table holds one page, so its rows are not a count — but the two
 * cases a missing total can mean are still told apart by them: rows on
 * screen with no total is a count that has not arrived, and no rows with no
 * total is an empty set, which is a count like any other.
 *
 * @param counts - what the table is holding and what it was told
 *
 * @returns The number of rows in the whole set, or `null` when unknown
 */
export function countRows(counts: RowCounts): number {
    const { remote, rows, totalRows } = counts;

    if (!remote) {
        return rows;
    }

    if (totalRows) {
        return totalRows;
    }

    if (rows === 0) {
        return 0;
    }

    return null;
}

/**
 * How many pages the rows make up, or `null` while the count has not
 * arrived. Unknown rather than guessed from the rows we happen to hold:
 * guessing shrinks the set under a user who is on a later page.
 *
 * @param rowCount - how many rows there are in total, or `null` when unknown
 * @param pageSize - how many rows fit on a page
 *
 * @returns The number of pages, or `null` when the count is unknown
 */
export function countPages(rowCount: number, pageSize: number): number {
    if (rowCount === null) {
        return null;
    }

    return Math.ceil(rowCount / pageSize);
}

/**
 * Whether the rows are known to make up more than one page. A count that has
 * not arrived is not known to, so this stays `false` until it does.
 *
 * @param rowCount - how many rows there are in total, or `null` when unknown
 * @param pageSize - how many rows fit on a page
 *
 * @returns `true` when there is more than one page
 */
export function hasMultiplePages(rowCount: number, pageSize: number): boolean {
    return !!pageSize && (rowCount ?? 0) > pageSize;
}

/**
 * Whether a total the consumer gave is being ignored, and is wrong enough to
 * say so.
 *
 * Silent until there are rows to compare it with, so a total set while the
 * rows are on their way is not reported as a mistake. A total of `0` beside
 * rows is a total like any other, and only a prop that was never set says
 * nothing.
 *
 * @param counts - what the table is holding and what it was told
 *
 * @returns `true` when the total is ignored and disagrees with the rows
 */
export function isTotalIgnored(counts: RowCounts): boolean {
    const { remote, rows, totalRows } = counts;

    if (remote) {
        return false;
    }

    const unset = totalRows === undefined || totalRows === null;

    if (unset || rows === 0) {
        return false;
    }

    return totalRows !== rows;
}

/**
 * @param totalRows - the total that is being ignored
 * @param rows - how many rows the table is holding
 *
 * @returns What to tell a consumer whose total is not being counted from
 */
export function ignoredTotalMessage(totalRows: number, rows: number): string {
    return `limel-table: \`totalRows\` (${totalRows}) is ignored while \`mode\` is \`local\`, where the table pages the ${rows} rows in \`data\`. Set \`mode\` to \`remote\` if the table is given one page of a larger set.`;
}

/**
 * The numbers are reported without a cause. A refusal has several, and
 * naming the wrong one points the reader at a prop they never set.
 *
 * @param refused - the page that was refused and what the table looked like
 *
 * @returns What to tell a consumer whose page was refused
 */
export function refusedPageMessage(refused: RefusedPage): string {
    const { page, lastPage, remote, pageProp, totalRows, rows } = refused;
    const mode = remote ? 'remote' : 'local';

    return `limel-table: page ${page} was refused; the last page is ${lastPage}. (mode: ${mode}, page: ${pageProp}, totalRows: ${totalRows}, data.length: ${rows})`;
}
