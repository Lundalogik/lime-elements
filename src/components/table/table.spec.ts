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
            updateData: vi.fn(),
            updateOrAddData: vi.fn(),
        };
        (component as any).setSelection = vi.fn();
        (component as any).initialized = true;
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('updates rows without replacing data when row content changes', () => {
        vi.useFakeTimers();

        const oldData = [{ id: 1, name: 'John' }];
        const newData = [{ id: 1, name: 'Jane' }];

        (component as any).updateData(newData, oldData);
        vi.runAllTimers();

        const tabulator = (component as any).tabulator;
        expect(tabulator.replaceData).not.toHaveBeenCalled();
        expect(tabulator.updateData).toHaveBeenCalledWith(newData);
        expect(tabulator.updateOrAddData).not.toHaveBeenCalled();
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
