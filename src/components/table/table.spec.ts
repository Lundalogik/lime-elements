// Mock Stencil decorators so we can import the raw component class
vi.mock('@stencil/core', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const noop = () => (_target: any, _key?: string) => {};

    return {
        Component: noop,
        Element: noop,
        Event: noop,
        Listen: noop,
        Method: noop,
        Prop: noop,
        State: noop,
        Watch: noop,
        h: () => null,
    };
});

// Import after mock is set up
const { Table } = await import('./table');

describe('limel-table data updates', () => {
    let component: Table;

    beforeEach(() => {
        component = new Table();
        (component as any).tabulator = {
            replaceData: vi.fn().mockResolvedValue(undefined),
            updateData: vi.fn().mockResolvedValue(undefined),
            updateOrAddData: vi.fn(),
            getRow: vi.fn().mockReturnValue({ reformat: vi.fn() }),
        };
        (component as any).pool = {
            releaseAll: vi.fn(),
        };
        (component as any).setSelection = vi.fn();
        (component as any).initialized = true;
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('uses updateData and reformats changed rows when row content changes', async () => {
        vi.useFakeTimers();

        const oldData = [{ id: 1, name: 'John' }];
        const newData = [{ id: 1, name: 'Jane' }];

        (component as any).updateData(newData, oldData);
        await vi.runAllTimersAsync();

        const tabulator = (component as any).tabulator;
        expect(tabulator.replaceData).not.toHaveBeenCalled();
        expect(tabulator.updateData).toHaveBeenCalledWith(newData);
        expect(tabulator.getRow).toHaveBeenCalledWith(1);
        expect(tabulator.getRow(1).reformat).toHaveBeenCalled();
        expect((component as any).pool.releaseAll).not.toHaveBeenCalled();
    });

    it('fills missing fields with undefined when updating rows', async () => {
        vi.useFakeTimers();

        const oldData = [{ id: 1, name: 'John', status: 'unread' }];
        const newData = [{ id: 1, name: 'John' }];

        (component as any).updateData(newData, oldData);
        await vi.runAllTimersAsync();

        const tabulator = (component as any).tabulator;
        expect(tabulator.replaceData).not.toHaveBeenCalled();
        expect(tabulator.updateData).toHaveBeenCalledWith([
            { id: 1, name: 'John', status: undefined },
        ]);
    });

    it('replaces data when the dataset changes', () => {
        vi.useFakeTimers();

        const oldData = [{ id: 1, name: 'John' }];
        const newData = [{ id: 2, name: 'Jane' }];

        (component as any).updateData(newData, oldData);
        vi.runAllTimers();

        const tabulator = (component as any).tabulator;
        expect(tabulator.replaceData).toHaveBeenCalledWith(newData);
        expect(tabulator.updateData).not.toHaveBeenCalled();
    });

    it('replaces data when rows are missing ids', () => {
        vi.useFakeTimers();

        const oldData = [{ name: 'John' }];
        const newData = [{ name: 'Jane' }];

        (component as any).updateData(newData, oldData);
        vi.runAllTimers();

        const tabulator = (component as any).tabulator;
        expect(tabulator.replaceData).toHaveBeenCalledWith(newData);
        expect(tabulator.updateData).not.toHaveBeenCalled();
        expect(tabulator.updateOrAddData).not.toHaveBeenCalled();
    });

    it('replaces data when row order changes', () => {
        vi.useFakeTimers();

        const oldData = [
            { id: 1, name: 'John' },
            { id: 2, name: 'Jane' },
        ];
        const newData = [
            { id: 2, name: 'Jane' },
            { id: 1, name: 'John' },
        ];

        (component as any).updateData(newData, oldData);
        vi.runAllTimers();

        const tabulator = (component as any).tabulator;
        expect(tabulator.replaceData).toHaveBeenCalledWith(newData);
        expect(tabulator.updateData).not.toHaveBeenCalled();
        expect(tabulator.updateOrAddData).not.toHaveBeenCalled();
    });

    it('uses updateOrAddData when data is identical', () => {
        vi.useFakeTimers();

        const data = [{ id: 1, name: 'John' }];

        (component as any).updateData(data, data);
        vi.runAllTimers();

        const tabulator = (component as any).tabulator;
        expect(tabulator.replaceData).not.toHaveBeenCalled();
        expect(tabulator.updateData).not.toHaveBeenCalled();
        expect(tabulator.updateOrAddData).toHaveBeenCalledWith(data);
    });
});

describe('limel-table remote mode options', () => {
    let component: Table;

    beforeEach(() => {
        component = new Table();
    });

    it('sets sortMode to "remote" when mode is remote', () => {
        (component as any).mode = 'remote';
        const options = (component as any).getAjaxOptions();
        expect(options.sortMode).toEqual('remote');
    });

    it('does not set sortMode when mode is not remote', () => {
        (component as any).mode = 'local';
        const options = (component as any).getAjaxOptions();
        expect(options.sortMode).toBeUndefined();
    });
});

describe('limel-table remote paginator refresh', () => {
    let component: Table;
    let scrollContainer: HTMLElement;

    beforeEach(() => {
        component = new Table();
        scrollContainer = document.createElement('div');
        (component as any).tabulator = {
            replaceData: vi.fn().mockResolvedValue(undefined),
            setMaxPage: vi.fn(),
            // Tabulator resets to the first page after replaceData().
            getPage: vi.fn().mockReturnValue(1),
            setPage: vi.fn().mockResolvedValue(undefined),
        };
        (component as any).initialized = true;
        (component as any).pageSize = 10;
        (component as any).getRowScrollContainer = () => scrollContainer;
    });

    it('replaces data with no args when totalRows changes in remote mode', async () => {
        (component as any).mode = 'remote';

        (component as any).totalRowsChanged();
        await Promise.resolve();

        const tabulator = (component as any).tabulator;
        expect(tabulator.replaceData).toHaveBeenCalledWith();
    });

    it('replaces data with no args when pageSize changes in remote mode', async () => {
        (component as any).mode = 'remote';

        (component as any).pageSizeChanged();
        await Promise.resolve();

        const tabulator = (component as any).tabulator;
        expect(tabulator.replaceData).toHaveBeenCalledWith();
    });

    it('does not replace data in local mode', async () => {
        (component as any).mode = 'local';

        (component as any).totalRowsChanged();
        (component as any).pageSizeChanged();
        await Promise.resolve();

        const tabulator = (component as any).tabulator;
        expect(tabulator.replaceData).not.toHaveBeenCalled();
    });

    it('restores scroll position after replacing data', async () => {
        (component as any).mode = 'remote';
        scrollContainer.scrollTop = 120;
        scrollContainer.scrollLeft = 40;

        // Simulate Tabulator resetting scroll during the data rebuild.
        (component as any).tabulator.replaceData = vi
            .fn()
            .mockImplementation(() => {
                scrollContainer.scrollTop = 0;
                scrollContainer.scrollLeft = 0;

                return Promise.resolve();
            });

        await (component as any).refreshRemotePaginator();

        expect(scrollContainer.scrollTop).toBe(120);
        expect(scrollContainer.scrollLeft).toBe(40);
    });

    it('swallows replaceData rejection without restoring scroll', async () => {
        (component as any).mode = 'remote';
        (component as any).tabulator.replaceData = vi
            .fn()
            .mockRejectedValue(new Error('destroyed'));

        await expect(
            (component as any).refreshRemotePaginator()
        ).resolves.toBeUndefined();
    });
});

// The raw component class is tested as a white box, poking private members and
// mock events, so `component` is typed loosely to avoid casting on every access.
function setupRemotePreservationTable() {
    const component: any = new Table();
    const changePage = { emit: vi.fn() };
    const load = { emit: vi.fn() };
    component.mode = 'remote';
    component.pageSize = 10;
    component.page = 3;
    component.columns = [];
    component.changePage = changePage;
    component.load = load;

    return { component, changePage, load };
}

function setupRemoteClampingTable() {
    const component: any = new Table();
    const changePage = { emit: vi.fn() };
    component.mode = 'remote';
    component.initialized = true;
    component.pageSize = 10;
    component.changePage = changePage;
    component.getRowScrollContainer = () => null;
    component.tabulator = {
        replaceData: vi.fn().mockResolvedValue(undefined),
        setMaxPage: vi.fn(),
        // Tabulator resets to the first page after replaceData().
        getPage: vi.fn().mockReturnValue(1),
        setPage: vi.fn().mockResolvedValue(undefined),
    };

    return { component, changePage };
}

test('does not emit changePage or load during a paginator refresh even when Tabulator requests page 1', () => {
    const { component, changePage, load } = setupRemotePreservationTable();
    component.paginatorRefreshDepth = 1;

    component.requestData(null, null, { page: 1, sorters: [] });

    expect(changePage.emit).not.toHaveBeenCalled();
    expect(load.emit).not.toHaveBeenCalled();
});

test('emits changePage for a genuine user page change outside a refresh', () => {
    const { component, changePage } = setupRemotePreservationTable();

    component.requestData(null, null, { page: 2, sorters: [] });

    expect(changePage.emit).toHaveBeenCalledWith(2);
});

test('keeps the current page when Tabulator omits the page param', () => {
    const { component, changePage } = setupRemotePreservationTable();

    component.requestData(null, null, { sorters: [] });

    expect(changePage.emit).not.toHaveBeenCalled();
});

test('clamps to the last page when the current page no longer exists after rows shrink', async () => {
    const { component, changePage } = setupRemoteClampingTable();
    component.page = 3;
    component.totalRows = 15; // maxPage = 2

    await component.refreshRemotePaginator();

    expect(changePage.emit).toHaveBeenCalledWith(2);
});

test('does not clamp when the current page is still valid', async () => {
    const { component, changePage } = setupRemoteClampingTable();
    component.page = 2;
    component.totalRows = 100; // maxPage = 10

    await component.refreshRemotePaginator();

    expect(changePage.emit).not.toHaveBeenCalled();
});

test('restores the current page after replaceData resets it', async () => {
    const { component, changePage } = setupRemoteClampingTable();
    component.page = 3;
    component.totalRows = 100; // maxPage = 10, page 3 still valid

    await component.refreshRemotePaginator();

    // getPage() mocked to return 1 (Tabulator's post-replaceData reset),
    // so the page must be restored to the controlled page without emitting
    // a spurious changePage.
    expect(component.tabulator.setPage).toHaveBeenCalledWith(3);
    expect(changePage.emit).not.toHaveBeenCalled();
});

test('skips the row-rebuild round-trip when the page count is unchanged', async () => {
    const { component } = setupRemoteClampingTable();
    component.page = 2;
    component.totalRows = 100; // maxPage = 10

    await component.refreshRemotePaginator(); // first run: count 10, does the work
    component.tabulator.replaceData.mockClear();

    await component.refreshRemotePaginator(); // same count -> skipped

    expect(component.tabulator.replaceData).not.toHaveBeenCalled();
});

describe('limel-table aggregate updates', () => {
    let component: Table;

    beforeEach(() => {
        component = new Table();
        (component as any).columns = [
            { field: 'name', title: 'Name' },
            { field: 'amount', title: 'Amount' },
        ];
        (component as any).tabulator = {
            setColumns: vi.fn(),
            recalc: vi.fn(),
            rowManager: { redraw: vi.fn() },
            destroy: vi.fn(),
        };
        (component as any).pool = { releaseAll: vi.fn() };
        (component as any).initialized = true;
        (component as any).host = {
            shadowRoot: {
                querySelector: vi
                    .fn()
                    .mockReturnValue(document.createElement('div')),
            },
        };
    });

    it('does not destroy tabulator when aggregate fields change', () => {
        const oldAggregates: any[] = [];
        const newAggregates = [{ field: 'amount', value: 100 }];

        (component as any).updateAggregates(newAggregates, oldAggregates);

        const tabulator = (component as any).tabulator;
        expect(tabulator.destroy).not.toHaveBeenCalled();
        expect(tabulator.setColumns).toHaveBeenCalled();
        expect(tabulator.recalc).toHaveBeenCalled();
        expect(tabulator.rowManager.redraw).toHaveBeenCalled();
    });

    it('recalculates without setColumns when aggregate values change but fields are the same', () => {
        const oldAggregates = [{ field: 'amount', value: 100 }];
        const newAggregates = [{ field: 'amount', value: 200 }];

        (component as any).updateAggregates(newAggregates, oldAggregates);

        const tabulator = (component as any).tabulator;
        expect(tabulator.destroy).not.toHaveBeenCalled();
        expect(tabulator.setColumns).not.toHaveBeenCalled();
        expect(tabulator.recalc).toHaveBeenCalled();
        expect(tabulator.rowManager.redraw).toHaveBeenCalled();
    });

    it('does nothing when aggregates are equal', () => {
        const aggregates = [{ field: 'amount', value: 100 }];

        (component as any).updateAggregates(aggregates, aggregates);

        const tabulator = (component as any).tabulator;
        expect(tabulator.setColumns).not.toHaveBeenCalled();
        expect(tabulator.recalc).not.toHaveBeenCalled();
    });
});

describe('limel-table has-aggregation detection', () => {
    let component: Table;

    beforeEach(() => {
        component = new Table();
    });

    it('detects an aggregation from the aggregates prop when no column carries an aggregator', () => {
        (component as any).aggregates = [{ field: 'amount', value: 100 }];

        expect(
            (component as any).hasAggregation([
                { field: 'name' },
                { field: 'amount' },
            ])
        ).toBe(true);
    });

    it('does not detect an aggregation when no column field matches an aggregate', () => {
        (component as any).aggregates = [{ field: 'amount', value: 100 }];

        expect((component as any).hasAggregation([{ field: 'name' }])).toBe(
            false
        );
    });

    it("detects an aggregation from a column's own aggregator", () => {
        expect(
            (component as any).hasAggregation([
                { field: 'amount', aggregator: () => 0 },
            ])
        ).toBe(true);
    });
});
