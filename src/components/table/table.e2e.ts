import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';
import { Table } from './table';

/*
 * Tabulator performs an instance type check of the element
 * passed to its constructor, where using newSpecPage wouldn't work,
 * since it returns a MockHTMLElement (prevents Tabulator from initializing),
 * hence the use of an E2E test to test the table.
 */
describe('limel-table', () => {
    let page: E2EPage;
    let table: E2EElement;
    let tableContainer: E2EElement;

    async function render(props: Partial<Table>): Promise<E2EPage> {
        page = await newE2EPage({ html: '<limel-table></limel-table>' });
        table = await page.find('limel-table');
        tableContainer = await page.find('limel-table>>>#tabulator-container');

        for (const [key, value] of Object.entries(props)) {
            table.setProperty(key, value);
        }

        await page.waitForChanges();

        return page;
    }

    async function getFirstRowCells() {
        await page.waitForChanges();
        const row = await tableContainer.find(
            '.tabulator-table .tabulator-row'
        );
        if (!row) {
            throw new Error('no row found');
        }

        return row.findAll('[role="gridcell"]');
    }

    async function getFirstRowContent() {
        const cells = await getFirstRowCells();

        return cells.map((c) => c.textContent);
    }

    describe('column headers', () => {
        let columns;
        beforeEach(() => {
            columns = [
                { field: 'colA', title: 'A' },
                { field: 'colB', title: 'B' },
            ];
        });
        it('renders', async () => {
            await render({ columns: columns });
            const headers = await tableContainer.findAll(
                '[role="columnheader"]'
            );

            expect(headers.length).toEqual(2);
            const [headerA, headerB] = headers;
            expect(headerA.textContent).toEqual('A');
            expect(headerB.textContent).toEqual('B');
        });

        it('click sorts the data rows', async () => {
            let rowData;
            const data = [
                { id: 1, colA: 1, colB: 'ascending' },
                { id: 2, colA: 2, colB: 'descending' },
            ];

            // apparently data MUST come before columns
            await render({ data: data, columns: columns });
            const headers = await tableContainer.findAll(
                '[role="columnheader"]'
            );
            const [headerA, headerB] = headers;

            headerA.click();
            await page.waitForChanges();
            rowData = await getFirstRowContent();
            expect(rowData[0]).toEqual('2');
            headerA.click();
            await page.waitForChanges();
            rowData = await getFirstRowContent();
            expect(rowData[0]).toEqual('1');

            headerB.click();
            await page.waitForChanges();
            rowData = await getFirstRowContent();
            expect(rowData[1]).toEqual('descending');
            headerB.click();
            await page.waitForChanges();
            rowData = await getFirstRowContent();
            expect(rowData[1]).toEqual('ascending');
        });
    });

    describe('row selection', () => {
        it('adds a checkbox column', async () => {
            const columns = [{ field: 'name', title: 'Name' }];
            const data = [{ name: 'Alpha' }, { name: 'Beta' }];

            await render({
                data: data,
                selectable: true,
                columns: columns,
            });
            const headers = await tableContainer.findAll(
                '[role="columnheader"]'
            );
            const rowSelectors = await tableContainer.findAll(
                '.tabulator-table > .tabulator-row > .tabulator-cell > limel-checkbox'
            );

            expect(rowSelectors.length).toEqual(2);
            expect(headers.length).toEqual(2);
            const [headerA, headerB] = headers;
            expect(headerA.textContent.trim()).toEqual('');
            expect(headerB.textContent).toEqual('Name');
        });
        it('adds a select all checkbox', async () => {
            const columns = [{ field: 'name', title: 'Name' }];
            const data = [{ name: 'Alpha' }, { name: 'Beta' }];
            await render({
                data: data,
                selectable: true,
                columns: columns,
            });
            const selectAllCheckbox = await tableContainer.find(
                '.select-all limel-checkbox'
            );

            expect(
                await selectAllCheckbox.getProperty('indeterminate')
            ).toBeFalsy();
            expect(await selectAllCheckbox.getProperty('checked')).toBeFalsy();
        });
        it('allows selection by id', async () => {
            const columns = [{ field: 'name', title: 'Name' }];
            const data = [
                { id: 1, name: 'Alpha' },
                { id: 2, name: 'Beta' },
            ];
            await render({
                data: data,
                selectable: true,
                columns: columns,
                selection: [{ id: 1 }],
            });
            const rowSelectors = await tableContainer.findAll(
                '.tabulator-table > .tabulator-row > .tabulator-cell > limel-checkbox'
            );

            expect(await rowSelectors[0].getProperty('checked')).toBeTruthy();
            expect(await rowSelectors[1].getProperty('checked')).toBeFalsy();
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

            await render({ data, columns });

            const rows = await tableContainer.findAll('.tabulator-row');
            expect(rows.length).toBe(2);

            const firstRowContent = await getFirstRowContent();
            expect(firstRowContent).toEqual(['John', '30']);
        });
    });

    describe('empty state', () => {
        it('handles empty data gracefully', async () => {
            const columns = [{ field: 'name', title: 'Name' }];

            await render({ data: [], columns });

            const rows = await tableContainer.findAll('.tabulator-row');
            expect(rows.length).toBe(0);
        });
    });

    describe('data updates', () => {
        it('updates table when data changes', async () => {
            const columns = [{ field: 'name', title: 'Name' }];
            const initialData = [{ id: 1, name: 'John' }];

            await render({ data: initialData, columns });

            let firstRowContent = await getFirstRowContent();
            expect(firstRowContent).toEqual(['John']);

            const updatedData = [{ id: 1, name: 'Jane' }];
            table.setProperty('data', updatedData);
            await page.waitForChanges();

            firstRowContent = await getFirstRowContent();
            expect(firstRowContent).toEqual(['Jane']);
        });
    });
});
