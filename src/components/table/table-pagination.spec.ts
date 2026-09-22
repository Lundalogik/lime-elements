import { PaginationProps, TablePagination } from './table-pagination';

// Where a freshly built table starts, so the dedupe has a page to compare to.
const FIRST_PAGE_IN_TEST = 1;

describe('TablePagination', () => {
    let table: any;
    let props: PaginationProps;
    let changePage: any;
    let shownPage: number;
    let pagination: TablePagination;

    const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

    beforeEach(() => {
        table = {
            setMaxPage: vi.fn(),
            setPageSize: vi.fn(),
            setPage: vi.fn().mockResolvedValue(undefined),
            getPage: vi.fn().mockReturnValue(1),
            getPageMax: vi.fn().mockReturnValue(3),
        };
        props = {
            remote: false,
            rows: 25,
            totalRows: undefined,
            pageSize: 10,
            page: 1,
        };
        changePage = { emit: vi.fn() };
        shownPage = FIRST_PAGE_IN_TEST;
        pagination = new TablePagination(
            () => table,
            () => props,
            changePage,
            (page) => {
                shownPage = page;
            },
            () => shownPage
        );
    });

    describe('max page', () => {
        it('keeps the max page in step with the total', () => {
            props.remote = true;
            props.totalRows = 100;

            pagination.updateMaxPage();

            expect(table.setMaxPage).toHaveBeenCalledWith(10);
        });

        it('leaves the max page alone while the count is unknown', () => {
            props.remote = true;

            pagination.updateMaxPage();

            expect(table.setMaxPage).not.toHaveBeenCalled();
        });
    });

    describe('options', () => {
        it('asks for no pagination without a page size', () => {
            props.pageSize = undefined;

            expect(pagination.getOptions()).toEqual({});
        });

        // Tabulator keeps paging the rows, but its own controls are built
        // into a node that is never added to the document.
        it('builds Tabulator its controls where nobody sees them', () => {
            const options: any = pagination.getOptions();

            expect(options.pagination).toBe(true);
            expect(options.paginationMode).toBe('local');
            expect(options.paginationSize).toBe(10);
            expect(options.paginationElement.isConnected).toBe(false);
        });

        // A detached element hides the page buttons but does not stop them
        // being built, and each one is registered for translation forever.
        it('asks for no page buttons at all', () => {
            expect((pagination.getOptions() as any).paginationButtonCount).toBe(
                0
            );
        });

        it('pages remotely when the table holds one page', () => {
            props.remote = true;

            expect((pagination.getOptions() as any).paginationMode).toBe(
                'remote'
            );
        });
    });

    describe('last page', () => {
        it('reports the pages it counted', () => {
            expect(pagination.lastPage()).toBe(3);
        });

        // A smaller one would move the user off a page that is about to be
        // confirmed.
        it('falls back to the max Tabulator holds while the count is unknown', () => {
            props.remote = true;
            table.getPageMax.mockReturnValue(7);

            expect(pagination.lastPage()).toBe(7);
        });
    });

    describe('following the table', () => {
        it('draws the page Tabulator loaded and publishes it', () => {
            pagination.handlePageLoaded(2);

            expect(shownPage).toBe(2);
            expect(changePage.emit).toHaveBeenCalledWith(2);
        });

        // Tabulator announces one page change twice: `renderComplete` goes
        // out inside `trigger()`, before `pageLoaded`, and both reach here.
        it('publishes a page once however often it is announced', () => {
            pagination.handlePageLoaded(2);
            pagination.handlePageLoaded(2);

            expect(changePage.emit).toHaveBeenCalledTimes(1);
        });

        // A remote table publishes the page from `requestData` instead, but
        // the control still has to follow.
        it('draws a remote page without publishing it twice', () => {
            props.remote = true;

            pagination.handlePageLoaded(2);

            expect(shownPage).toBe(2);
            expect(changePage.emit).not.toHaveBeenCalled();
        });
    });

    describe('showing a page', () => {
        it('asks Tabulator for a page it is not on', () => {
            pagination.showPage(3);

            expect(table.setPage).toHaveBeenCalledWith(3);
        });

        it('leaves Tabulator alone when it is already there', () => {
            table.getPage.mockReturnValue(2);

            pagination.showPage(2);

            expect(table.setPage).not.toHaveBeenCalled();
        });

        // Before Tabulator exists there is nothing to ask, but the control
        // still has a page to draw.
        it('draws the page itself when there is no table yet', () => {
            table = null;

            pagination.showPage(4);

            expect(shownPage).toBe(4);
        });
    });

    describe('resizing', () => {
        // Tabulator goes on slicing by the size it was built with until it is
        // told otherwise, and the rows past the last page the control offers
        // could not be reached at all.
        it('tells Tabulator the new size', () => {
            pagination.resize(20, 1);

            expect(table.setPageSize).toHaveBeenCalledWith(20);
        });

        // In remote mode `setPageSize` jumps to the first page, which is a
        // load, and a load fails when the table goes away under it.
        it('swallows a jump that fails', async () => {
            table.setPageSize.mockReturnValue(
                Promise.reject(new Error('gone'))
            );

            expect(() => pagination.resize(20, 1)).not.toThrow();
            await flush();
        });

        // `setPageSize` ends in `setPage(1)`, so without this the size
        // decides the page and the `page` prop is quietly overruled.
        it('lands on the page that was asked for', () => {
            table.getPage.mockReturnValue(1);

            pagination.resize(20, 3);

            expect(table.setPage).toHaveBeenCalledWith(3);
        });

        // Which of the two watchers Stencil happens to run first decided
        // this before: the size would strand the table on page 1.
        it('stays on the page it is already showing', () => {
            table.getPage.mockReturnValue(3);
            shownPage = 3;

            pagination.resize(20, 3);

            expect(table.setPage).not.toHaveBeenCalled();
        });

        // Tabulator hops through the first page on the way. That hop is not
        // a page the consumer chose, and publishing it told them they had
        // moved to page 1 when they had not moved at all.
        it('does not publish the first page it passes through', () => {
            shownPage = 3;
            table.getPage.mockReturnValue(1);
            table.setPageSize.mockImplementation(() => {
                pagination.handlePageLoaded(1);
            });

            pagination.resize(20, 3);

            expect(changePage.emit).not.toHaveBeenCalled();
        });

        // A size that leaves fewer pages than before must be measured
        // against the new last page, not the one the old size made.
        it('counts the pages again before going there', () => {
            const order: string[] = [];
            table.setMaxPage.mockImplementation(() => order.push('setMaxPage'));
            table.setPage.mockImplementation(() => {
                order.push('setPage');

                return Promise.resolve(undefined);
            });
            table.getPage.mockReturnValue(1);

            pagination.resize(20, 3);

            expect(order).toEqual(['setMaxPage', 'setPage']);
        });
    });

    describe('refused pages', () => {
        let warn: any;

        beforeEach(() => {
            table.setPage.mockRejectedValue(undefined);
            table.getPageMax.mockReturnValue(1);
            props.rows = 1;
            props.page = 4;
            warn = vi
                .spyOn(console, 'warn')
                .mockImplementation(() => undefined);
        });

        afterEach(() => {
            warn.mockRestore();
        });

        it('says which page was refused and how far the table goes', async () => {
            pagination.goToPage(4);
            await flush();

            expect(warn).toHaveBeenCalledTimes(1);
            expect(warn.mock.calls[0][0]).toContain('page 4');
            expect(warn.mock.calls[0][0]).toContain('the last page is 1');
        });

        it('warns once however often the same page is asked for', async () => {
            pagination.goToPage(4);
            pagination.goToPage(4);
            await flush();

            expect(warn).toHaveBeenCalledTimes(1);
        });

        // Another page is another diagnosis: silencing it would leave the
        // reader with Tabulator's own warning, which names no prop.
        it('warns again when a different page is refused', async () => {
            pagination.goToPage(4);
            pagination.goToPage(5);
            await flush();

            expect(warn).toHaveBeenCalledTimes(2);
        });

        // The same page refused under props the table no longer holds is a
        // new diagnosis, and the reader is otherwise left with silence.
        it('warns again when a page is refused after the table moved', async () => {
            pagination.goToPage(4);
            await flush();

            pagination.handlePageLoaded(2);
            pagination.goToPage(4);
            await flush();

            expect(warn).toHaveBeenCalledTimes(2);
        });
    });

    describe('ignored totals', () => {
        let warn: any;

        beforeEach(() => {
            warn = vi
                .spyOn(console, 'warn')
                .mockImplementation(() => undefined);
        });

        afterEach(() => {
            warn.mockRestore();
        });

        it('says a local total is ignored, and what is counted instead', () => {
            props.totalRows = 100;

            pagination.warnOnIgnoredTotalRows();

            expect(warn).toHaveBeenCalledTimes(1);
            expect(warn.mock.calls[0][0]).toContain('(100)');
            expect(warn.mock.calls[0][0]).toContain('25 rows');
        });

        // `componentWillRender` asks on every render, and the same total
        // beside the same rows is the same mistake each time.
        it('warns once while the numbers stay the same', () => {
            props.totalRows = 100;

            pagination.warnOnIgnoredTotalRows();
            pagination.warnOnIgnoredTotalRows();

            expect(warn).toHaveBeenCalledTimes(1);
        });

        // A single latched warning goes on quoting a `data.length` the table
        // stopped holding, which is the number the reader is asked to act on.
        it('warns again once the numbers it quoted have moved on', () => {
            props.totalRows = 100;
            pagination.warnOnIgnoredTotalRows();

            props.rows = 50;
            pagination.warnOnIgnoredTotalRows();

            expect(warn).toHaveBeenCalledTimes(2);
            expect(warn.mock.calls[1][0]).toContain('50 rows');
        });

        // Nothing counts pages without a page size, so the total is not being
        // ignored in favour of anything.
        it('says nothing about a table that does not paginate', () => {
            props.totalRows = 100;
            props.pageSize = undefined;

            pagination.warnOnIgnoredTotalRows();

            expect(warn).not.toHaveBeenCalled();
        });

        it('says nothing about a total it counts from', () => {
            props.remote = true;
            props.totalRows = 100;

            pagination.warnOnIgnoredTotalRows();

            expect(warn).not.toHaveBeenCalled();
        });
    });
});
