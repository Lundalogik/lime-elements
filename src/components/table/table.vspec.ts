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
