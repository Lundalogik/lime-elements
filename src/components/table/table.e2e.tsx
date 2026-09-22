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
        it('displays data in the order returned by the server, without re-sorting locally', async () => {
            // Initial data is in reverse numeric order (unsorted).
            // After sorting, the server returns data in numeric ASC order.
            // If Tabulator re-sorts locally as strings, it would produce
            // "1","10","11","2","20" instead of 1, 2, 10, 11, 20.
            const columns = [{ field: 'order', title: 'Order' }];
            const initialData = [
                { id: 5, order: 20 },
                { id: 4, order: 11 },
                { id: 3, order: 10 },
                { id: 2, order: 2 },
                { id: 1, order: 1 },
            ];

            const { root, waitForChanges, setProps } = await renderTable({
                mode: 'remote',
                data: initialData,
                columns,
                totalRows: 5,
                pageSize: 5,
            });

            // Simulate server responding with numerically sorted data
            const serverSortedData = [
                { id: 1, order: 1 },
                { id: 2, order: 2 },
                { id: 3, order: 10 },
                { id: 4, order: 11 },
                { id: 5, order: 20 },
            ];

            root.addEventListener('load', (event: CustomEvent) => {
                if (event.detail?.sorters?.length) {
                    setProps({ data: serverSortedData });
                }
            });

            const container = getContainer(root);
            const headers = container.querySelectorAll('[role="columnheader"]');

            (headers[0] as HTMLElement).click();
            await waitForChanges();
            await new Promise((resolve) => setTimeout(resolve, 300));
            await waitForChanges();

            const rows = container.querySelectorAll(
                '.tabulator-table .tabulator-row'
            );
            const displayedValues = [...rows].map((row) => {
                const cell = row.querySelector('[role="gridcell"]');

                return Number(cell?.textContent);
            });

            // Must match server response — string sort would give [1, 10, 11, 2, 20]
            expect(displayedValues).toEqual([1, 2, 10, 11, 20]);
        });

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

    describe('aggregation row', () => {
        // The `has-aggregation` class is exposed on the host so consumers and
        // ancestor components can react to the totals row without piercing the
        // shadow DOM — e.g. a floating action bar that must sit clear of it.
        it('marks the host with `has-aggregation` when a column has an aggregator', async () => {
            const columns = [
                { field: 'amount', title: 'Amount', aggregator: () => 30 },
            ];
            const data = [
                { id: 1, amount: 10 },
                { id: 2, amount: 20 },
            ];
            const { root } = await renderTable({ data, columns });

            expect(root.classList.contains('has-aggregation')).toBe(true);
        });

        it('does not mark the host without an aggregating column', async () => {
            const columns = [{ field: 'amount', title: 'Amount' }];
            const data = [{ id: 1, amount: 10 }];
            const { root } = await renderTable({ data, columns });

            expect(root.classList.contains('has-aggregation')).toBe(false);
        });
    });

    describe('pagination', () => {
        const columns = [{ field: 'name', title: 'Name' }];
        const data = Array.from({ length: 25 }, (_, index) => ({
            id: index + 1,
            name: `Row ${index + 1}`,
        }));

        function getPagination(root: HTMLElement) {
            return root.shadowRoot.querySelector('limel-pagination');
        }

        function getPageButtons(root: HTMLElement) {
            return [
                ...getPagination(root).shadowRoot.querySelectorAll<HTMLElement>(
                    'button.page'
                ),
            ];
        }

        function getPage(root: HTMLElement, page: number) {
            return getPageButtons(root).find(
                (button) => button.dataset.page === String(page)
            );
        }

        function getRowNames(root: HTMLElement) {
            return [
                ...getContainer(root).querySelectorAll(
                    '.tabulator-table .tabulator-row'
                ),
            ].map((row) => row.querySelector('[role="gridcell"]').textContent);
        }

        it('renders one page button per page of rows', async () => {
            const { root } = await renderTable({ columns, data, pageSize: 10 });

            expect(
                getPageButtons(root).map((button) => button.dataset.page)
            ).toEqual(['1', '2', '3']);
        });

        it('derives the pages from `totalRows` rather than the rows it holds', async () => {
            const { root } = await renderTable({
                columns,
                data: data.slice(0, 10),
                mode: 'remote',
                totalRows: 25,
                pageSize: 10,
            });

            expect(
                getPageButtons(root).map((button) => button.dataset.page)
            ).toEqual(['1', '2', '3']);
        });

        it('leaves the paginator Tabulator builds out of the document', async () => {
            const { root } = await renderTable({ columns, data, pageSize: 10 });

            expect(
                root.shadowRoot.querySelector('.tabulator-paginator')
            ).toBeNull();
        });

        it('renders nothing to page with when there is no page size', async () => {
            const { root } = await renderTable({ columns, data });

            expect(getPagination(root)).toBeNull();
        });

        it('shows the picked page, and marks it as the current one', async () => {
            const { root, waitForChanges } = await renderTable({
                columns,
                data,
                pageSize: 10,
            });

            getPage(root, 2).click();
            await waitForChanges();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await waitForChanges();

            expect(getRowNames(root)[0]).toEqual('Row 11');
            expect(getPage(root, 2).getAttribute('aria-current')).toEqual(
                'page'
            );
        });

        it('emits `changePage` for the picked page', async () => {
            const { root, waitForChanges, spyOnEvent } = await renderTable({
                columns,
                data,
                pageSize: 10,
            });
            const changePage = spyOnEvent('changePage');

            getPage(root, 3).click();
            await waitForChanges();
            await new Promise((resolve) => setTimeout(resolve, 100));

            expect(changePage.events.at(-1).detail).toEqual(3);
        });

        // `goToPage` bubbles and composes, so without being stopped it would
        // reach our consumers retargeted as an event of `limel-table`'s own —
        // one they can receive but cannot bind to.
        it('keeps `goToPage` inside the table', async () => {
            const { root, waitForChanges } = await renderTable({
                columns,
                data,
                pageSize: 10,
            });
            const escaped: Event[] = [];
            root.addEventListener('goToPage', (event) => escaped.push(event));

            getPage(root, 2).click();
            await waitForChanges();
            await new Promise((resolve) => setTimeout(resolve, 100));

            expect(escaped).toEqual([]);
        });

        it('follows the `page` prop', async () => {
            const { root, waitForChanges, setProps } = await renderTable({
                columns,
                data,
                pageSize: 10,
            });

            setProps({ page: 3 });
            await waitForChanges();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await waitForChanges();

            expect(getPage(root, 3).getAttribute('aria-current')).toEqual(
                'page'
            );
            expect(getRowNames(root)[0]).toEqual('Row 21');
        });

        it('stays put when asked for a page the table does not have', async () => {
            const { root, waitForChanges, setProps } = await renderTable({
                columns,
                data,
                pageSize: 10,
            });

            setProps({ page: 9 });
            await waitForChanges();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await waitForChanges();

            expect(getPage(root, 1).getAttribute('aria-current')).toEqual(
                'page'
            );
        });

        it('follows the page in remote mode too, where nothing is paged locally', async () => {
            const { root, waitForChanges, spyOnEvent } = await renderTable({
                columns,
                data: data.slice(0, 10),
                mode: 'remote',
                totalRows: 25,
                pageSize: 10,
            });
            const load = spyOnEvent('load');
            const changePage = spyOnEvent('changePage');

            getPage(root, 2).click();
            await waitForChanges();
            await new Promise((resolve) => setTimeout(resolve, 200));
            await waitForChanges();

            expect(load.events.at(-1).detail.page).toEqual(2);
            expect(changePage.events.at(-1).detail).toEqual(2);
            expect(getPage(root, 2).getAttribute('aria-current')).toEqual(
                'page'
            );
        });

        // Tabulator's remote path answers a set that shrank under the user by
        // logging that the server returned a last page below the current one,
        // and leaving them on a page that no longer exists.
        it('moves the user to the last page there is when the set shrinks', async () => {
            const { root, waitForChanges, setProps, spyOnEvent } =
                await renderTable({
                    columns,
                    data: data.slice(20),
                    mode: 'remote',
                    totalRows: 25,
                    pageSize: 10,
                    page: 3,
                });
            const load = spyOnEvent('load');

            setProps({ totalRows: 10, data: data.slice(0, 10) });
            await waitForChanges();
            await new Promise((resolve) => setTimeout(resolve, 200));
            await waitForChanges();

            expect(getPage(root, 1).getAttribute('aria-current')).toEqual(
                'page'
            );
            expect(load.events.at(-1).detail.page).toEqual(1);
        });

        // Toggling `selectable` or `movableRows` rebuilds Tabulator at
        // `paginationInitialPage`, and a fresh local-mode Tabulator never
        // fires `pageLoaded` — so nothing would put the control back in step
        // with the rows it is meant to be describing.
        it('follows the rows back when rebuilding the table resets the page', async () => {
            const { root, waitForChanges, setProps } = await renderTable({
                columns,
                data,
                pageSize: 10,
            });

            getPage(root, 2).click();
            await waitForChanges();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await waitForChanges();
            expect(getPage(root, 2).getAttribute('aria-current')).toEqual(
                'page'
            );

            setProps({ selectable: true });
            await waitForChanges();
            await new Promise((resolve) => setTimeout(resolve, 300));
            await waitForChanges();

            const shown = [
                ...getContainer(root).querySelectorAll(
                    '.tabulator-table .tabulator-row'
                ),
            ].map((row) => row.textContent);
            // `includes('Row 1')` alone would pass on page 2, where every
            // row is "Row 11" through "Row 20".
            expect(shown.some((text) => text.includes('Row 1'))).toBe(true);
            expect(shown.some((text) => text.includes('Row 11'))).toBe(false);
            expect(getPage(root, 1).getAttribute('aria-current')).toEqual(
                'page'
            );
        });

        // Tabulator is told whether it paginates when it is created, so a
        // table built without a page size has to be built again. Until it
        // is, the control renders over rows that are all still on screen and
        // its clicks move nothing.
        it('starts paging when a page size arrives late', async () => {
            const { root, waitForChanges, setProps } = await renderTable({
                columns,
                data,
            });

            expect(getPagination(root)).toBeNull();

            setProps({ pageSize: 10 });
            await waitForChanges();
            await new Promise((resolve) => setTimeout(resolve, 300));
            await waitForChanges();

            expect(
                getPageButtons(root).map((button) => button.dataset.page)
            ).toEqual(['1', '2', '3']);

            getPage(root, 2).click();
            await waitForChanges();
            await new Promise((resolve) => setTimeout(resolve, 200));
            await waitForChanges();

            expect(getRowNames(root)[0]).toEqual('Row 11');
        });

        // Tabulator slices by the size it was built with until it is told
        // otherwise, so a grown page size used to leave the control counting
        // two pages over rows still cut into ten — and rows 21 to 25 behind
        // a page that no longer existed.
        it('reaches the last rows after the page size grows', async () => {
            const { root, waitForChanges, setProps } = await renderTable({
                columns,
                data,
                pageSize: 10,
            });

            setProps({ pageSize: 20 });
            await waitForChanges();
            await new Promise((resolve) => setTimeout(resolve, 300));
            await waitForChanges();

            expect(
                getPageButtons(root).map((button) => button.dataset.page)
            ).toEqual(['1', '2']);

            getPage(root, 2).click();
            await waitForChanges();
            await new Promise((resolve) => setTimeout(resolve, 200));
            await waitForChanges();

            expect(getRowNames(root)).toContain('Row 21');
        });

        it('collapses to one page when a remote set is emptied', async () => {
            const { root, waitForChanges, setProps } = await renderTable({
                columns,
                data: data.slice(20),
                mode: 'remote',
                totalRows: 25,
                pageSize: 10,
                page: 3,
            });

            setProps({ totalRows: 0, data: [] });
            await waitForChanges();
            await new Promise((resolve) => setTimeout(resolve, 200));
            await waitForChanges();

            expect(
                getPageButtons(root).map((button) => button.dataset.page)
            ).toEqual(['1']);
        });

        // A remote table holds one page, so until it is told a total there is
        // nothing to count from. Showing the page it is on says that; showing
        // "1 of 1" would be a claim it cannot make.
        it('shows the page on its own until a remote table is given a total', async () => {
            const { root } = await renderTable({
                columns,
                data: data.slice(0, 10),
                mode: 'remote',
                pageSize: 10,
            });

            expect(
                getPageButtons(root).map((button) => button.dataset.page)
            ).toEqual(['1']);
        });
    });

    describe('pagination state', () => {
        // `has-pagination` is exposed on the host so consumers can react to a
        // multi-page table without piercing the shadow DOM.
        it('marks the host with `has-pagination` when there is more than one page', async () => {
            const columns = [{ field: 'name', title: 'Name' }];
            const data = [
                { id: 1, name: 'A' },
                { id: 2, name: 'B' },
            ];
            const { root } = await renderTable({ columns, data, pageSize: 1 });

            expect(root.classList.contains('has-pagination')).toBe(true);
        });

        it('does not mark the host for a single-page table', async () => {
            const columns = [{ field: 'name', title: 'Name' }];
            const data = [{ id: 1, name: 'A' }];
            const { root } = await renderTable({ columns, data, pageSize: 10 });

            expect(root.classList.contains('has-pagination')).toBe(false);
        });
    });

    describe('selection state', () => {
        // `has-selection` is exposed on the host so consumers can react to an
        // active row selection without piercing the shadow DOM.
        it('marks the host with `has-selection` when rows are selected', async () => {
            const columns = [{ field: 'name', title: 'Name' }];
            const data = [
                { id: 1, name: 'A' },
                { id: 2, name: 'B' },
            ];
            const { root, setProps, waitForChanges } = await renderTable({
                columns,
                data,
                selectable: true,
            });

            setProps({ selection: [data[0]] });
            await waitForChanges();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await waitForChanges();

            expect(root.classList.contains('has-selection')).toBe(true);
        });

        it('does not mark the host without a selection', async () => {
            const columns = [{ field: 'name', title: 'Name' }];
            const data = [{ id: 1, name: 'A' }];
            const { root } = await renderTable({
                columns,
                data,
                selectable: true,
            });

            expect(root.classList.contains('has-selection')).toBe(false);
        });
    });
});
