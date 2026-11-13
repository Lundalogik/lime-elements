/**
 * What the counting rules need to know about a table
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
    totalRows?: number;
}

/**
 * A page the table was asked for and could not show
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
    totalRows?: number;
    /**
     * How many rows the table is holding
     */
    rows: number;
}

/**
 * @param counts - what the table is holding and what it was told
 * @returns The number of rows in the whole set, or `null` when unknown
 */
export function countRows(counts: RowCounts): number | null {
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
 * @param rowCount - how many rows there are in total, or `null` when unknown
 * @param pageSize - how many rows fit on a page
 * @returns The number of pages, or `null` when there is no count or no size
 */
export function countPages(
    rowCount: number | null,
    pageSize: number
): number | null {
    if (rowCount === null || !pageSize) {
        return null;
    }

    return Math.ceil(rowCount / pageSize);
}

/**
 * @param rowCount - how many rows there are in total, or `null` when unknown
 * @param pageSize - how many rows fit on a page
 * @returns `true` when the rows are known to make up more than one page
 */
export function hasMultiplePages(
    rowCount: number | null,
    pageSize: number
): boolean {
    return !!pageSize && (rowCount ?? 0) > pageSize;
}

/**
 * @param counts - what the table is holding and what it was told
 * @param pageSize - how many rows fit on a page, if the table pages at all
 * @returns `true` when a paging local table ignores a total that disagrees with its rows
 */
export function isTotalIgnored(counts: RowCounts, pageSize: number): boolean {
    const { remote, rows, totalRows } = counts;

    if (remote || !pageSize) {
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
 * @returns What to tell a consumer whose total is not being counted from
 */
export function ignoredTotalMessage(totalRows: number, rows: number): string {
    return `limel-table: \`totalRows\` (${totalRows}) is ignored while \`mode\` is \`local\`, where the table pages the ${rows} rows in \`data\`. Set \`mode\` to \`remote\` if the table is given one page of a larger set.`;
}

/**
 * @param refused - the page that was refused and what the table looked like
 * @returns What to tell a consumer whose page was refused
 */
export function refusedPageMessage(refused: RefusedPage): string {
    const { page, lastPage, remote, pageProp, totalRows, rows } = refused;
    const mode = remote ? 'remote' : 'local';

    return `limel-table: page ${page} was refused; the last page is ${lastPage}. (mode: ${mode}, page: ${pageProp}, totalRows: ${totalRows}, data.length: ${rows})`;
}
