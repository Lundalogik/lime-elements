import { EventEmitter } from '@stencil/core';
import {
    Tabulator,
    OptionsPagination as TabulatorOptionsPagination,
} from 'tabulator-tables';
import {
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
export interface PaginationProps {
    /**
     * Whether the table holds one page of a set it cannot see the whole of
     */
    remote: boolean;
    /**
     * How many rows the table is holding right now
     */
    rows: number;
    /**
     * What the consumer says the whole set counts
     */
    totalRows: number;
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
    private hasWarnedOnIgnoredTotal = false;

    /**
     * Creates an instance of the TablePagination class
     *
     * @param getTable - Function that returns the Tabulator instance
     * @param getProps - Function that returns what the table currently holds
     * @param changePageEvent - The event emitter to use when the page moves
     * @param setCurrentPage - Called with the page the control should draw
     */
    constructor(
        private getTable: () => Tabulator,
        private getProps: () => PaginationProps,
        private changePageEvent: EventEmitter<number>,
        private setCurrentPage: (page: number) => void
    ) {}

    /**
     * @returns How many rows there are in total, or `null` when unknown
     */
    public get rowCount(): number {
        const { remote, rows, totalRows } = this.getProps();

        return countRows({ remote, rows, totalRows });
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
    public countPages(): number {
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
        // Above the early return: in remote mode the table publishes the page
        // from `requestData` instead, but the pagination still has to follow.
        this.setCurrentPage(page);

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
     * `setPageSize` is typed `void`, but hands back the promise from its own
     * jump to the first page, which rejects if the table goes away while a
     * remote page is loading.
     *
     * @param pageSize - the new number of rows per page
     */
    public resize(pageSize: number): void {
        const resized = this.getTable()?.setPageSize(pageSize) as unknown as
            | Promise<unknown>
            | undefined;

        resized?.catch(() => undefined);
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
     * Once: a total that is ignored is ignored on every render, and the
     * second warning says nothing the first did not.
     */
    public warnOnIgnoredTotalRows(): void {
        const { remote, rows, totalRows } = this.getProps();

        if (this.hasWarnedOnIgnoredTotal) {
            return;
        }

        if (!isTotalIgnored({ remote, rows, totalRows })) {
            return;
        }

        this.hasWarnedOnIgnoredTotal = true;
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
