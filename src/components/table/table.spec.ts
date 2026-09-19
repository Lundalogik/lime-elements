import type { ColumnSorter } from './table.types';

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
            replaceData: vi.fn(),
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

describe('limel-table pagination wiring', () => {
    let component: Table;
    let pagination: any;

    beforeEach(() => {
        component = new Table();
        (component as any).pageSize = 10;
        (component as any).data = Array.from({ length: 25 }, (_, i) => ({
            id: i,
        }));
        pagination = {
            resize: vi.fn(),
            updateMaxPage: vi.fn(),
            warnOnIgnoredTotalRows: vi.fn(),
        };
        (component as any).pagination = pagination;
        (component as any).tabulator = {
            replaceData: vi.fn().mockResolvedValue(undefined),
        };
        (component as any).init = vi.fn();
    });

    // The pagination draws its page count from `totalItems`, so a new total
    // is a re-render. It used to be a whole `replaceData` round trip, because
    // Tabulator's own buttons were built from the `last_page` its ajax
    // callback returned and nothing short of a new request could move them.
    it('does not reload the rows when the total changes in remote mode', () => {
        (component as any).mode = 'remote';
        (component as any).initialized = true;
        (component as any).totalRows = 100;

        (component as any).totalRowsChanged();
        (component as any).pageSizeChanged();

        expect((component as any).tabulator.replaceData).not.toHaveBeenCalled();
    });

    // Stencil runs a watcher as its own prop is assigned, so comparing the
    // total with the rows from inside one of them reads the other's stale
    // value — and the warning latches, so a false alarm would be permanent.
    it('waits for a render before comparing the total with the rows', () => {
        (component as any).totalRowsChanged();

        expect(pagination.warnOnIgnoredTotalRows).not.toHaveBeenCalled();

        (component as any).componentWillRender();

        expect(pagination.warnOnIgnoredTotalRows).toHaveBeenCalled();
    });

    // Tabulator goes on slicing by the size it was built with until it is
    // told otherwise, so the control would count pages the rows are not cut
    // into and the last of them could not be reached.
    it('tells the pagination about a new size rather than rebuilding', () => {
        (component as any).pageSizeChanged(20, 10);

        expect(pagination.resize).toHaveBeenCalledWith(20);
        expect((component as any).init).not.toHaveBeenCalled();
    });

    // Whether there is pagination at all is settled when Tabulator is
    // created, and `setPageSize` does nothing on a table without it.
    it('rebuilds when pagination starts', () => {
        (component as any).pageSizeChanged(10, undefined);

        expect((component as any).init).toHaveBeenCalled();
        expect(pagination.resize).not.toHaveBeenCalled();
    });

    it('rebuilds when pagination stops', () => {
        (component as any).pageSizeChanged(undefined, 10);

        expect((component as any).init).toHaveBeenCalled();
    });

    it('asks for no size at all when there is none to ask for', () => {
        (component as any).pageSizeChanged(undefined, undefined);

        expect((component as any).init).not.toHaveBeenCalled();
        expect(pagination.resize).not.toHaveBeenCalled();
    });
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

    it('does not touch a tabulator that is not built yet', () => {
        (component as any).initialized = false;
        const oldAggregates: any[] = [];
        const newAggregates = [{ field: 'amount', value: 100 }];

        (component as any).updateAggregates(newAggregates, oldAggregates);

        const tabulator = (component as any).tabulator;
        expect(tabulator.setColumns).not.toHaveBeenCalled();
        expect(tabulator.recalc).not.toHaveBeenCalled();
        expect(tabulator.rowManager.redraw).not.toHaveBeenCalled();
    });

    it('does not set columns on a tabulator that is not built yet', () => {
        (component as any).initialized = false;

        (component as any).updateColumns(
            [{ field: 'amount' }],
            [{ field: 'name' }]
        );
        (component as any).updateSortableColumns();

        expect((component as any).tabulator.setColumns).not.toHaveBeenCalled();
    });

    it('applies a skipped update once the table is built', () => {
        (component as any).initialized = false;
        (component as any).updateAggregates(
            [{ field: 'amount', value: 100 }],
            []
        );

        (component as any).initialized = true;
        (component as any).applyPendingColumnRefresh();

        const tabulator = (component as any).tabulator;
        expect(tabulator.setColumns).toHaveBeenCalled();
        expect(tabulator.recalc).toHaveBeenCalled();
    });

    it('does not set columns when nothing was skipped', () => {
        (component as any).applyPendingColumnRefresh();

        expect((component as any).tabulator.setColumns).not.toHaveBeenCalled();
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

describe('limel-table sorting updates', () => {
    let component: Table;

    const sorting = [
        { column: { field: 'name' }, direction: 'ASC' },
    ] as ColumnSorter[];

    beforeEach(() => {
        component = new Table();
    });

    it('defers the sort while the table is still being created', () => {
        (component as any).tabulator = null;
        (component as any).initialized = false;

        (component as any).updateSorting(sorting, []);

        expect((component as any).shouldSort).toBe(true);
    });

    it('defers the sort while the table is created but not yet initialized', () => {
        (component as any).tabulator = { setSort: vi.fn() };
        (component as any).initialized = false;

        (component as any).updateSorting(sorting, []);

        expect((component as any).tabulator.setSort).not.toHaveBeenCalled();
        expect((component as any).shouldSort).toBe(true);
    });

    it('applies the deferred sort once the table has rendered', () => {
        (component as any).tabulator = { setSort: vi.fn() };
        (component as any).sorting = sorting;
        (component as any).shouldSort = true;

        (component as any).handleRenderComplete();

        expect((component as any).tabulator.setSort).toHaveBeenCalledWith([
            { column: 'name', dir: 'asc' },
        ]);
        expect((component as any).shouldSort).toBe(false);
    });

    it('sorts straight away once the table is ready', () => {
        (component as any).tabulator = { setSort: vi.fn() };
        (component as any).initialized = true;

        (component as any).updateSorting(sorting, []);

        expect((component as any).tabulator.setSort).toHaveBeenCalledWith([
            { column: 'name', dir: 'asc' },
        ]);
    });
});
