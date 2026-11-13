import { PaginationProps, TablePagination } from './table-pagination';

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

        it('builds Tabulator its controls where nobody sees them', () => {
            const options: any = pagination.getOptions();

            expect(options.pagination).toBe(true);
            expect(options.paginationMode).toBe('local');
            expect(options.paginationSize).toBe(10);
            expect(options.paginationElement.isConnected).toBe(false);
        });

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

        it('publishes a page once however often it is announced', () => {
            pagination.handlePageLoaded(2);
            pagination.handlePageLoaded(2);

            expect(changePage.emit).toHaveBeenCalledTimes(1);
        });

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

        it('draws the page itself when there is no table yet', () => {
            table = null;

            pagination.showPage(4);

            expect(shownPage).toBe(4);
        });
    });

    describe('resizing', () => {
        it('tells Tabulator the new size', () => {
            pagination.resize(20, 1);

            expect(table.setPageSize).toHaveBeenCalledWith(20);
        });

        it('swallows a jump that fails', async () => {
            table.setPageSize.mockReturnValue(
                Promise.reject(new Error('gone'))
            );

            expect(() => pagination.resize(20, 1)).not.toThrow();
            await flush();
        });

        it('lands on the page that was asked for', () => {
            table.getPage.mockReturnValue(1);

            pagination.resize(20, 3);

            expect(table.setPage).toHaveBeenCalledWith(3);
        });

        it('stays on the page it is already showing', () => {
            table.getPage.mockReturnValue(3);
            shownPage = 3;

            pagination.resize(20, 3);

            expect(table.setPage).not.toHaveBeenCalled();
        });

        it('does not publish the first page it passes through', () => {
            shownPage = 3;
            table.getPage.mockReturnValue(1);
            table.setPageSize.mockImplementation(() => {
                pagination.handlePageLoaded(1);
            });

            pagination.resize(20, 3);

            expect(changePage.emit).not.toHaveBeenCalled();
        });

        it('counts the pages again before going there', () => {
            const order: string[] = [];
            table.setMaxPage.mockImplementation(() => {
                order.push('setMaxPage');
            });
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

        it('warns again when a different page is refused', async () => {
            pagination.goToPage(4);
            pagination.goToPage(5);
            await flush();

            expect(warn).toHaveBeenCalledTimes(2);
        });

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

        it('warns once while the numbers stay the same', () => {
            props.totalRows = 100;

            pagination.warnOnIgnoredTotalRows();
            pagination.warnOnIgnoredTotalRows();

            expect(warn).toHaveBeenCalledTimes(1);
        });

        it('warns again once the numbers it quoted have moved on', () => {
            props.totalRows = 100;
            pagination.warnOnIgnoredTotalRows();

            props.rows = 50;
            pagination.warnOnIgnoredTotalRows();

            expect(warn).toHaveBeenCalledTimes(2);
            expect(warn.mock.calls[1][0]).toContain('50 rows');
        });

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
