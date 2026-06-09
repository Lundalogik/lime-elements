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

describe('limel-table remote paginator refresh', () => {
    let component: Table;
    let scrollContainer: HTMLElement;

    beforeEach(() => {
        component = new Table();
        scrollContainer = document.createElement('div');
        (component as any).tabulator = {
            replaceData: vi.fn().mockResolvedValue(undefined),
            setMaxPage: vi.fn(),
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
