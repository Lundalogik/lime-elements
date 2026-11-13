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

function hiddenTabulatorControls(): TabulatorOptionsPagination {
    return {
        paginationElement: document.createElement('div'),
        paginationButtonCount: 0,
    };
}

/**
 * What the table currently holds
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
 * Drives Tabulator's paging for `limel-table`, and keeps `limel-pagination` on
 * the page Tabulator shows
 */
export class TablePagination {
    private lastRefusedPage: number = null;
    private lastIgnoredTotal: string = null;
    private resizeTarget: number = null;

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
     * @returns The counted last page, or Tabulator's own while the count is unknown
     */
    public lastPage(): number {
        const counted = this.countPages();

        return counted === null ? this.maxPage() : counted;
    }

    /**
     * @returns The last page Tabulator holds, or `undefined` when it does not paginate
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
            ...hiddenTabulatorControls(),
        };
    }

    /**
     * Follows Tabulator to a page it has loaded.
     *
     * @param page - the page Tabulator is now showing
     */
    public handlePageLoaded(page: number): void {
        if (page === this.getCurrentPage() || this.isHopDuringResize(page)) {
            return;
        }

        this.setCurrentPage(page);
        this.lastRefusedPage = null;

        if (this.getProps().remote) {
            return;
        }

        this.changePageEvent.emit(page);
    }

    /**
     * Shows the page the `page` prop asks for
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
     * Asks Tabulator for a page, and warns when it refuses
     *
     * @param page - the page to show, 1-based
     */
    public async goToPage(page: number): Promise<void> {
        try {
            await this.getTable()?.setPage(page);
        } catch {
            this.warnOnRefusedPage(page);
        }
    }

    /**
     * Cuts the rows into pages of a new size, and lands on the given page
     *
     * @param pageSize - the new number of rows per page
     * @param page - the page to land on, 1-based
     */
    public resize(pageSize: number, page: number): void {
        this.resizeTarget = page;

        try {
            this.ignoreAbandonedJump(this.getTable()?.setPageSize(pageSize));
            this.updateMaxPage();
            this.showPage(page);
        } finally {
            this.resizeTarget = null;
        }
    }

    private isHopDuringResize(page: number): boolean {
        return this.resizeTarget !== null && page !== this.resizeTarget;
    }

    /**
     * @param jump - what `setPageSize` returns: the promise of its jump to the
     * first page, or `false` for a table that does not paginate. Typed `void`
     * by `@types/tabulator-tables`, see `userSetPageSize` in Tabulator's
     * `Page.js` (6.7.0).
     */
    private async ignoreAbandonedJump(jump: unknown): Promise<void> {
        if (jump instanceof Promise) {
            await Promise.allSettled([jump]);
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
     * Warns when a local table ignores its `totalRows`, once for each pair of numbers
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
     * Warns that Tabulator refused a page, once for each page
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
