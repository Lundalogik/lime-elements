import { EventEmitter } from '@stencil/core';
import {
    Tabulator,
    OptionsPagination as TabulatorOptionsPagination,
} from 'tabulator-tables';
import {
    RowCounts,
    countPages,
    countRows,
    hasMultiplePages,
    ignoredTotalMessage,
    isTotalIgnored,
    refusedPageMessage,
} from './pagination';

const FIRST_PAGE = 1;

/**
 * What the table tells its pagination about itself, read fresh every time so
 * the helper never holds a copy of a prop that has since moved on.
 */
export interface PaginationProps extends RowCounts {
    /**
     * How many rows fit on a page
     */
    pageSize: number;
    /**
     * What the consumer's `page` prop says
     */
    page: number;
}

/**
 * Drives Tabulator's paging on behalf of `limel-table`, and keeps the page
 * the control draws in step with the page the rows are on.
 *
 * Tabulator holds the page, not the `page` prop: a click reaches the control
 * again only once Tabulator has moved, so the control never points at a page
 * the table is not showing.
 */
export class TablePagination {
    private lastRefusedPage: number = null;
    private lastIgnoredTotal: string = null;
    private settlingOn: number = null;

    /**
     * Creates an instance of the TablePagination class
     *
     * @param getTable - Function that returns the Tabulator instance
     * @param getProps - Function that returns what the table currently holds
     * @param changePageEvent - The event emitter to use when the page moves
     * @param setCurrentPage - Called with the page the control should draw
     * @param getCurrentPage - Returns the page the control is drawing
     */
    constructor(
        private getTable: () => Tabulator,
        private getProps: () => PaginationProps,
        private changePageEvent: EventEmitter<number>,
        private setCurrentPage: (page: number) => void,
        private getCurrentPage: () => number
    ) {}

    /**
     * @returns How many rows there are in total, or `null` when unknown
     */
    public get rowCount(): number | null {
        return countRows(this.getProps());
    }

    /**
     * @returns `true` when the rows are known to make up more than one page
     */
    public get hasPagination(): boolean {
        return hasMultiplePages(this.rowCount, this.getProps().pageSize);
    }

    /**
     * @returns How many pages the rows make up, or `null` when unknown
     */
    public countPages(): number | null {
        return countPages(this.rowCount, this.getProps().pageSize);
    }

    /**
     * While the count is on its way there is no page count to send, so hand
     * back the max Tabulator already has: a smaller one would move the user
     * off a page that is about to be confirmed.
     *
     * @returns The last page to report to a remote consumer
     */
    public lastPage(): number {
        const counted = this.countPages();

        return counted === null ? this.maxPage() : counted;
    }

    /**
     * `getPageMax` answers `false` for a table that does not paginate, which
     * is no kind of page number.
     *
     * @returns The last page Tabulator holds, or `undefined`
     */
    private maxPage(): number {
        const max = this.getTable()?.getPageMax();

        return typeof max === 'number' ? max : undefined;
    }

    /**
     * @returns The options that make Tabulator page the rows for us
     */
    public getOptions(): TabulatorOptionsPagination {
        const { remote, pageSize, page } = this.getProps();

        if (!pageSize) {
            return {};
        }

        return {
            pagination: true,
            paginationMode: remote ? 'remote' : 'local',
            paginationSize: pageSize,
            paginationInitialPage: page,

            // Tabulator keeps paging the rows, but builds its own controls
            // into a node that is never added to the document, so they are
            // never seen. `limel-pagination` is what the user works with.
            paginationElement: document.createElement('div'),

            // A detached element hides the page buttons but does not stop
            // them being built, and each one is registered for translation
            // and never released. Without a count there are none to build.
            paginationButtonCount: 0,
        };
    }

    /**
     * Follows Tabulator to a page it has loaded.
     *
     * @param page - the page Tabulator is now showing
     */
    public handlePageLoaded(page: number): void {
        // Tabulator announces one page change twice — `renderComplete` goes
        // out inside `trigger()` before `pageLoaded` — and both reach here.
        // The page already being drawn is the page already published.
        if (page === this.getCurrentPage()) {
            return;
        }

        // A resize hops through the first page on its way to the page the
        // table is settling on. Where it passes through is not where it is
        // going, so it is neither drawn nor published.
        if (this.settlingOn !== null && page !== this.settlingOn) {
            return;
        }

        // Above the early return: in remote mode the table publishes the page
        // from `requestData` instead, but the pagination still has to follow.
        this.setCurrentPage(page);

        // The table moved, so whatever it refused before was refused under
        // props it no longer holds and is worth diagnosing again.
        this.lastRefusedPage = null;

        if (this.getProps().remote) {
            return;
        }

        this.changePageEvent.emit(page);
    }

    /**
     * Shows the page the `page` prop asks for, unless the table is already
     * on it.
     *
     * @param page - the page to show, 1-based
     */
    public showPage(page: number): void {
        const table = this.getTable();

        if (!table) {
            this.setCurrentPage(page);

            return;
        }

        if (table.getPage() === page) {
            return;
        }

        this.goToPage(page);
    }

    /**
     * Ask Tabulator for a page.
     *
     * `setPage` rejects a page outside `1..max`, which the `page` prop can
     * reach: the control only offers pages the table counts, but a prop is
     * set from outside, and `data` and `page` set in the same tick reach the
     * table in either order. Nothing follows a refused page — `pageLoaded`
     * never fires, so the control stays where it was — but a page that was
     * asked for and then ignored needs saying out loud.
     *
     * @param page - the page to show, 1-based
     */
    public goToPage(page: number): void {
        this.getTable()
            ?.setPage(page)
            .catch(() => {
                this.warnOnRefusedPage(page);
            });
    }

    /**
     * Tabulator slices by the size it was built with until it is told
     * otherwise, so without this the control counts pages from one size
     * while the rows are cut into another, and the rows past the last page
     * it offers cannot be reached at all.
     *
     * `setPageSize` ends in a jump to the first page, which would otherwise
     * decide the page instead of the `page` prop — and which page won would
     * depend on whether the `page` watcher happened to run first. The page
     * asked for is re-applied here, so it does not.
     *
     * @param pageSize - the new number of rows per page
     * @param page - the page to land on once the rows are cut again
     */
    public resize(pageSize: number, page: number): void {
        this.settlingOn = page;

        try {
            // Typed `void`, but hands back the promise from the jump to the
            // first page, which rejects if the table goes away while a
            // remote page is loading. A table without pagination answers
            // `false` instead, and `?.` goes on reading through a `false`.
            const resized = this.getTable()?.setPageSize(pageSize) as unknown;

            if (resized instanceof Promise) {
                resized.catch(() => undefined);
            }

            // Before the page is re-applied, so a page that the bigger size
            // has just put out of range is measured against the new last
            // page rather than the one the old size made.
            this.updateMaxPage();
            this.showPage(page);
        } finally {
            this.settlingOn = null;
        }
    }

    /**
     * Tells Tabulator how far the pages go, when we know.
     */
    public updateMaxPage(): void {
        const pageCount = this.countPages();

        if (pageCount === null) {
            return;
        }

        this.getTable()?.setMaxPage(pageCount);
    }

    /**
     * Once per pair of numbers, not once per render: the same total beside
     * the same rows is the same mistake, but `data` refetched at a different
     * length is a new one, and the only message in the console should not go
     * on quoting a count the table no longer holds.
     */
    public warnOnIgnoredTotalRows(): void {
        const props = this.getProps();
        const { rows, totalRows } = props;

        if (!isTotalIgnored(props, props.pageSize)) {
            return;
        }

        const quoted = `${totalRows}/${rows}`;

        if (this.lastIgnoredTotal === quoted) {
            return;
        }

        this.lastIgnoredTotal = quoted;
        console.warn(ignoredTotalMessage(totalRows, rows));
    }

    /**
     * Once per page, not once per click: the same page is refused every time
     * it is asked for, and the second warning says nothing the first did
     * not. Another page is another diagnosis, so it is not silenced.
     *
     * @param page - the page that was refused
     */
    private warnOnRefusedPage(page: number): void {
        if (this.lastRefusedPage === page) {
            return;
        }

        const { remote, rows, totalRows, page: pageProp } = this.getProps();

        this.lastRefusedPage = page;
        console.warn(
            refusedPageMessage({
                page: page,
                lastPage: this.maxPage(),
                remote: remote,
                pageProp: pageProp ?? FIRST_PAGE,
                totalRows: totalRows,
                rows: rows,
            })
        );
    }
}
