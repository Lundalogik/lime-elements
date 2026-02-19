import { render, h } from '@stencil/vitest';

describe('limel-table', () => {
    // Tabulator requires a real DOM with layout dimensions for rendering.
    // In the Stencil vitest e2e environment, elements have zero
    // dimensions which prevents Tabulator from initializing properly.
    // These tests verify basic component lifecycle behavior.

    it('renders the tabulator container', async () => {
        const columns = [
            { field: 'colA', title: 'A' },
            { field: 'colB', title: 'B' },
        ];
        const { root, waitForChanges } = await render(
            <limel-table columns={columns}></limel-table>
        );
        await waitForChanges();

        const container = root.shadowRoot.querySelector('#tabulator-container');
        expect(container).toBeTruthy();
    });

    it('accepts data without errors', async () => {
        const columns = [
            { field: 'name', title: 'Name' },
            { field: 'age', title: 'Age' },
        ];
        const data = [
            { id: 1, name: 'John', age: 30 },
            { id: 2, name: 'Jane', age: 25 },
        ];

        const { root, waitForChanges } = await render(
            <limel-table data={data} columns={columns}></limel-table>
        );
        await waitForChanges();

        expect(root).toBeTruthy();
        expect((root as any).data).toEqual(data);
    });

    it('handles empty data gracefully', async () => {
        const columns = [{ field: 'name', title: 'Name' }];

        const { root, waitForChanges } = await render(
            <limel-table data={[]} columns={columns}></limel-table>
        );
        await waitForChanges();

        expect(root).toBeTruthy();
    });

    it('accepts property updates', async () => {
        const columns = [{ field: 'name', title: 'Name' }];
        const initialData = [{ id: 1, name: 'John' }];

        const { root, waitForChanges, setProps } = await render(
            <limel-table data={initialData} columns={columns}></limel-table>
        );
        await waitForChanges();

        const updatedData = [{ id: 1, name: 'Jane' }];
        setProps({ data: updatedData });
        await waitForChanges();

        expect((root as any).data).toEqual(updatedData);
    });
});
