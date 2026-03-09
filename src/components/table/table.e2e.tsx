import { render, h } from '@stencil/vitest';

describe('limel-table', () => {
    // Helper to wait for Tabulator initialization.
    // Tabulator requires a real DOM with layout dimensions for rendering.
    // Setting explicit width/height on the host element ensures the container
    // has dimensions even in the test harness.
    async function renderTable(props: Record<string, any>) {
        const result = await render(<limel-table {...props}></limel-table>);

        // Give the host element explicit dimensions so Tabulator can initialize
        Object.assign(result.root.style, {
            display: 'block',
            width: '600px',
            height: '400px',
        });
        await result.waitForChanges();

        // Give Tabulator time to initialize after layout is available
        await new Promise((resolve) => setTimeout(resolve, 200));
        await result.waitForChanges();

        return result;
    }

    function getContainer(root: HTMLElement) {
        return root.shadowRoot.querySelector('#tabulator-container');
    }

    describe('column headers', () => {
        it('renders the correct column headers', async () => {
            const columns = [
                { field: 'colA', title: 'A' },
                { field: 'colB', title: 'B' },
            ];
            const { root } = await renderTable({ columns });

            const headers = getContainer(root).querySelectorAll(
                '[role="columnheader"]'
            );
            expect(headers.length).toEqual(2);
            expect(headers[0].textContent).toEqual('A');
            expect(headers[1].textContent).toEqual('B');
        });

        it('sorts data when clicking a column header', async () => {
            const columns = [
                { field: 'colA', title: 'A' },
                { field: 'colB', title: 'B' },
            ];
            const data = [
                { id: 1, colA: 1, colB: 'ascending' },
                { id: 2, colA: 2, colB: 'descending' },
            ];
            const { root, waitForChanges } = await renderTable({
                data,
                columns,
            });

            const container = getContainer(root);
            const headers = container.querySelectorAll('[role="columnheader"]');

            // Click header to sort
            (headers[0] as HTMLElement).click();
            await waitForChanges();
            await new Promise((resolve) => setTimeout(resolve, 100));

            let firstRow = container.querySelector(
                '.tabulator-table .tabulator-row'
            );
            let cells = firstRow?.querySelectorAll('[role="gridcell"]');
            expect(cells[0].textContent).toEqual('2');

            // Click again to reverse sort
            (headers[0] as HTMLElement).click();
            await waitForChanges();
            await new Promise((resolve) => setTimeout(resolve, 100));

            firstRow = container.querySelector(
                '.tabulator-table .tabulator-row'
            );
            cells = firstRow?.querySelectorAll('[role="gridcell"]');
            expect(cells[0].textContent).toEqual('1');
        });
    });

    describe('basic data rendering', () => {
        it('renders table data correctly', async () => {
            const columns = [
                { field: 'name', title: 'Name' },
                { field: 'age', title: 'Age' },
            ];
            const data = [
                { id: 1, name: 'John', age: 30 },
                { id: 2, name: 'Jane', age: 25 },
            ];
            const { root } = await renderTable({ data, columns });

            const container = getContainer(root);
            const rows = container.querySelectorAll(
                '.tabulator-table .tabulator-row'
            );
            expect(rows.length).toBe(2);

            const firstRowCells = rows[0].querySelectorAll('[role="gridcell"]');
            expect(firstRowCells[0].textContent).toEqual('John');
            expect(firstRowCells[1].textContent).toEqual('30');
        });
    });

    describe('empty state', () => {
        it('handles empty data gracefully', async () => {
            const columns = [{ field: 'name', title: 'Name' }];
            const { root } = await renderTable({ data: [], columns });

            expect(getContainer(root)).toBeTruthy();
        });
    });

    describe('data updates', () => {
        it('updates table when data changes', async () => {
            const columns = [{ field: 'name', title: 'Name' }];
            const initialData = [{ id: 1, name: 'John' }];
            const { root, waitForChanges, setProps } = await renderTable({
                data: initialData,
                columns,
            });

            const updatedData = [{ id: 1, name: 'Jane' }];
            setProps({ data: updatedData });
            await waitForChanges();
            await new Promise((resolve) => setTimeout(resolve, 200));

            const container = getContainer(root);
            const rows = container.querySelectorAll('[role="row"]');
            const dataRow = [...rows].find(
                (row) => !row.querySelector('[role="columnheader"]')
            );
            const firstRowCells = dataRow.querySelectorAll('[role="gridcell"]');
            expect(firstRowCells[0].textContent).toEqual('Jane');
        });
    });

    describe('row selection', () => {
        it('adds a checkbox column when selectable', async () => {
            const columns = [{ field: 'name', title: 'Name' }];
            const data = [
                { id: 1, name: 'Alpha' },
                { id: 2, name: 'Beta' },
            ];
            const { root } = await renderTable({
                data,
                selectable: true,
                columns,
            });

            const container = getContainer(root);
            const headers = container.querySelectorAll('[role="columnheader"]');

            // Should have 2 headers: checkbox column + Name
            expect(headers.length).toEqual(2);
            expect(headers[0].textContent.trim()).toEqual('');
            expect(headers[1].textContent).toEqual('Name');
        });
    });

    describe('remote sorting', () => {
        it('emits load event with sorters when clicking a column header', async () => {
            const columns = [
                { field: 'colA', title: 'A' },
                { field: 'colB', title: 'B' },
            ];
            const data = [
                { id: 1, colA: 1, colB: 'ascending' },
                { id: 2, colA: 2, colB: 'descending' },
            ];
            const { root, waitForChanges, spyOnEvent } = await renderTable({
                mode: 'remote',
                data,
                columns,
            });
            const loadSpy = spyOnEvent('load');

            const container = getContainer(root);
            const headers = container.querySelectorAll('[role="columnheader"]');

            (headers[0] as HTMLElement).click();
            await waitForChanges();
            await new Promise((resolve) => setTimeout(resolve, 100));

            const eventsWithSorters = loadSpy.events.filter(
                (event: any) => event.detail?.sorters?.length
            );
            expect(eventsWithSorters.length).toBeGreaterThanOrEqual(1);

            const lastSortEvent = eventsWithSorters.at(-1) as any;
            expect(lastSortEvent.detail.page).toEqual(1);
            expect(lastSortEvent.detail.sorters.length).toEqual(1);
            expect(lastSortEvent.detail.sorters[0].column.field).toEqual(
                'colA'
            );
            expect(['ASC', 'DESC']).toContain(
                lastSortEvent.detail.sorters[0].direction
            );
        });
    });
});
