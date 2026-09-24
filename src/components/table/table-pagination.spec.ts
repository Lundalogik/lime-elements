import { PaginationProps, TablePagination } from './table-pagination';

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
        shownPage = null;
        pagination = new TablePagination(
            () => table,
            () => props,
            changePage,
            (page) => {
                shownPage = page;
            }
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
            pagination.resize(20);

            expect(table.setPageSize).toHaveBeenCalledWith(20);
        });

        // In remote mode `setPageSize` jumps to the first page, which is a
        // load, and a load fails when the table goes away under it.
        it('swallows a jump that fails', async () => {
            table.setPageSize.mockReturnValue(
                Promise.reject(new Error('gone'))
            );

            expect(() => pagination.resize(20)).not.toThrow();
            await flush();
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

        it('warns once however often the total changes', () => {
            props.totalRows = 100;
            pagination.warnOnIgnoredTotalRows();
            props.totalRows = 200;
            pagination.warnOnIgnoredTotalRows();

            expect(warn).toHaveBeenCalledTimes(1);
        });

        it('says nothing about a total it counts from', () => {
            props.remote = true;
            props.totalRows = 100;

            pagination.warnOnIgnoredTotalRows();

            expect(warn).not.toHaveBeenCalled();
        });
    });
});
