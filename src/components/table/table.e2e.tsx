import { render, h } from '@stencil/vitest';
import { cdp, userEvent } from 'vitest/browser';
import { applyProps } from './cells';
import { Column } from './table.types';

describe('limel-table', () => {
    const createColumns = (): Column[] => [
        { field: 'name', title: 'Name' },
        { field: 'age', title: 'Age' },
    ];
    const createData = () => [
        { id: 1, name: 'Cid', age: 30 },
        { id: 2, name: 'Ann', age: 4 },
        { id: 3, name: 'Bob', age: 120 },
        { id: 4, name: 'Dee', age: 30 },
        { id: 5, name: 'Eve', age: 7 },
    ];
    let columns = createColumns();
    let data = createData();

    beforeEach(() => {
        columns = createColumns();
        data = createData();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    const nextTask = () => new Promise((resolve) => setTimeout(resolve, 0));
    const nextFrame = () =>
        new Promise((resolve) => requestAnimationFrame(resolve));
    const wait = (milliseconds: number) =>
        new Promise((resolve) => setTimeout(resolve, milliseconds));

    /**
     * Waits until the table has drawn what it was last given.
     * @param waitForChanges
     */
    async function settle(waitForChanges: () => Promise<void>) {
        for (let round = 0; round < 4; round++) {
            await waitForChanges();
            await nextTask();
            await nextFrame();
        }
    }

    async function renderTable(props: Record<string, any>) {
        const result = await render(<limel-table {...props}></limel-table>);
        Object.assign(result.root.style, { width: '600px', height: '400px' });
        await result.waitForChanges();
        await vi.waitFor(() => {
            expect(
                getScrollContainer(result.root),
                'the table was not drawn'
            ).not.toBeNull();
        });

        const waitForChanges = () => settle(result.waitForChanges);
        await waitForChanges();

        return { ...result, waitForChanges: waitForChanges };
    }

    /**
     * Renders a table and records what it emits from the very start,
     * which a spy added after rendering would miss.
     * @param props
     */
    async function renderRecordingTable(props: Record<string, any>) {
        const events: string[] = [];
        const describeDetail = (detail: any) => {
            if (detail?.sorters) {
                return `page ${detail.page}, ${describeDetail(detail.sorters)}`;
            }

            if (Array.isArray(detail)) {
                return detail
                    .map((item) =>
                        item?.column
                            ? `${item.column.field} ${item.direction}`
                            : (item?.id ?? item?.title ?? String(item))
                    )
                    .join(', ');
            }

            return String(detail?.id ?? detail);
        };
        const record = (name: string) => (event: CustomEvent) => {
            events.push(`${name}: ${describeDetail(event.detail)}`);
        };

        const result = await renderTable({
            onSort: record('sort'),
            onLoad: record('load'),
            onChangePage: record('changePage'),
            onActivate: record('activate'),
            onSelect: record('select'),
            onSelectAll: record('selectAll'),
            onChangeColumns: record('changeColumns'),
            onReorder: (event: CustomEvent) => {
                const { fromRow, toRow, above } = event.detail;
                events.push(
                    `reorder: ${fromRow.id} ${above ? 'above' : 'below'} ${toRow.id}`
                );
            },
            ...props,
        });

        return { ...result, events: events };
    }

    const textOf = (element: Element) =>
        element.textContent.replaceAll('\u{A0}', ' ').trim();

    const found = <T,>(element: T | null | undefined, description: string) => {
        if (!element) {
            throw new Error(`The table shows no ${description}`);
        }

        return element;
    };

    const getHeaders = (root: HTMLElement) => [
        ...root.shadowRoot.querySelectorAll<HTMLElement>('th[scope="col"]'),
    ];

    const getHeader = (root: HTMLElement, index: number) =>
        found(getHeaders(root)[index], `header for column ${index}`);

    const getHeaderTitles = (root: HTMLElement) =>
        getHeaders(root).map((header) =>
            textOf(found(header.querySelector('span'), 'title in a header'))
        );

    const getSortArrow = (root: HTMLElement, index: number) =>
        found(
            getHeader(root, index).querySelector('i'),
            `arrow in the header of column ${index}`
        );

    const getSortDirection = (root: HTMLElement, index: number) =>
        getHeader(root, index).getAttribute('aria-sort') ?? 'none';

    const getRows = (root: HTMLElement) => [
        ...root.shadowRoot.querySelectorAll<HTMLElement>('tbody tr'),
    ];

    const getRow = (root: HTMLElement, rowIndex: number) =>
        found(getRows(root)[rowIndex], `row ${rowIndex}`);

    const getCells = (row: HTMLElement) =>
        [...row.querySelectorAll<HTMLElement>('td:not(.select, .drag)')].slice(
            0,
            row.closest('table').querySelectorAll('th[scope="col"]').length
        );

    const getCell = (root: HTMLElement, rowIndex: number, columnIndex = 0) =>
        found(
            getCells(getRow(root, rowIndex))[columnIndex],
            `cell ${columnIndex} in row ${rowIndex}`
        );

    const getCellComponent = (
        root: HTMLElement,
        rowIndex: number,
        columnIndex: number,
        name: string
    ) =>
        found(
            getCell(root, rowIndex, columnIndex).querySelector<HTMLElement>(
                name
            ),
            `<${name}> in cell ${columnIndex} of row ${rowIndex}`
        );

    const getCellTexts = (root: HTMLElement) =>
        getRows(root).map((row) => getCells(row).map(textOf));

    const getFirstColumn = (root: HTMLElement) =>
        getCellTexts(root).map((cells) => cells[0]);

    const click = (element: Element, options: MouseEventInit = {}) =>
        element.dispatchEvent(
            new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                composed: true,
                ...options,
            })
        );

    const clickHeader = (
        root: HTMLElement,
        index: number,
        options: MouseEventInit = {}
    ) => {
        const header = getHeader(root, index);

        return click(header.querySelector('button') ?? header, options);
    };

    const clickCell = (
        root: HTMLElement,
        rowIndex: number,
        columnIndex = 0,
        options: MouseEventInit = {}
    ) => click(getCell(root, rowIndex, columnIndex), options);

    const getRowCheckbox = (root: HTMLElement, rowIndex: number) =>
        found(
            getRow(root, rowIndex).querySelector<HTMLLimelCheckboxElement>(
                ':scope > td.select limel-checkbox'
            ),
            `checkbox in row ${rowIndex}`
        );

    const clickCheckbox = (
        root: HTMLElement,
        rowIndex: number,
        options: MouseEventInit = {}
    ) => click(getRowCheckbox(root, rowIndex), options);

    const getRowCheckboxLabel = (root: HTMLElement, rowIndex: number) =>
        getRowCheckbox(root, rowIndex).label;

    const getCheckboxCell = (root: HTMLElement, rowIndex: number) =>
        found(
            getRow(root, rowIndex).querySelector<HTMLElement>('td.select'),
            `checkbox cell in row ${rowIndex}`
        );

    const getCheckedRows = (root: HTMLElement) =>
        getRows(root).map((_, index) => getRowCheckbox(root, index).checked);

    const getSelectAll = (root: HTMLElement) =>
        found(
            root.shadowRoot.querySelector<HTMLLimelCheckboxElement>(
                'th.select limel-checkbox'
            ),
            '"select all" checkbox'
        );

    const getSelectAllState = (root: HTMLElement) => {
        const checkbox = getSelectAll(root);

        return {
            checked: checkbox.checked,
            indeterminate: checkbox.indeterminate,
            disabled: checkbox.disabled,
            label: checkbox.label,
        };
    };

    const getSelectAllInput = (root: HTMLElement) =>
        found(
            getSelectAll(root).shadowRoot.querySelector('input'),
            'input of the "select all" checkbox'
        );

    const isSelectAllShownChecked = (root: HTMLElement) =>
        getSelectAllInput(root).checked;

    const clickSelectAll = (root: HTMLElement) =>
        getSelectAllInput(root).click();

    const getActiveRows = (root: HTMLElement) =>
        getRows(root)
            .map((row, index) =>
                row.getAttribute('aria-current') === 'true' ? index : -1
            )
            .filter((index) => index !== -1);

    const getRowBackground = (row: HTMLElement) =>
        getComputedStyle(row).backgroundColor;

    const getPagination = (root: HTMLElement) =>
        root.shadowRoot.querySelector('limel-pagination');

    const getShownPagination = (root: HTMLElement) =>
        found(getPagination(root), 'pagination');

    const getPageButtons = (root: HTMLElement) => [
        ...getShownPagination(root).shadowRoot.querySelectorAll<HTMLElement>(
            'button[data-page]'
        ),
    ];

    const clickPage = (root: HTMLElement, page: number) =>
        found(
            getPageButtons(root).find(
                (button) => button.dataset.page === String(page)
            ),
            `button for page ${page}`
        ).click();

    const getCurrentPage = (root: HTMLElement) =>
        Number(
            found(
                getPageButtons(root).find(
                    (button) => button.getAttribute('aria-current') === 'page'
                ),
                'current page'
            ).textContent
        );

    const getPageCount = (root: HTMLElement) => getPageButtons(root).length;

    const getAggregateRow = (root: HTMLElement) =>
        root.shadowRoot.querySelector<HTMLElement>('tfoot tr');

    const getAggregates = (root: HTMLElement) => {
        const row = getAggregateRow(root);

        return row ? getCells(row).map(textOf) : [];
    };

    const getScrollContainer = (root: HTMLElement) =>
        root.shadowRoot.querySelector('table')?.parentElement ?? null;

    const isShown = (element: HTMLElement) =>
        !!element && getComputedStyle(element).display !== 'none';

    const getEmptyMessage = (root: HTMLElement) => {
        const message = root.shadowRoot.querySelector<HTMLElement>('p');

        return isShown(message) ? textOf(message) : null;
    };

    const isLoading = (root: HTMLElement) =>
        isShown(root.shadowRoot.querySelector('limel-spinner'));

    const getRowHandle = (root: HTMLElement, rowIndex: number) =>
        found(
            getRow(root, rowIndex).querySelector<HTMLLimelDragHandleElement>(
                ':scope > td.drag limel-drag-handle'
            ),
            `drag handle in row ${rowIndex}`
        );

    const getResizeHandle = (root: HTMLElement, index: number) =>
        found(
            getHeader(root, index).querySelector<HTMLElement>(':scope > hr'),
            `resize handle for column ${index}`
        );

    const waitForTransitions = (root: HTMLElement) =>
        Promise.allSettled(
            root.shadowRoot
                .getAnimations()
                .map((animation) => animation.finished)
        );

    const centerOf = (element: Element) => {
        const rect = element.getBoundingClientRect();

        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    };

    /**
     * Sends a real mouse event, which a test page in a scaled frame
     * receives at the given point in its own coordinates.
     * @param type
     * @param point
     * @param point.x
     * @param point.y
     * @param buttons
     */
    const sendMouse = (
        type: 'mouseMoved' | 'mousePressed' | 'mouseReleased',
        point: { x: number; y: number },
        buttons: number
    ) => {
        const frame = (
            globalThis.frameElement as HTMLElement
        )?.getBoundingClientRect() ?? {
            left: 0,
            top: 0,
            width: globalThis.innerWidth,
        };
        const scale = frame.width / globalThis.innerWidth;

        return cdp().send('Input.dispatchMouseEvent', {
            type: type,
            x: frame.left + point.x * scale,
            y: frame.top + point.y * scale,
            button: 'left',
            buttons: buttons,
            clickCount: 1,
        });
    };

    /**
     * Drags with a real mouse: presses on the middle of an element, holds
     * it long enough to count as a drag, moves to a point and lets go.
     * @param from
     * @param to
     * @param to.x
     * @param to.y
     */
    const drag = async (from: Element, to: { x: number; y: number }) => {
        const start = centerOf(from);
        const steps = 8;

        await sendMouse('mouseMoved', start, 0);
        await sendMouse('mousePressed', start, 1);
        await wait(300);
        for (let step = 1; step <= steps; step++) {
            await sendMouse(
                'mouseMoved',
                {
                    x: start.x + ((to.x - start.x) * step) / steps,
                    y: start.y + ((to.y - start.y) * step) / steps,
                },
                1
            );
        }

        await sendMouse('mouseReleased', to, 0);
    };

    const dragHeader = (root: HTMLElement, from: number, to: number) => {
        const target = getHeader(root, to).getBoundingClientRect();

        return drag(getHeader(root, from), {
            x: target.right - 2,
            y: target.top + target.height / 2,
        });
    };

    const dragRow = (root: HTMLElement, from: number, to: number) =>
        userEvent.dragAndDrop(getRowHandle(root, from), getRow(root, to));

    describe('columns and headers', () => {
        it('shows the title of each column', async () => {
            const { root } = await renderTable({ columns });

            expect(getHeaderTitles(root)).toEqual(['Name', 'Age']);
        });

        it('shows markup in a column title as plain text', async () => {
            const { root } = await renderTable({
                data,
                columns: [{ ...columns[0], title: '<b>Name</b>' }],
            });

            expect(getHeaderTitles(root)).toEqual(['<b>Name</b>']);
            expect(getHeader(root, 0).querySelector('b')).toBeNull();
        });

        it('sorts descending on the first click and ascending on the second', async () => {
            const { root, waitForChanges } = await renderTable({
                data,
                columns,
            });

            clickHeader(root, 1);
            await waitForChanges();

            expect(getFirstColumn(root)).toEqual([
                'Bob',
                'Cid',
                'Dee',
                'Eve',
                'Ann',
            ]);
            expect(getSortDirection(root, 1)).toBe('descending');

            clickHeader(root, 1);
            await waitForChanges();

            expect(getFirstColumn(root)).toEqual([
                'Ann',
                'Eve',
                'Cid',
                'Dee',
                'Bob',
            ]);
            expect(getSortDirection(root, 1)).toBe('ascending');
        });

        it('does not sort a column with `headerSort` turned off', async () => {
            const { root, events, waitForChanges } = await renderRecordingTable(
                {
                    data,
                    columns: [{ ...columns[0], headerSort: false }, columns[1]],
                }
            );

            clickHeader(root, 0);
            await waitForChanges();

            expect(events).toEqual([]);
            expect(getFirstColumn(root)).toEqual([
                'Cid',
                'Ann',
                'Bob',
                'Dee',
                'Eve',
            ]);
            expect(getSortDirection(root, 0)).toBe('none');
        });

        it('does not sort any column when `sortableColumns` is turned off', async () => {
            const { root, events, waitForChanges } = await renderRecordingTable(
                { data, columns, sortableColumns: false }
            );

            clickHeader(root, 0);
            clickHeader(root, 1);
            await waitForChanges();

            expect(events).toEqual([]);
            expect(getFirstColumn(root)[0]).toBe('Cid');
        });

        it('still sorts through the `sorting` prop when `sortableColumns` is turned off', async () => {
            const { root, waitForChanges, setProps } = await renderTable({
                data,
                columns,
                sortableColumns: false,
            });

            setProps({ sorting: [{ column: columns[0], direction: 'ASC' }] });
            await waitForChanges();

            expect(getFirstColumn(root)).toEqual([
                'Ann',
                'Bob',
                'Cid',
                'Dee',
                'Eve',
            ]);
        });

        it('renders a component in the header, next to the title', async () => {
            const propsFactory = vi.fn().mockReturnValue({ size: 'small' });
            const { root } = await renderTable({
                data,
                columns: [
                    {
                        ...columns[0],
                        headerComponent: {
                            name: 'limel-icon',
                            props: { name: 'filter' },
                            propsFactory: propsFactory,
                        },
                    },
                ],
            });

            const icon = found(
                getHeader(root, 0).querySelector('limel-icon'),
                'icon in the header'
            );
            expect(icon.name).toBe('filter');
            expect(icon.size).toBe('small');
            expect(getHeaderTitles(root)).toEqual(['Name']);
            expect(propsFactory).toHaveBeenCalledWith(null);
        });

        it('asks a header component for its properties once per column', async () => {
            const propsFactory = vi.fn().mockReturnValue({});
            const { root, waitForChanges, setProps } = await renderTable({
                data,
                columns: [
                    {
                        ...columns[0],
                        headerComponent: {
                            name: 'span',
                            propsFactory: propsFactory,
                        },
                    },
                    columns[1],
                ],
            });

            clickHeader(root, 1);
            await waitForChanges();
            setProps({ data: [...data].reverse(), loading: true });
            await waitForChanges();

            expect(propsFactory).toHaveBeenCalledTimes(1);
        });

        it('follows a new order of the same column objects in the `columns` prop', async () => {
            const { root, setProps, waitForChanges } = await renderTable({
                data,
                columns,
            });

            setProps({ columns: [columns[1], columns[0]] });
            await waitForChanges();

            expect(getHeaderTitles(root)).toEqual(['Age', 'Name']);
        });

        it('follows a new order of new column objects in the `columns` prop', async () => {
            const { root, setProps, waitForChanges } = await renderTable({
                data,
                columns,
            });

            setProps({ columns: [{ ...columns[1] }, { ...columns[0] }] });
            await waitForChanges();

            expect(getHeaderTitles(root)).toEqual(['Age', 'Name']);
            expect(getFirstColumn(root)[0]).toBe('30');
        });

        it('moves the component in a cell with its column when the columns come in a new order', async () => {
            const withInputs = columns.map((column) => ({
                ...column,
                component: { name: 'input' },
            }));
            const { root, setProps, waitForChanges } = await renderTable({
                data,
                columns: withInputs,
            });
            const nameInput = getCellComponent(root, 0, 0, 'input');

            setProps({ columns: [withInputs[1], withInputs[0]] });
            await waitForChanges();

            expect(getCellComponent(root, 0, 1, 'input')).toBe(nameInput);
            expect((nameInput as HTMLInputElement).value).toBe('Cid');
        });

        it('adds and removes columns given in the `columns` prop', async () => {
            const { root, setProps, waitForChanges } = await renderTable({
                data,
                columns,
            });

            setProps({ columns: [columns[1]] });
            await waitForChanges();
            expect(getHeaderTitles(root)).toEqual(['Age']);

            setProps({ columns: [...columns, { field: 'id', title: 'Id' }] });
            await waitForChanges();
            expect(getHeaderTitles(root)).toEqual(['Name', 'Age', 'Id']);
            expect(getCellTexts(root)[0]).toEqual(['Cid', '30', '1']);
        });

        it('shows an arrow in the header of the sorted column', async () => {
            const { root, waitForChanges } = await renderTable({
                data,
                columns,
            });
            const getArrow = () => getComputedStyle(getSortArrow(root, 1));
            const transparent = 'rgba(0, 0, 0, 0)';

            clickHeader(root, 1);
            await waitForChanges();
            await waitForTransitions(root);

            expect(getArrow().opacity).toBe('1');
            expect(getArrow().borderBottomColor).not.toBe(transparent);
            expect(getArrow().borderTopWidth).toBe('0px');

            clickHeader(root, 1);
            await waitForChanges();
            await waitForTransitions(root);

            expect(getArrow().opacity).toBe('1');
            expect(getArrow().borderTopColor).not.toBe(transparent);
            expect(getArrow().borderBottomWidth).toBe('0px');
        });
    });

    describe('cells', () => {
        it('shows the value of each field', async () => {
            const { root } = await renderTable({ data, columns });

            expect(getCellTexts(root)).toEqual([
                ['Cid', '30'],
                ['Ann', '4'],
                ['Bob', '120'],
                ['Dee', '30'],
                ['Eve', '7'],
            ]);
        });

        it('shows what the formatter returns, given the value and the row', async () => {
            const formatter = vi.fn(
                (value: number, row: any) => `${row.name} is ${value}`
            );
            const { root } = await renderTable({
                data,
                columns: [{ ...columns[1], formatter: formatter }],
            });

            expect(getFirstColumn(root)[0]).toBe('Cid is 30');
            expect(formatter).toHaveBeenCalledWith(30, data[0]);
        });

        it('shows markup in a value as plain text', async () => {
            const { root } = await renderTable({
                data: [{ id: 1, name: '<b>bold</b>' }],
                columns,
            });

            expect(getFirstColumn(root)).toEqual(['<b>bold</b>']);
            expect(getCell(root, 0).querySelector('b')).toBeNull();
        });

        it('shows markup that a formatter returns as plain text', async () => {
            const { root } = await renderTable({
                data,
                columns: [
                    {
                        ...columns[0],
                        formatter: (value: string) => `<i>${value}</i>`,
                    },
                ],
            });

            expect(getFirstColumn(root)[0]).toBe('<i>Cid</i>');
            expect(getCell(root, 0).querySelector('i')).toBeNull();
        });

        it('shows an empty cell for a missing value', async () => {
            const { root } = await renderTable({
                data: [{ id: 1, name: 'Cid' }],
                columns,
            });

            expect(getCellTexts(root)).toEqual([['Cid', '']]);
        });

        it('shows a list in a cell as its items', async () => {
            const { root } = await renderTable({
                data: [{ id: 1, name: ['sales', 'vip'] }],
                columns,
            });

            expect(getFirstColumn(root)).toEqual(['sales,vip']);
        });

        it('shows an empty cell, and warns, for an object in a cell', async () => {
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
            const { root } = await renderTable({
                data: [{ id: 1, name: { first: 'Cid' } }],
                columns,
            });

            expect(getFirstColumn(root)).toEqual(['']);
            expect(warn).toHaveBeenCalledTimes(1);
            expect(warn.mock.calls[0][0]).toContain('"name"');
            expect(warn.mock.calls[0][0]).not.toContain('Cid');
        });

        it('renders a component in a cell with the field, the value, the row and its props', async () => {
            const onPing = vi.fn();
            const { root } = await renderTable({
                data,
                columns: [
                    {
                        ...columns[0],
                        component: {
                            name: 'span',
                            props: { title: 'configured', onPing: onPing },
                            propsFactory: (row: any) => ({
                                lang: `row-${row.id}`,
                            }),
                        },
                    },
                ],
            });

            const element: any = getCellComponent(root, 1, 0, 'span');
            expect(element.field).toBe('name');
            expect(element.value).toBe('Ann');
            expect(element.data).toBe(data[1]);
            expect(element.title).toBe('configured');
            expect(element.lang).toBe('row-2');

            element.dispatchEvent(new CustomEvent('ping'));
            expect(onPing).toHaveBeenCalledTimes(1);
        });

        it('gives a component in a cell the formatted value', async () => {
            const { root } = await renderTable({
                data,
                columns: [
                    {
                        ...columns[1],
                        formatter: (value: number) => `${value} years`,
                        component: { name: 'span' },
                    },
                ],
            });

            const element: any = getCellComponent(root, 0, 0, 'span');
            expect(element.value).toBe('30 years');
        });

        it('shows the value as text when the component of a column is not registered', async () => {
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
            const name = `limel-test-missing-${Date.now()}`;
            const { root } = await renderTable({
                data,
                columns: [{ ...columns[0], component: { name: name } }],
            });

            expect(getFirstColumn(root)[0]).toBe('Cid');
            expect(root.shadowRoot.querySelector(name)).toBeNull();
            expect(warn).toHaveBeenCalledWith(expect.stringContaining(name));
        });

        it('aligns the cells of a column', async () => {
            const { root } = await renderTable({
                data,
                columns: [
                    columns[0],
                    { ...columns[1], horizontalAlign: 'right' },
                ],
            });

            expect(getComputedStyle(getCell(root, 0, 1)).textAlign).toBe(
                'right'
            );
        });

        it('renders a component that is registered after the table was drawn', async () => {
            vi.spyOn(console, 'warn').mockImplementation(() => {});
            const name = `limel-test-late-cell-${Date.now()}`;
            const { root, waitForChanges } = await renderTable({
                data,
                columns: [{ ...columns[0], component: { name: name } }],
            });

            expect(getFirstColumn(root)[0]).toBe('Cid');
            expect(getCell(root, 0).querySelector(name)).toBeNull();

            customElements.define(name, class extends HTMLElement {});
            await customElements.whenDefined(name);
            await waitForChanges();

            const cell: any = getCellComponent(root, 0, 0, name);
            expect(cell.value).toBe('Cid');
        });

        it('warns when the name of a component can never be registered', async () => {
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
            const { root, waitForChanges } = await renderTable({
                data,
                columns: [{ ...columns[0], component: { name: 'Not-Valid' } }],
            });
            await waitForChanges();

            expect(getFirstColumn(root)[0]).toBe('Cid');
            expect(
                warn.mock.calls.some(([message]) =>
                    String(message).includes('not a valid name')
                )
            ).toBe(true);
        });

        it('does not style a component in a cell as its own spinner or empty message', async () => {
            const { root } = await renderTable({
                data,
                columns: [
                    { ...columns[0], component: { name: 'p' } },
                    { ...columns[1], component: { name: 'limel-spinner' } },
                ],
            });

            expect(
                getComputedStyle(getCellComponent(root, 0, 0, 'p')).position
            ).toBe('static');
            expect(
                getComputedStyle(getCellComponent(root, 0, 1, 'limel-spinner'))
                    .position
            ).not.toBe('absolute');
        });

        it('takes away the text of a native input when its cell is used again for a row without one', () => {
            const input = document.createElement('input');
            input.setAttribute('value', 'seed');
            applyProps(input, { value: 'first' });

            applyProps(input, {});

            expect(input.value).toBe('');
            expect(input.hasAttribute('value')).toBe(false);
        });
    });

    describe('data updates', () => {
        it('shows the same rows given in a new array, and emits nothing', async () => {
            const { root, events, waitForChanges, setProps } =
                await renderRecordingTable({ data, columns });
            const rowBefore = getRow(root, 2);

            setProps({ data: [...data] });
            await waitForChanges();

            expect(getFirstColumn(root)).toEqual([
                'Cid',
                'Ann',
                'Bob',
                'Dee',
                'Eve',
            ]);
            expect(getRow(root, 2)).toBe(rowBefore);
            expect(events).toEqual([]);
        });

        it('shows a row that was replaced by a changed copy, in the same row element', async () => {
            const { root, waitForChanges, setProps } = await renderTable({
                data,
                columns,
            });
            const rowBefore = getRow(root, 2);

            setProps({
                data: data.map((row) =>
                    row.id === 3 ? { ...row, name: 'Robert' } : row
                ),
            });
            await waitForChanges();

            expect(getRow(root, 2)).toBe(rowBefore);
            expect(getFirstColumn(root)[2]).toBe('Robert');
        });

        it('shows a field that was removed from a changed copy as empty', async () => {
            const { root, waitForChanges, setProps } = await renderTable({
                data,
                columns,
            });

            setProps({
                data: data.map((row) =>
                    row.id === 3 ? { id: 3, name: 'Bob' } : row
                ),
            });
            await waitForChanges();

            expect(getCellTexts(root)[2]).toEqual(['Bob', '']);
        });

        it('shows a value that was changed on the row object itself', async () => {
            const rows = data.map((row) => ({ ...row }));
            const { root, waitForChanges, setProps } = await renderTable({
                data: rows,
                columns: [
                    columns[0],
                    { ...columns[1], component: { name: 'span' } },
                ],
            });

            rows[1].name = 'Changed';
            rows[1].age = 99;
            setProps({ data: [...rows] });
            await waitForChanges();

            expect(getFirstColumn(root)[1]).toBe('Changed');
            expect((getCellComponent(root, 1, 1, 'span') as any).value).toBe(
                99
            );
        });

        it('shows a change on the row object itself that a formatter or a component reads from another field', async () => {
            const rows = data.map((row) => ({ ...row }));
            const { root, waitForChanges, setProps } = await renderTable({
                data: rows,
                columns: [
                    {
                        ...columns[0],
                        formatter: (value: string, row: any) =>
                            `${value} (${row.age})`,
                    },
                    {
                        ...columns[0],
                        component: {
                            name: 'span',
                            propsFactory: (row: any) => ({ title: row.age }),
                        },
                    },
                ],
            });

            rows[1].age = 99;
            setProps({ data: [...rows] });
            await waitForChanges();

            expect(getFirstColumn(root)[1]).toBe(`${rows[1].name} (99)`);
            expect(getCellComponent(root, 1, 1, 'span').title).toBe('99');
        });

        it('redraws every cell of a row that is replaced by a changed copy', async () => {
            const { root, waitForChanges, setProps } = await renderTable({
                data,
                columns: [
                    {
                        ...columns[0],
                        formatter: (value: string, row: any) =>
                            `${value} (${row.age})`,
                    },
                    columns[1],
                ],
            });

            setProps({
                data: data.map((row) =>
                    row.id === 2 ? { ...row, age: 99 } : row
                ),
            });
            await waitForChanges();

            expect(getCellTexts(root)[1]).toEqual(['Ann (99)', '99']);
        });

        it('leaves the row object it was given first as it is, when the row is replaced by a changed copy', async () => {
            const { waitForChanges, setProps } = await renderTable({
                data,
                columns,
            });
            const firstRow = data[2];

            setProps({
                data: data.map((row) =>
                    row.id === 3 ? { id: 3, name: 'Robert' } : row
                ),
            });
            await waitForChanges();

            expect(firstRow).toEqual({ id: 3, name: 'Bob', age: 120 });
        });

        it('shows rows that were added and leaves out rows that were removed', async () => {
            const { root, events, waitForChanges, setProps } =
                await renderRecordingTable({ data, columns });

            setProps({
                data: [
                    ...data.filter((row) => row.id !== 2),
                    { id: 6, name: 'Fay', age: 51 },
                ],
            });
            await waitForChanges();

            expect(getFirstColumn(root)).toEqual([
                'Cid',
                'Bob',
                'Dee',
                'Eve',
                'Fay',
            ]);
            expect(events).toEqual([]);
        });

        it('shows rows in the order they are given', async () => {
            const { root, events, waitForChanges, setProps } =
                await renderRecordingTable({ data, columns });

            setProps({ data: [...data].reverse() });
            await waitForChanges();

            expect(getFirstColumn(root)).toEqual([
                'Eve',
                'Dee',
                'Bob',
                'Ann',
                'Cid',
            ]);
            expect(events).toEqual([]);
        });

        it('shows rows that are given later in the order of the sorting', async () => {
            const { root, waitForChanges, setProps } = await renderTable({
                data,
                columns,
            });
            clickHeader(root, 0);
            await waitForChanges();

            setProps({ data: [...data, { id: 6, name: 'Abe', age: 51 }] });
            await waitForChanges();

            expect(getFirstColumn(root)).toEqual([
                'Eve',
                'Dee',
                'Cid',
                'Bob',
                'Ann',
                'Abe',
            ]);
        });

        it('shows a change made to a row while it was not in the table', async () => {
            const rows = data.map((row) => ({ ...row }));
            const { root, waitForChanges, setProps } = await renderTable({
                data: rows,
                columns,
            });

            setProps({ data: rows.slice(1) });
            await waitForChanges();
            rows[0].name = 'Changed';
            setProps({ data: [...rows] });
            await waitForChanges();

            expect(getFirstColumn(root)[0]).toBe('Changed');
        });

        it('keeps the scroll position when a row changes', async () => {
            const manyRows = Array.from({ length: 60 }, (_, index) => ({
                id: index + 1,
                name: `Row ${index + 1}`,
            }));
            const { root, waitForChanges, setProps } = await renderTable({
                data: manyRows,
                columns,
            });
            const scrollContainer = getScrollContainer(root);
            scrollContainer.scrollTop = 500;
            await waitForChanges();

            setProps({
                data: manyRows.map((row) =>
                    row.id === 40 ? { ...row, name: 'Changed' } : row
                ),
            });
            await waitForChanges();

            expect(scrollContainer.scrollTop).toBe(500);
        });

        it('keeps the page, the selection and the active row when a row changes', async () => {
            const { root, events, waitForChanges, setProps } =
                await renderRecordingTable({
                    data,
                    columns,
                    pageSize: 2,
                    page: 2,
                    selectable: true,
                    selection: [data[3]],
                    activeRow: data[2],
                });
            events.length = 0;

            setProps({
                data: data.map((row) =>
                    row.id === 3 ? { ...row, name: 'Robert' } : row
                ),
            });
            await waitForChanges();

            expect(getFirstColumn(root)).toEqual(['Robert', 'Dee']);
            expect(getCurrentPage(root)).toBe(2);
            expect(getCheckedRows(root)).toEqual([false, true]);
            expect(getActiveRows(root)).toEqual([0]);
            expect(events).toEqual([]);
        });

        it('keeps the selection and the active row when rows are added and removed', async () => {
            const { root, events, waitForChanges, setProps } =
                await renderRecordingTable({
                    data,
                    columns,
                    selectable: true,
                    selection: [data[3]],
                    activeRow: data[2],
                });
            events.length = 0;

            setProps({ data: data.filter((row) => row.id !== 1) });
            await waitForChanges();

            expect(getCheckedRows(root)).toEqual([false, false, true, false]);
            expect(getActiveRows(root)).toEqual([1]);
            expect(events).toEqual([]);
        });

        it('does not ask a cell for its properties again when nothing changed', async () => {
            const propsFactory = vi.fn().mockReturnValue({});
            const { waitForChanges, setProps } = await renderTable({
                data,
                columns: [
                    {
                        ...columns[0],
                        component: { name: 'span', propsFactory: propsFactory },
                    },
                ],
            });
            const callsAfterFirstRender = propsFactory.mock.calls.length;

            setProps({ data: data.map((row) => ({ ...row })), loading: true });
            await waitForChanges();

            expect(propsFactory.mock.calls).toHaveLength(callsAfterFirstRender);
        });

        it('draws the rows and columns it gets after having none', async () => {
            const { root, waitForChanges, setProps } = await renderTable({
                data: null,
                columns: null,
            });

            setProps({ data: data, columns: columns });
            await waitForChanges();

            expect(getHeaderTitles(root)).toEqual(['Name', 'Age']);
            expect(getRows(root)).toHaveLength(5);

            setProps({ data: null });
            await waitForChanges();

            expect(getRows(root)).toHaveLength(0);
        });
    });

    describe('sorting given as nothing', () => {
        it('goes back to the given order when `sorting` is set to `null`, and sorts again after that', async () => {
            const { root, waitForChanges, setProps } = await renderTable({
                data,
                columns,
                sorting: [{ column: columns[0], direction: 'DESC' }],
            });
            const unsorted = data.map((row) => row.name);
            expect(getFirstColumn(root)).not.toEqual(unsorted);

            setProps({ sorting: null });
            await waitForChanges();
            expect(getFirstColumn(root)).toEqual(unsorted);

            setProps({ sorting: [{ column: columns[0], direction: 'ASC' }] });
            await waitForChanges();
            expect(getFirstColumn(root)).toEqual(
                unsorted.toSorted((a, b) => a.localeCompare(b))
            );
        });
    });

    describe('sorting in local mode', () => {
        const sortBy = async (
            values: unknown[],
            clicks: number
        ): Promise<string[]> => {
            const { root, waitForChanges } = await renderTable({
                data: values.map((value, index) => ({
                    id: index + 1,
                    value: value,
                })),
                columns: [
                    { field: 'id', title: 'Id' },
                    { field: 'value', title: 'Value' },
                ],
            });
            for (let count = 0; count < clicks; count++) {
                clickHeader(root, 1);
                await waitForChanges();
            }

            return getFirstColumn(root);
        };

        it('sorts numbers by their value', async () => {
            const numbers = [10, 2, -1, 33, 2.5];

            expect(await sortBy(numbers, 1)).toEqual(['4', '1', '5', '2', '3']);
            expect(await sortBy(numbers, 2)).toEqual(['3', '2', '5', '1', '4']);
        });

        it('sorts text alphabetically, ignoring case', async () => {
            const words = ['banana', 'Apple', 'cherry', 'apricot', 'Blueberry'];

            expect(await sortBy(words, 2)).toEqual(['2', '4', '1', '5', '3']);
        });

        it('sorts text with digits in it by the value of the digits', async () => {
            const rooms = ['Room 10', 'Room 2', 'Room 1'];

            expect(await sortBy(rooms, 2)).toEqual(['3', '2', '1']);
        });

        it('sorts numbers given as text by their value', async () => {
            const numbers = ['10', '9', '100'];

            expect(await sortBy(numbers, 2)).toEqual(['2', '1', '3']);
        });

        it('sorts booleans', async () => {
            const booleans = [true, false, true, false];

            expect(await sortBy(booleans, 2)).toEqual(['2', '4', '1', '3']);
        });

        it('sorts dates written as ISO text by their time', async () => {
            const dates = ['2024-03-01', '2023-12-24', '2024-01-15'];

            expect(await sortBy(dates, 2)).toEqual(['2', '3', '1']);
        });

        it('sorts dates by their time', async () => {
            const { root, waitForChanges } = await renderTable({
                data: [
                    new Date('2024-03-01'),
                    new Date('2023-12-24'),
                    new Date('2024-01-15'),
                ].map((date, index) => ({ id: index + 1, value: date })),
                columns: [
                    { field: 'id', title: 'Id' },
                    { field: 'value', title: 'Value' },
                ],
            });

            clickHeader(root, 1);
            await waitForChanges();

            expect(getSortDirection(root, 1)).toBe('descending');
            expect(getFirstColumn(root)).toEqual(['1', '3', '2']);

            clickHeader(root, 1);
            await waitForChanges();

            expect(getSortDirection(root, 1)).toBe('ascending');
            expect(getFirstColumn(root)).toEqual(['2', '3', '1']);
        });

        it('puts empty values first in ascending order and last in descending order', async () => {
            const values = [5, null, 1, undefined, 3];

            expect(await sortBy(values, 2)).toEqual(['2', '4', '3', '5', '1']);
            expect(await sortBy(values, 1)).toEqual(['1', '5', '3', '2', '4']);
        });

        it('emits `sort` once when it is created with a sorting', async () => {
            const { root, events } = await renderRecordingTable({
                data,
                columns,
                sorting: [{ column: columns[0], direction: 'ASC' }],
            });

            expect(events).toEqual(['sort: name ASC']);
            expect(getFirstColumn(root)[0]).toBe('Ann');
            expect(getSortDirection(root, 0)).toBe('ascending');
        });

        it('sorts numbers by their value, also after a click, when it is created with a sorting on their column', async () => {
            const { root, waitForChanges } = await renderTable({
                data,
                columns,
                sorting: [{ column: columns[1], direction: 'ASC' }],
            });

            expect(getFirstColumn(root)).toEqual([
                'Ann',
                'Eve',
                'Cid',
                'Dee',
                'Bob',
            ]);

            clickHeader(root, 1);
            await waitForChanges();

            expect(getFirstColumn(root)).toEqual([
                'Bob',
                'Cid',
                'Dee',
                'Eve',
                'Ann',
            ]);
        });

        it('emits nothing when it is created without a sorting', async () => {
            const { events } = await renderRecordingTable({
                data,
                columns,
                pageSize: 2,
            });

            expect(events).toEqual([]);
        });

        it('emits `sort` with the column and the direction for each click on a header', async () => {
            const sort = vi.fn();
            const { root, waitForChanges } = await renderTable({
                data,
                columns,
                onSort: sort,
            });

            clickHeader(root, 0);
            clickHeader(root, 0);
            clickHeader(root, 1);
            await waitForChanges();

            expect(sort.mock.calls.map(([event]) => event.detail)).toEqual([
                [{ column: columns[0], direction: 'DESC' }],
                [{ column: columns[0], direction: 'ASC' }],
                [{ column: columns[1], direction: 'DESC' }],
            ]);
        });

        it('adds a column to the sorting on a shift-click', async () => {
            const { root, events, waitForChanges } = await renderRecordingTable(
                { data, columns }
            );

            clickHeader(root, 1);
            clickHeader(root, 0, { shiftKey: true });
            await waitForChanges();

            expect(events.at(-1)).toBe('sort: age DESC, name DESC');
            expect(getFirstColumn(root)).toEqual([
                'Eve',
                'Dee',
                'Cid',
                'Bob',
                'Ann',
            ]);
        });

        it('sorts when the `sorting` prop changes', async () => {
            const { root, events, waitForChanges, setProps } =
                await renderRecordingTable({ data, columns });

            setProps({ sorting: [{ column: columns[0], direction: 'DESC' }] });
            await waitForChanges();

            expect(events).toEqual(['sort: name DESC']);
            expect(getFirstColumn(root)[0]).toBe('Eve');
            expect(getSortDirection(root, 0)).toBe('descending');
        });

        it('sorts by the last column in the `sorting` prop first, and by the ones before it when values are equal', async () => {
            const { root, waitForChanges, setProps } = await renderTable({
                data,
                columns,
            });

            setProps({
                sorting: [
                    { column: columns[0], direction: 'DESC' },
                    { column: columns[1], direction: 'ASC' },
                ],
            });
            await waitForChanges();

            expect(getFirstColumn(root)).toEqual([
                'Ann',
                'Eve',
                'Dee',
                'Cid',
                'Bob',
            ]);
        });

        it('emits nothing and keeps the order when the sorted column is removed', async () => {
            const { root, events, waitForChanges, setProps } =
                await renderRecordingTable({ data, columns });
            clickHeader(root, 0);
            await waitForChanges();
            events.length = 0;

            setProps({ columns: [columns[1]] });
            await waitForChanges();

            expect(events).toEqual([]);
            expect(getFirstColumn(root)).toEqual(['7', '30', '30', '120', '4']);
        });

        it('goes back to the order the rows were given, without an event, when `sorting` is emptied', async () => {
            const { root, events, waitForChanges, setProps } =
                await renderRecordingTable({
                    data,
                    columns,
                    sorting: [{ column: columns[0], direction: 'ASC' }],
                });
            events.length = 0;

            setProps({ sorting: [] });
            await waitForChanges();

            expect(events).toEqual([]);
            expect(getFirstColumn(root)[0]).toBe('Cid');
        });
    });

    describe('pages in local mode', () => {
        it('splits the rows into pages', async () => {
            const { root, events, waitForChanges } = await renderRecordingTable(
                { data, columns, pageSize: 2 }
            );

            expect(getFirstColumn(root)).toEqual(['Cid', 'Ann']);
            expect(getPageCount(root)).toBe(3);

            clickPage(root, 3);
            await waitForChanges();

            expect(getFirstColumn(root)).toEqual(['Eve']);
            expect(getCurrentPage(root)).toBe(3);
            expect(events).toEqual(['changePage: 3']);
        });

        it('shows the page it is created with, and emits nothing', async () => {
            const { root, events } = await renderRecordingTable({
                data,
                columns,
                pageSize: 2,
                page: 2,
            });

            expect(getFirstColumn(root)).toEqual(['Bob', 'Dee']);
            expect(getCurrentPage(root)).toBe(2);
            expect(events).toEqual([]);
        });

        it('follows the `page` prop', async () => {
            const { root, events, waitForChanges, setProps } =
                await renderRecordingTable({ data, columns, pageSize: 2 });

            setProps({ page: 2 });
            await waitForChanges();

            expect(getFirstColumn(root)).toEqual(['Bob', 'Dee']);
            expect(events).toEqual(['changePage: 2']);
        });

        it('shows the first page when `page` is set to nothing', async () => {
            const { root, events, waitForChanges, setProps } =
                await renderRecordingTable({
                    data,
                    columns,
                    pageSize: 2,
                    page: 2,
                });

            setProps({ page: undefined });
            await waitForChanges();

            expect(getRows(root)).toHaveLength(2);
            expect(getCurrentPage(root)).toBe(1);
            expect(events).toEqual(['changePage: 1']);
        });

        it('shows the last page, and says so, when the `page` prop does not exist', async () => {
            const { root, events, waitForChanges, setProps } =
                await renderRecordingTable({ data, columns, pageSize: 2 });

            setProps({ page: 9 });
            await waitForChanges();

            expect(events).toEqual(['changePage: 3']);
            expect(getFirstColumn(root)).toEqual(['Eve']);
        });

        it('shows the last page, and says so, when it is created with a page that does not exist', async () => {
            const { root, events } = await renderRecordingTable({
                data,
                columns,
                pageSize: 2,
                page: 9,
            });

            expect(getFirstColumn(root)).toEqual(['Eve']);
            expect(events).toEqual(['changePage: 3']);
        });

        it('moves to the last page, and says so, when the rows no longer fill the current one', async () => {
            const { root, events, waitForChanges, setProps } =
                await renderRecordingTable({
                    data,
                    columns,
                    pageSize: 2,
                    page: 3,
                });

            setProps({ data: data.slice(0, 3) });
            await waitForChanges();

            expect(getFirstColumn(root)).toEqual(['Bob']);
            expect(events).toEqual(['changePage: 2']);
        });

        it('stays on the page when the rows are sorted, and only emits `sort`', async () => {
            const { root, events, waitForChanges } = await renderRecordingTable(
                {
                    data,
                    columns,
                    pageSize: 2,
                    page: 2,
                }
            );

            clickHeader(root, 0);
            await waitForChanges();

            expect(getFirstColumn(root)).toEqual(['Cid', 'Bob']);
            expect(getCurrentPage(root)).toBe(2);
            expect(events).toEqual(['sort: name DESC']);
        });

        it('activates and selects the right rows on a later page', async () => {
            const { root, events, waitForChanges } = await renderRecordingTable(
                { data, columns, pageSize: 2, selectable: true }
            );
            clickPage(root, 2);
            await waitForChanges();
            events.length = 0;

            clickCell(root, 0);
            clickCheckbox(root, 1);
            await waitForChanges();

            expect(events).toEqual(['activate: 3', 'select: 4']);
        });

        it('stays on the page it moved to when the rows come back', async () => {
            const { root, events, waitForChanges, setProps } =
                await renderRecordingTable({
                    data,
                    columns,
                    pageSize: 2,
                    page: 3,
                });

            setProps({ data: data.slice(0, 3) });
            await waitForChanges();
            setProps({ data: data });
            await waitForChanges();

            expect(getFirstColumn(root)).toEqual(['Bob', 'Dee']);
            expect(events).toEqual(['changePage: 2']);
        });

        it('shows all rows and warns when `pageSize` is not a whole number above 0', async () => {
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
            const { root } = await renderTable({
                data,
                columns,
                pageSize: 1.5,
            });

            expect(getRows(root)).toHaveLength(5);
            expect(getPagination(root)).toBeNull();
            expect(warn).toHaveBeenCalledTimes(1);
            expect(warn.mock.calls[0][0]).toContain('`pageSize`');
        });
    });

    describe('remote mode', () => {
        const remote = () => ({
            mode: 'remote',
            columns,
            data: data.slice(0, 2),
            pageSize: 2,
            totalRows: 5,
        });

        it('asks for the first page when it is created', async () => {
            const { events } = await renderRecordingTable(remote());

            expect(events).toEqual(['load: page 1, ']);
        });

        it('asks for the page and sorting it was created with', async () => {
            const { root, events } = await renderRecordingTable({
                ...remote(),
                page: 2,
                sorting: [{ column: columns[1], direction: 'ASC' }],
            });

            expect(events).toEqual(['load: page 2, age ASC']);
            expect(getSortDirection(root, 1)).toBe('ascending');
        });

        it('asks for data, and shows all rows it gets without a pagination, when it has no `pageSize`', async () => {
            const { root, events } = await renderRecordingTable({
                ...remote(),
                data: data,
                pageSize: undefined,
            });

            expect(events).toEqual(['load: page 1, ']);
            expect(getRows(root)).toHaveLength(5);
            expect(getPagination(root)).toBeNull();
        });

        it('asks once for another page after sorting', async () => {
            const { root, events, waitForChanges } =
                await renderRecordingTable(remote());
            clickHeader(root, 0);
            await waitForChanges();
            events.length = 0;

            clickPage(root, 2);
            await waitForChanges();

            expect(events).toEqual([
                'changePage: 2',
                'load: page 2, name DESC',
            ]);
        });

        it('shows the rows in the order they are given, without sorting them', async () => {
            const serverSortedData = [1, 2, 10, 11, 20].map((order) => ({
                id: order,
                order: order,
            }));
            const { root, waitForChanges, setProps } = await renderTable({
                mode: 'remote',
                data: [...serverSortedData].reverse(),
                columns: [{ field: 'order', title: 'Order' }],
            });
            root.addEventListener('load', (event: CustomEvent) => {
                if (event.detail.sorters.length > 0) {
                    setProps({ data: serverSortedData });
                }
            });

            clickHeader(root, 0);
            await waitForChanges();

            expect(getFirstColumn(root)).toEqual(['1', '2', '10', '11', '20']);
            expect(getSortDirection(root, 0)).toBe('descending');
        });

        it('asks once for sorted data when a header is clicked on the first page', async () => {
            const { root, events, waitForChanges } =
                await renderRecordingTable(remote());
            events.length = 0;

            clickHeader(root, 0);
            await waitForChanges();

            expect(events).toEqual(['load: page 1, name DESC']);
        });

        it('goes back to the first page when a header is clicked, and asks once for sorted data', async () => {
            const { root, events, waitForChanges } = await renderRecordingTable(
                { ...remote(), page: 2 }
            );
            events.length = 0;

            clickHeader(root, 0);
            await waitForChanges();

            expect(events).toEqual([
                'changePage: 1',
                'load: page 1, name DESC',
            ]);
        });

        it('asks for a page when it is picked in the pagination', async () => {
            const { root, events, waitForChanges } =
                await renderRecordingTable(remote());
            events.length = 0;

            clickPage(root, 2);
            await waitForChanges();

            expect(events).toEqual(['changePage: 2', 'load: page 2, ']);
            expect(getCurrentPage(root)).toBe(2);
        });

        it('asks for a page when the `page` prop changes', async () => {
            const { events, waitForChanges, setProps } =
                await renderRecordingTable(remote());
            events.length = 0;

            setProps({ page: 3 });
            await waitForChanges();

            expect(events).toEqual(['load: page 3, ']);
        });

        it('asks once for the first page when the `sorting` prop changes', async () => {
            const { events, waitForChanges, setProps } =
                await renderRecordingTable({ ...remote(), page: 2 });
            events.length = 0;

            setProps({ sorting: [{ column: columns[0], direction: 'DESC' }] });
            await waitForChanges();

            expect(events).toEqual([
                'changePage: 1',
                'load: page 1, name DESC',
            ]);
        });

        it('does not ask again when the `sorting` prop repeats what a click already asked for', async () => {
            const { root, events, waitForChanges, setProps } =
                await renderRecordingTable(remote());
            clickHeader(root, 0);
            await waitForChanges();
            events.length = 0;

            setProps({ sorting: [{ column: columns[0], direction: 'DESC' }] });
            await waitForChanges();

            expect(events).toEqual([]);
        });

        it('does not ask again when the sorted column is removed', async () => {
            const { root, events, waitForChanges, setProps } =
                await renderRecordingTable(remote());
            clickHeader(root, 0);
            await waitForChanges();
            events.length = 0;

            setProps({ columns: [columns[1]] });
            await waitForChanges();

            expect(events).toEqual([]);
        });

        it('asks for the rows again when `sorting` is emptied', async () => {
            const { events, waitForChanges, setProps } =
                await renderRecordingTable({
                    ...remote(),
                    sorting: [{ column: columns[0], direction: 'ASC' }],
                });
            events.length = 0;

            setProps({ sorting: [] });
            await waitForChanges();

            expect(events).toEqual(['load: page 1, ']);
        });

        it('emits nothing when it is given new data', async () => {
            const { root, events, waitForChanges, setProps } =
                await renderRecordingTable(remote());
            events.length = 0;

            setProps({ data: data.slice(2, 4) });
            await waitForChanges();

            expect(events).toEqual([]);
            expect(getFirstColumn(root)).toEqual(['Bob', 'Dee']);
        });

        it('stays on the page, and emits nothing, when `totalRows` changes', async () => {
            const { root, events, waitForChanges, setProps } =
                await renderRecordingTable({ ...remote(), page: 2 });
            events.length = 0;

            setProps({ totalRows: 50 });
            await waitForChanges();

            expect(events).toEqual([]);
            expect(getCurrentPage(root)).toBe(2);
        });

        it('shows as many pages as `totalRows` and `pageSize` give', async () => {
            const { root } = await renderTable({ ...remote(), totalRows: 7 });

            expect(getPageCount(root)).toBe(4);
        });

        it('takes a full page as a sign of more pages when `totalRows` is 0', async () => {
            const { root } = await renderTable({ ...remote(), totalRows: 0 });

            expect(getPageCount(root)).toBe(1);
            expect(root.classList.contains('has-pagination')).toBe(true);
        });

        it('takes a full page as a sign of more pages when `totalRows` is missing', async () => {
            const { root } = await renderTable({
                ...remote(),
                totalRows: undefined,
            });

            expect(getPageCount(root)).toBe(1);
            expect(root.classList.contains('has-pagination')).toBe(true);
        });

        it('shows a spinner and no empty message while loading', async () => {
            const { root, waitForChanges, setProps } = await renderTable({
                ...remote(),
                data: [],
                emptyMessage: 'Nothing here',
                loading: true,
            });

            expect(isLoading(root)).toBe(true);
            expect(getEmptyMessage(root)).toBeNull();

            setProps({ loading: false });
            await waitForChanges();

            expect(isLoading(root)).toBe(false);
            expect(getEmptyMessage(root)).toBe('Nothing here');
        });

        it('scrolls back to the first row when a header is clicked', async () => {
            const manyRows = Array.from({ length: 60 }, (_, index) => ({
                id: index,
                name: `Row ${index}`,
                age: index,
            }));
            const { root, waitForChanges } = await renderTable({
                ...remote(),
                data: manyRows,
                pageSize: 60,
                totalRows: 200,
            });
            const scrollContainer = getScrollContainer(root);
            scrollContainer.scrollTop = 500;

            clickHeader(root, 0);
            await waitForChanges();

            expect(scrollContainer.scrollTop).toBe(0);
        });

        it('keeps a sorter that has no column, and asks for it with the next page', async () => {
            const { root, events, waitForChanges, setProps } =
                await renderRecordingTable({
                    ...remote(),
                    sorting: [
                        {
                            column: { field: 'city', title: 'City' },
                            direction: 'ASC',
                        },
                    ],
                });
            events.length = 0;

            setProps({ columns: [{ ...columns[1] }, { ...columns[0] }] });
            await waitForChanges();
            expect(events).toEqual([]);

            clickPage(root, 2);
            await waitForChanges();
            expect(events).toEqual(['changePage: 2', 'load: page 2, city ASC']);
        });

        it('counts the number of rows as unknown and warns when `totalRows` is not a whole number', async () => {
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
            const { root } = await renderTable({ ...remote(), totalRows: -1 });

            expect(getShownPagination(root).totalItems).toBeNull();
            expect(warn).toHaveBeenCalledTimes(1);
            expect(warn.mock.calls[0][0]).toContain('`totalRows`');
        });

        it('leaves a page that no longer exists when `totalRows` shrinks', async () => {
            const { events, waitForChanges, setProps } =
                await renderRecordingTable({ ...remote(), page: 3 });
            events.length = 0;

            setProps({ totalRows: 2 });
            await waitForChanges();

            expect(events).toEqual(['changePage: 1', 'load: page 1, ']);
        });

        it('waits until loading is over before it leaves a page that no longer exists', async () => {
            const { events, waitForChanges, setProps } =
                await renderRecordingTable({ ...remote(), page: 3 });
            events.length = 0;

            setProps({ loading: true, totalRows: 2 });
            await waitForChanges();
            expect(events).toEqual([]);

            setProps({ loading: false });
            await waitForChanges();
            expect(events).toEqual(['changePage: 1', 'load: page 1, ']);
        });

        it('stays on its page while `totalRows` is 0, which counts as not known yet', async () => {
            const { events, waitForChanges, setProps } =
                await renderRecordingTable({ ...remote(), page: 3 });
            events.length = 0;

            setProps({ loading: true, data: [], totalRows: 0 });
            await waitForChanges();
            expect(events).toEqual([]);

            setProps({ loading: false, data: data.slice(4), totalRows: 5 });
            await waitForChanges();
            expect(events).toEqual([]);
        });
    });

    describe('row selection', () => {
        const selectable = () => ({ data, columns, selectable: true });

        it('adds a checkbox to each row, and one to select all', async () => {
            const { root } = await renderTable(selectable());

            expect(getSelectAll(root)).not.toBeNull();
            expect(getCheckedRows(root)).toEqual([
                false,
                false,
                false,
                false,
                false,
            ]);
            expect(getHeaderTitles(root)).toEqual(['Name', 'Age']);
        });

        it('labels the checkboxes in the `language` it is given', async () => {
            const { root } = await renderTable({
                ...selectable(),
                language: 'sv',
            });

            expect(getSelectAllState(root).label).toBe('Markera alla rader');
            expect(getRowCheckboxLabel(root, 0)).toBe('Markera denna rad');
        });

        it('selects a row when its checkbox is clicked, without activating it', async () => {
            const { root, events, waitForChanges } =
                await renderRecordingTable(selectable());

            clickCheckbox(root, 0);
            await waitForChanges();

            expect(events).toEqual(['select: 1']);
            expect(getCheckedRows(root)[0]).toBe(true);
            expect(getActiveRows(root)).toEqual([]);
        });

        it('emits the selected rows themselves', async () => {
            const select = vi.fn();
            const { root, waitForChanges } = await renderTable({
                ...selectable(),
                onSelect: select,
            });

            clickCheckbox(root, 1);
            await waitForChanges();

            expect(select.mock.calls[0][0].detail[0]).toBe(data[1]);
        });

        it('selects a row whose id is 0', async () => {
            const { root, events, waitForChanges } = await renderRecordingTable(
                { ...selectable(), data: [{ id: 0, name: 'Zed' }, ...data] }
            );

            clickCheckbox(root, 0);
            await waitForChanges();

            expect(events).toEqual(['select: 0']);
            expect(getCheckedRows(root)[0]).toBe(true);
        });

        it('selects a range on a shift-click', async () => {
            const { root, events, waitForChanges } =
                await renderRecordingTable(selectable());

            clickCheckbox(root, 0);
            clickCheckbox(root, 3, { shiftKey: true });
            clickCheckbox(root, 1);
            await waitForChanges();

            expect(events).toEqual([
                'select: 1',
                'select: 1, 2, 3, 4',
                'select: 1, 3, 4',
            ]);
        });

        it('selects a range of the rows as they are sorted', async () => {
            const { root, events, waitForChanges } =
                await renderRecordingTable(selectable());
            clickHeader(root, 0);
            await waitForChanges();
            events.length = 0;

            clickCheckbox(root, 0);
            clickCheckbox(root, 2, { shiftKey: true });
            await waitForChanges();

            expect(getFirstColumn(root).slice(0, 3)).toEqual([
                'Eve',
                'Dee',
                'Cid',
            ]);
            expect(events).toEqual(['select: 5', 'select: 5, 4, 1']);
        });

        it('selects all rows, and clears the selection, from the header', async () => {
            const { root, events, waitForChanges } =
                await renderRecordingTable(selectable());

            clickSelectAll(root);
            await waitForChanges();

            expect(getCheckedRows(root)).toEqual([
                true,
                true,
                true,
                true,
                true,
            ]);
            expect(isSelectAllShownChecked(root)).toBe(true);

            clickSelectAll(root);
            await waitForChanges();

            expect(getCheckedRows(root)).toEqual([
                false,
                false,
                false,
                false,
                false,
            ]);
            expect(events).toEqual([
                'select: 1, 2, 3, 4, 5',
                'selectAll: true',
                'select: ',
                'selectAll: false',
            ]);
        });

        it('selects the rows of all pages from the header', async () => {
            const { root, events, waitForChanges } = await renderRecordingTable(
                { ...selectable(), pageSize: 2 }
            );

            clickSelectAll(root);
            await waitForChanges();

            expect(events).toEqual([
                'select: 1, 2, 3, 4, 5',
                'selectAll: true',
            ]);
        });

        it('shows the selection it is created with, and emits nothing', async () => {
            const { root, events } = await renderRecordingTable({
                ...selectable(),
                selection: [data[1], data[3]],
            });

            expect(getCheckedRows(root)).toEqual([
                false,
                true,
                false,
                true,
                false,
            ]);
            expect(getSelectAllState(root)).toMatchObject({
                checked: true,
                indeterminate: true,
            });
            expect(events).toEqual([]);
        });

        it('shows the selection given as `selection`, and emits nothing', async () => {
            const { root, events, setProps, waitForChanges } =
                await renderRecordingTable(selectable());

            setProps({ selection: [data[4]] });
            await waitForChanges();

            expect(getCheckedRows(root)).toEqual([
                false,
                false,
                false,
                false,
                true,
            ]);
            expect(events).toEqual([]);
        });

        it('finds the selected rows by their id when the row objects are new', async () => {
            const { root, setProps, waitForChanges } = await renderTable({
                ...selectable(),
                selection: [{ ...data[4] }],
                activeRow: { id: 2 },
            });

            setProps({ data: data.map((row) => ({ ...row })) });
            await waitForChanges();

            expect(getCheckedRows(root)[4]).toBe(true);
            expect(getActiveRows(root)).toEqual([1]);
        });

        it('keeps the selection when the same rows come in another order', async () => {
            const { root, events, waitForChanges, setProps } =
                await renderRecordingTable({
                    ...selectable(),
                    selection: [data[1]],
                });
            clickCheckbox(root, 0);
            await waitForChanges();

            setProps({ data: [...data].reverse() });
            await waitForChanges();

            expect(getCheckedRows(root)).toEqual([
                false,
                false,
                false,
                true,
                true,
            ]);
            expect(events).toEqual(['select: 2, 1']);
        });

        it('clears the selection when the rows are replaced and the consumer gives none', async () => {
            const { root, setProps, waitForChanges } =
                await renderTable(selectable());
            clickCheckbox(root, 0);
            clickCheckbox(root, 1);
            await waitForChanges();

            setProps({
                data: [
                    { id: 10, name: 'New' },
                    { id: 11, name: 'Rows' },
                ],
            });
            await waitForChanges();

            expect(root.classList.contains('has-selection')).toBe(false);
            expect(getSelectAllState(root).checked).toBe(false);
            expect(getCheckedRows(root)).toEqual([false, false]);
        });

        it('marks the host with `has-selection` while rows are selected', async () => {
            const { root, setProps, waitForChanges } =
                await renderTable(selectable());
            expect(root.classList.contains('has-selection')).toBe(false);

            setProps({ selection: [data[0]] });
            await waitForChanges();
            expect(root.classList.contains('has-selection')).toBe(true);

            setProps({ selection: [] });
            await waitForChanges();
            expect(root.classList.contains('has-selection')).toBe(false);
        });

        it('disables the "select all" checkbox when there are no rows', async () => {
            const { root } = await renderTable({ ...selectable(), data: [] });

            expect(getSelectAllState(root).disabled).toBe(true);
        });

        it('shows the selection that a `select` listener sets while "select all" is clicked', async () => {
            const { root, waitForChanges } = await renderTable({
                ...selectable(),
                selection: [],
                onSelect: (event: CustomEvent) => {
                    (event.target as HTMLLimelTableElement).selection = [];
                },
            });

            clickSelectAll(root);
            await waitForChanges();

            expect(getCheckedRows(root)).toEqual([
                false,
                false,
                false,
                false,
                false,
            ]);
        });

        it('starts a new range after sorting, where the rows have new places', async () => {
            const { root, events, waitForChanges } =
                await renderRecordingTable(selectable());
            clickCheckbox(root, 0);
            clickHeader(root, 0);
            await waitForChanges();
            events.length = 0;

            clickCheckbox(root, 3, { shiftKey: true });
            await waitForChanges();

            expect(getFirstColumn(root)[3]).toBe('Bob');
            expect(events).toEqual(['select: 1, 3']);
        });

        it('starts a new range after `data` gives the same rows in another order', async () => {
            const { root, events, waitForChanges, setProps } =
                await renderRecordingTable(selectable());
            clickCheckbox(root, 0);
            setProps({ data: [...data].reverse() });
            await waitForChanges();
            events.length = 0;

            clickCheckbox(root, 3, { shiftKey: true });
            await waitForChanges();

            expect(events).toEqual(['select: 1, 2']);
        });

        it('starts a new range after new `data` moves a row in a sorted table', async () => {
            const { root, events, waitForChanges, setProps } =
                await renderRecordingTable(selectable());
            clickHeader(root, 0);
            await waitForChanges();
            const namesBefore = getFirstColumn(root);
            clickCheckbox(root, 0);
            await waitForChanges();
            const firstRow = data.find((row) => row.name === namesBefore[0]);
            setProps({
                data: data.map((row) =>
                    row === firstRow ? { ...row, name: 'Aaa' } : row
                ),
            });
            await waitForChanges();
            events.length = 0;

            expect(getFirstColumn(root)[0]).not.toBe('Aaa');
            clickCheckbox(root, 2, { shiftKey: true });
            await waitForChanges();

            expect(events).toHaveLength(1);
            expect(events[0].split(', ')).toHaveLength(2);
        });

        it('keeps a selected row that is not among the rows it shows', async () => {
            const { root, events, waitForChanges } = await renderRecordingTable(
                {
                    ...selectable(),
                    mode: 'remote',
                    selection: [{ id: 99, name: 'Zoe', age: 1 }],
                }
            );
            events.length = 0;

            clickCheckbox(root, 0);
            await waitForChanges();

            expect(events).toEqual(['select: 99, 1']);
        });

        it('shows the "select all" checkbox as partly ticked while a row it shows is not selected', async () => {
            const { root } = await renderTable({
                ...selectable(),
                mode: 'remote',
                data: data.slice(0, 2),
                selection: [
                    { id: 98, name: 'Yan' },
                    { id: 99, name: 'Zoe' },
                ],
            });

            expect(getSelectAllState(root)).toMatchObject({
                checked: true,
                indeterminate: true,
            });
        });

        it('shows the checkboxes in full when the table has a selection', async () => {
            const { root, setProps, waitForChanges } =
                await renderTable(selectable());

            setProps({ selection: [data[1]] });
            await waitForChanges();
            await waitForTransitions(root);

            expect(getComputedStyle(getRowCheckbox(root, 0)).opacity).toBe('1');
        });

        it('lines up the "select all" checkbox with the checkboxes in the rows', async () => {
            const { root } = await renderTable(selectable());

            expect(getSelectAll(root).getBoundingClientRect().left).toBe(
                getRowCheckbox(root, 0).getBoundingClientRect().left
            );
        });

        it('paints the checkbox cell in the colour of its row, also when the row is active', async () => {
            const { root } = await renderTable({
                ...selectable(),
                class: 'has-interactive-rows',
                activeRow: { id: 2 },
                style: {
                    '--contrast-100': '250, 250, 250',
                    '--contrast-200': '240, 240, 240',
                    '--mdc-theme-primary': 'rgb(0, 128, 128)',
                },
            });
            await waitForTransitions(root);
            const getColours = (rowIndex: number) => ({
                row: getRowBackground(getRow(root, rowIndex)),
                cell: getComputedStyle(
                    getCheckboxCell(root, rowIndex),
                    '::before'
                ).backgroundColor,
            });
            const plain = getColours(0);
            const active = getColours(1);

            expect(plain.cell).toBe(plain.row);
            expect(active.cell).toBe(active.row);
            expect(active.row).not.toBe(plain.row);
        });

        it('lets the shadows of an active row show at the edges of the checkbox cell', async () => {
            const { root } = await renderTable({
                ...selectable(),
                class: 'has-interactive-rows',
                activeRow: { id: 2 },
            });
            const layer = getComputedStyle(
                getCheckboxCell(root, 1),
                '::before'
            );

            expect(layer.maskImage.match(/linear-gradient/g)).toHaveLength(2);
            expect(layer.maskComposite).toContain('intersect');
            expect(layer.boxShadow).not.toContain('rgba(0, 0, 0');
        });
    });

    describe('active row', () => {
        it('activates a row when it is clicked, and deactivates it on the next click', async () => {
            const { root, events, waitForChanges } = await renderRecordingTable(
                { data, columns }
            );

            clickCell(root, 1);
            await waitForChanges();

            expect(events).toEqual(['activate: 2']);
            expect(getActiveRows(root)).toEqual([1]);

            clickCell(root, 1);
            await waitForChanges();

            expect(events).toEqual(['activate: 2', 'activate: null']);
            expect(getActiveRows(root)).toEqual([]);
        });

        it('activates another row when it is clicked', async () => {
            const { root, events, waitForChanges } = await renderRecordingTable(
                { data, columns }
            );

            clickCell(root, 1);
            clickCell(root, 3, 1);
            await waitForChanges();

            expect(events).toEqual(['activate: 2', 'activate: 4']);
            expect(getActiveRows(root)).toEqual([3]);
        });

        it('emits the row itself', async () => {
            const activate = vi.fn();
            const { root, waitForChanges } = await renderTable({
                data,
                columns,
                onActivate: activate,
            });

            clickCell(root, 2);
            await waitForChanges();

            expect(activate.mock.calls[0][0].detail).toBe(data[2]);
        });

        it('marks the row given as `activeRow`, by its id', async () => {
            const { root, events, waitForChanges, setProps } =
                await renderRecordingTable({
                    data,
                    columns,
                    activeRow: { id: 3 },
                });

            expect(getActiveRows(root)).toEqual([2]);

            setProps({ activeRow: data[0] });
            await waitForChanges();

            expect(getActiveRows(root)).toEqual([0]);
            expect(events).toEqual([]);
        });

        it('activates the right row after sorting', async () => {
            const { root, events, waitForChanges } = await renderRecordingTable(
                { data, columns }
            );
            clickHeader(root, 0);
            await waitForChanges();
            events.length = 0;

            clickCell(root, 0);
            await waitForChanges();

            expect(events).toEqual(['activate: 5']);
        });

        it('activates a row when a component inside a cell is clicked', async () => {
            const { root, events, waitForChanges } = await renderRecordingTable(
                {
                    data,
                    columns: [{ ...columns[0], component: { name: 'button' } }],
                }
            );

            click(getCellComponent(root, 0, 0, 'button'));
            await waitForChanges();

            expect(events).toEqual(['activate: 1']);
        });

        it('does not activate a row when a click inside a cell was cancelled', async () => {
            const { root, events, waitForChanges } = await renderRecordingTable(
                {
                    data,
                    columns: [
                        {
                            ...columns[0],
                            component: {
                                name: 'a',
                                props: {
                                    onClick: (event: Event) =>
                                        event.preventDefault(),
                                },
                            },
                        },
                    ],
                }
            );

            click(getCellComponent(root, 0, 0, 'a'));
            await waitForChanges();

            expect(events).toEqual([]);
        });

        it('does not activate a row when its checkbox is clicked', async () => {
            const { root, events, waitForChanges } = await renderRecordingTable(
                { data, columns, selectable: true }
            );

            clickCheckbox(root, 2);
            await waitForChanges();

            expect(events).toEqual(['select: 3']);
        });
    });

    describe('keyboard', () => {
        const press = (element: HTMLElement, key: string) => {
            element.dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: key,
                    bubbles: true,
                    cancelable: true,
                })
            );
        };
        const getRowsInTabOrder = (root: HTMLElement) =>
            getRows(root)
                .map((row, index) => (row.tabIndex === 0 ? index : -1))
                .filter((index) => index !== -1);

        it('has one row in the tab order, the first one', async () => {
            const { root } = await renderTable({ data, columns });

            expect(getRowsInTabOrder(root)).toEqual([0]);
        });

        it('has the active row in the tab order', async () => {
            const { root } = await renderTable({
                data,
                columns,
                activeRow: { id: 3 },
            });

            expect(getRowsInTabOrder(root)).toEqual([2]);
        });

        it('moves the focus between rows with the arrow keys', async () => {
            const { root, waitForChanges } = await renderTable({
                data,
                columns,
            });
            getRow(root, 0).focus();

            press(getRow(root, 0), 'ArrowDown');
            await waitForChanges();

            expect(root.shadowRoot.activeElement).toBe(getRow(root, 1));
            expect(getRowsInTabOrder(root)).toEqual([1]);

            press(getRow(root, 1), 'ArrowUp');
            await waitForChanges();

            expect(root.shadowRoot.activeElement).toBe(getRow(root, 0));
        });

        it('keeps the focused row in the tab order when the table is drawn again', async () => {
            const { root, waitForChanges, setProps } = await renderTable({
                data,
                columns,
            });
            getRow(root, 2).focus();

            setProps({ data: [...data] });
            await waitForChanges();

            expect(getRowsInTabOrder(root)).toEqual([2]);
        });

        it('puts another row in the tab order when the focused row is removed', async () => {
            const { root, waitForChanges, setProps } = await renderTable({
                data,
                columns,
            });
            getRow(root, 2).focus();

            setProps({ data: data.filter((row) => row.id !== 3) });
            await waitForChanges();

            expect(getRowsInTabOrder(root)).toEqual([0]);
        });

        it('activates the focused row with Enter, and with Space', async () => {
            const { root, events, waitForChanges } = await renderRecordingTable(
                { data, columns }
            );

            press(getRow(root, 1), 'Enter');
            await waitForChanges();
            press(getRow(root, 2), ' ');
            await waitForChanges();

            expect(events).toEqual(['activate: 2', 'activate: 3']);
        });

        it('activates the right row with Enter on a later page', async () => {
            const { root, events, waitForChanges } = await renderRecordingTable(
                { data, columns, pageSize: 2 }
            );
            clickPage(root, 2);
            await waitForChanges();
            events.length = 0;

            getRow(root, 1).focus();
            press(getRow(root, 1), 'Enter');
            await waitForChanges();

            expect(events).toEqual(['activate: 4']);
        });

        it('activates the right row with Enter after sorting', async () => {
            const { root, events, waitForChanges } = await renderRecordingTable(
                { data, columns }
            );
            clickHeader(root, 0);
            await waitForChanges();
            events.length = 0;

            getRow(root, 0).focus();
            press(getRow(root, 0), 'Enter');
            await waitForChanges();

            expect(events).toEqual(['activate: 5']);
        });

        it('leaves keys alone that are pressed inside a cell', async () => {
            const { root, events, waitForChanges } = await renderRecordingTable(
                { data, columns }
            );

            press(getCell(root, 1), 'Enter');
            await waitForChanges();

            expect(events).toEqual([]);
        });
    });

    describe('aggregates', () => {
        it('shows the values given as `aggregates`', async () => {
            const { root } = await renderTable({
                data,
                columns,
                aggregates: [{ field: 'age', value: 191 }],
            });

            expect(getAggregates(root)).toEqual(['', '191']);
            expect(root.classList.contains('has-aggregation')).toBe(true);
        });

        it('formats the values given as `aggregates` with the formatter of the column', async () => {
            const { root } = await renderTable({
                data,
                columns: [
                    columns[0],
                    {
                        ...columns[1],
                        formatter: (value: number) => `${value} years`,
                    },
                ],
                aggregates: [{ field: 'age', value: 191 }],
            });

            expect(getAggregates(root)).toEqual(['', '191 years']);
        });

        it('leaves the column object of a field that has a value in `aggregates` as it is', async () => {
            await renderTable({
                data,
                columns,
                aggregates: [{ field: 'age', value: 191 }],
            });

            expect(columns[1].aggregator).toBeUndefined();
            expect(columns[0].aggregator).toBeUndefined();
        });

        it('shows a new value when `aggregates` changes', async () => {
            const { root, setProps, waitForChanges } = await renderTable({
                data,
                columns,
                aggregates: [{ field: 'age', value: 191 }],
            });

            setProps({ aggregates: [{ field: 'age', value: 200 }] });
            await waitForChanges();

            expect(getAggregates(root)).toEqual(['', '200']);
        });

        it('adds the row when `aggregates` arrives later', async () => {
            const { root, setProps, waitForChanges } = await renderTable({
                data,
                columns,
            });

            setProps({ aggregates: [{ field: 'age', value: 191 }] });
            await waitForChanges();

            expect(root.classList.contains('has-aggregation')).toBe(true);
            expect(getAggregates(root)).toEqual(['', '191']);
        });

        it('shows no totals row without an aggregating column', async () => {
            const { root } = await renderTable({
                data,
                columns,
                aggregates: null,
            });

            expect(getRows(root)).toHaveLength(5);
            expect(getAggregates(root)).toEqual([]);
            expect(root.classList.contains('has-aggregation')).toBe(false);
        });

        describe('built-in aggregators', () => {
            const aggregate = async (aggregator: string, values: unknown[]) => {
                const { root } = await renderTable({
                    data: values.map((value, index) => ({
                        id: index + 1,
                        value: value,
                    })),
                    columns: [
                        {
                            field: 'value',
                            title: 'Value',
                            aggregator: aggregator,
                        },
                    ],
                });

                return getAggregates(root)[0];
            };
            const numbers = [30, 4, 120, 30, 7];
            const mixed = [10, null, 0, '', 5, 'n/a'];

            it('sums the values', async () => {
                expect(await aggregate('sum', numbers)).toBe('191');
                expect(await aggregate('sum', mixed)).toBe('15');
            });

            it('averages the numbers, leaving out empty cells and text, with at most two decimals', async () => {
                expect(await aggregate('avg', numbers)).toBe('38.2');
                expect(await aggregate('avg', [10, null, 0, '', 5])).toBe('5');
                expect(await aggregate('avg', mixed)).toBe('5');
                expect(await aggregate('avg', [1, 1, 2])).toBe('1.33');
            });

            it('finds the smallest value, leaving out empty cells', async () => {
                expect(await aggregate('min', numbers)).toBe('4');
                expect(await aggregate('min', [10, null, 5])).toBe('5');
            });

            it('finds the largest value, leaving out empty cells', async () => {
                expect(await aggregate('max', numbers)).toBe('120');
                expect(await aggregate('max', [-10, null, -5])).toBe('-5');
            });

            it('counts the values, leaving out empty cells', async () => {
                expect(await aggregate('count', numbers)).toBe('5');
                expect(await aggregate('count', [...mixed, false])).toBe('5');
            });

            it('works out the aggregates over all rows, not only the page it shows', async () => {
                const { root } = await renderTable({
                    data,
                    columns: [{ ...columns[1], aggregator: 'sum' }],
                    pageSize: 2,
                });

                expect(getAggregates(root)).toEqual(['191']);
            });
        });

        it('calls an aggregator function with the column, the values and the rows', async () => {
            const aggregator = vi.fn().mockReturnValue(191);
            const column = { ...columns[1], aggregator: aggregator };
            const { root } = await renderTable({ data, columns: [column] });

            expect(getAggregates(root)).toEqual(['191']);
            const [calledColumn, values, rows] = aggregator.mock.calls.at(-1);
            expect(calledColumn).toEqual(column);
            expect(values).toEqual([30, 4, 120, 30, 7]);
            expect(rows).toEqual(data);
        });

        it('works out an aggregate again when the data changes', async () => {
            const aggregator = vi.fn().mockReturnValue(191);
            const { root, waitForChanges, setProps } = await renderTable({
                data,
                columns: [{ ...columns[1], aggregator: aggregator }],
            });
            aggregator.mockClear();

            setProps({ data: data.slice(1) });
            await waitForChanges();

            expect(aggregator).toHaveBeenCalled();
            expect(aggregator.mock.calls.at(-1)[1]).toEqual([4, 120, 30, 7]);
            expect(getAggregates(root)).toEqual(['191']);
        });

        it('marks the host with `has-aggregation` when a column has an aggregator', async () => {
            const { root } = await renderTable({
                data,
                columns: [{ ...columns[1], aggregator: () => 191 }],
            });

            expect(root.classList.contains('has-aggregation')).toBe(true);
        });

        it('works out an aggregate once, until the data changes', async () => {
            const aggregator = vi.fn().mockReturnValue(191);
            const { root, waitForChanges, setProps } = await renderTable({
                data,
                columns: [{ ...columns[1], aggregator: aggregator }],
            });

            clickCell(root, 1);
            await waitForChanges();
            expect(aggregator).toHaveBeenCalledTimes(1);

            setProps({ data: [...data] });
            await waitForChanges();
            expect(aggregator).toHaveBeenCalledTimes(2);
        });

        it('leaves the cell empty and warns when an aggregate is an object', async () => {
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
            const { root } = await renderTable({
                data,
                columns: [{ ...columns[1], aggregator: () => ({ sum: 191 }) }],
            });

            expect(getAggregates(root)).toEqual(['']);
            expect(warn).toHaveBeenCalledTimes(1);
            expect(warn.mock.calls[0][0]).toContain('"age"');
        });

        it('draws the table without a totals row when `aggregates` is null', async () => {
            const { root } = await renderTable({
                data,
                columns,
                aggregates: null,
            });

            expect(getRows(root)).toHaveLength(5);
            expect(getAggregateRow(root)).toBeNull();
        });

        it('keeps the aggregates at the bottom of a table that is taller than its rows', async () => {
            const { root } = await renderTable({
                data,
                columns,
                aggregates: [{ field: 'age', value: 191 }],
            });
            const heights = getRows(root).map(
                (row) => row.getBoundingClientRect().height
            );

            expect(
                Math.round(getAggregateRow(root).getBoundingClientRect().bottom)
            ).toBe(
                Math.round(
                    getScrollContainer(root).getBoundingClientRect().bottom
                )
            );
            expect(new Set(heights).size).toBe(1);
        });

        it('keeps the cell below the checkboxes above the aggregates when the table scrolls sideways', async () => {
            const { root } = await renderTable({
                data,
                columns,
                selectable: true,
                aggregates: [{ field: 'age', value: 191 }],
            });
            const [belowCheckboxes, firstAggregate] =
                getAggregateRow(root).children;
            const getZIndex = (cell: Element) =>
                Number(getComputedStyle(cell).zIndex);

            expect(getZIndex(belowCheckboxes)).toBeGreaterThan(
                getZIndex(firstAggregate)
            );
        });
    });

    describe('moving columns', () => {
        it('moves a column that is dragged, and emits the new order', async () => {
            const changeColumns = vi.fn();
            const { root, events, waitForChanges } = await renderRecordingTable(
                {
                    data,
                    columns,
                    movableColumns: true,
                    onChangeColumns: changeColumns,
                }
            );

            await dragHeader(root, 0, 1);
            await waitForChanges();

            expect(events).toEqual([]);
            expect(changeColumns).toHaveBeenCalledTimes(1);
            expect(changeColumns.mock.calls[0][0].detail).toEqual([
                columns[1],
                columns[0],
            ]);
            expect(getHeaderTitles(root)).toEqual(['Age', 'Name']);
            expect(getFirstColumn(root)[0]).toBe('30');
        });

        it('does not sort the column that was dragged', async () => {
            const { root, events, waitForChanges } = await renderRecordingTable(
                { data, columns, movableColumns: true }
            );

            await dragHeader(root, 0, 1);
            await waitForChanges();

            expect(events).toEqual(['changeColumns: Age, Name']);
            expect(getSortDirection(root, 1)).toBe('none');
        });

        it('sorts a movable column when its header is pressed and released almost in place', async () => {
            const { root, events, waitForChanges } = await renderRecordingTable(
                { data, columns, movableColumns: true }
            );
            const start = centerOf(getHeader(root, 0));

            await drag(getHeader(root, 0), { x: start.x + 2, y: start.y });
            await waitForChanges();

            expect(events).toEqual(['sort: name DESC']);
            expect(getSortDirection(root, 0)).toBe('descending');
        });

        it('does not sort a column when a drag ends on the header it started on', async () => {
            const { root, events, waitForChanges } = await renderRecordingTable(
                { data, columns, movableColumns: true }
            );
            const start = centerOf(getHeader(root, 0));

            await drag(getHeader(root, 0), { x: start.x + 10, y: start.y });
            await waitForChanges();

            expect(events.filter((event) => event.startsWith('sort'))).toEqual(
                []
            );
        });

        it('keeps a dragged order when the same columns are given again', async () => {
            const { root, setProps, waitForChanges } = await renderTable({
                data,
                columns,
                movableColumns: true,
            });
            await dragHeader(root, 0, 1);
            await waitForChanges();

            setProps({ columns: [...columns] });
            await waitForChanges();

            expect(getHeaderTitles(root)).toEqual(['Age', 'Name']);
        });

        it('shows the order of a new `columns` value after a drag', async () => {
            const { root, setProps, waitForChanges } = await renderTable({
                data,
                columns,
                movableColumns: true,
            });
            await dragHeader(root, 0, 1);
            await waitForChanges();

            setProps({ columns: [...columns, { field: 'id', title: 'Id' }] });
            await waitForChanges();

            expect(getHeaderTitles(root)).toEqual(['Name', 'Age', 'Id']);
        });

        it('does not move columns unless `movableColumns` is set', async () => {
            const { root, events, waitForChanges } = await renderRecordingTable(
                { data, columns }
            );

            await dragHeader(root, 0, 1);
            await waitForChanges();

            expect(
                events.filter((event) => event.startsWith('change'))
            ).toEqual([]);
            expect(getHeaderTitles(root)).toEqual(['Name', 'Age']);
        });

        it('ignores another pointer while a column is dragged', async () => {
            const { root, events, waitForChanges } = await renderRecordingTable(
                { data, columns, movableColumns: true }
            );
            const target = getHeader(root, 1).getBoundingClientRect();
            const pointer = (type: string, pointerId: number, x: number) =>
                new PointerEvent(type, {
                    bubbles: true,
                    button: 0,
                    pointerId: pointerId,
                    clientX: x,
                    clientY: target.top + 2,
                });

            getHeader(root, 0).dispatchEvent(
                pointer('pointerdown', 1, target.left - 20)
            );
            globalThis.dispatchEvent(pointer('pointermove', 2, target.right));
            globalThis.dispatchEvent(pointer('pointerup', 2, target.right));
            await waitForChanges();

            expect(events).toEqual([]);

            globalThis.dispatchEvent(pointer('pointerup', 1, target.left));
        });
    });

    describe('resizing columns', () => {
        const resize = async (root: HTMLElement, index: number, by: number) => {
            const handle = getResizeHandle(root, index);
            const start = centerOf(handle);

            await drag(handle, { x: start.x + by, y: start.y });
        };
        const getWidth = (root: HTMLElement, index: number) =>
            Math.round(getHeader(root, index).getBoundingClientRect().width);

        it('gives a column the width it is dragged to', async () => {
            const { root, waitForChanges } = await renderTable({
                data,
                columns,
            });
            const widthBefore = getWidth(root, 0);

            await resize(root, 0, 80);
            await waitForChanges();

            expect(getWidth(root, 0) - widthBefore).toBeCloseTo(80, -1);
            expect(
                Math.round(getCell(root, 0).getBoundingClientRect().width)
            ).toBe(getWidth(root, 0));
        });

        it('does not sort a column that is resized', async () => {
            const { root, events, waitForChanges } = await renderRecordingTable(
                { data, columns }
            );

            await resize(root, 0, 80);
            await waitForChanges();

            expect(events).toEqual([]);
        });

        it('keeps the width of a resized column when the rows are sorted and paged', async () => {
            const { root, waitForChanges } = await renderTable({
                data,
                columns,
                pageSize: 2,
            });
            await resize(root, 0, 80);
            await waitForChanges();
            const resized = getWidth(root, 0);

            clickHeader(root, 1);
            await waitForChanges();
            expect(getWidth(root, 0)).toBe(resized);

            clickPage(root, 2);
            await waitForChanges();
            expect(getWidth(root, 0)).toBe(resized);
        });

        it('keeps the width of a resized column when the data changes', async () => {
            const { root, waitForChanges, setProps } = await renderTable({
                data,
                columns,
            });
            await resize(root, 0, 80);
            await waitForChanges();
            const resized = getWidth(root, 0);

            setProps({ data: [...data].reverse() });
            await waitForChanges();

            expect(getWidth(root, 0)).toBe(resized);
        });

        it('ignores another pointer while a column is resized', async () => {
            const { root, waitForChanges } = await renderTable({
                data,
                columns,
            });
            const handle = getResizeHandle(root, 0);
            const widthBefore = getWidth(root, 0);
            const edge = handle.getBoundingClientRect();
            const pointer = (type: string, pointerId: number, x: number) =>
                new PointerEvent(type, {
                    bubbles: true,
                    button: 0,
                    pointerId: pointerId,
                    clientX: x,
                    clientY: edge.top,
                });

            handle.dispatchEvent(pointer('pointerdown', 1, edge.left));
            globalThis.dispatchEvent(pointer('pointermove', 2, edge.left + 90));
            await waitForChanges();

            expect(getWidth(root, 0)).toBe(widthBefore);

            globalThis.dispatchEvent(pointer('pointerup', 1, edge.left));
        });

        it('has a wider handle in a taller header on a touch device, next to what the header holds', async () => {
            const measure = async () => {
                const { root } = await renderTable({
                    data,
                    columns: [
                        { ...columns[0], headerComponent: { name: 'input' } },
                        columns[1],
                    ],
                });

                return {
                    handle: getResizeHandle(root, 0).getBoundingClientRect(),
                    content: found(
                        getHeader(root, 0).querySelector('input'),
                        'component in the header'
                    ).getBoundingClientRect(),
                };
            };
            const emulateTouch = (enabled: boolean) =>
                cdp().send('Emulation.setTouchEmulationEnabled', { enabled });

            const withMouse = await measure();
            await emulateTouch(true);
            try {
                const withFinger = await measure();

                expect(matchMedia('(pointer: coarse)').matches).toBe(true);
                expect(withFinger.handle.width).toBeGreaterThan(
                    withMouse.handle.width * 3
                );
                expect(withFinger.handle.width).toBeGreaterThanOrEqual(24);
                expect(withFinger.handle.height).toBeGreaterThan(
                    withMouse.handle.height
                );
                expect(withFinger.content.right).toBeLessThanOrEqual(
                    withFinger.handle.left
                );
            } finally {
                await emulateTouch(false);
            }
        });
    });

    describe('moving rows', () => {
        const movable = () => ({
            data,
            columns,
            movableRows: true,
            sortableColumns: false,
        });

        it('shows a drag handle on each row', async () => {
            const { root } = await renderTable(movable());

            expect(
                getRows(root).map((_, index) => !!getRowHandle(root, index))
            ).toEqual([true, true, true, true, true]);
        });

        it('has the dots of the drag handle in the middle of the row', async () => {
            const { root } = await renderTable(movable());
            const middleOf = (element: Element) => {
                const rect = element.getBoundingClientRect();

                return rect.top + rect.height / 2;
            };
            const dots = found(
                getRowHandle(root, 0).querySelector('.drag-icon'),
                'dots of the drag handle'
            );

            expect(
                Math.abs(middleOf(dots) - middleOf(getRow(root, 0)))
            ).toBeLessThan(1);
        });

        it('emits where a row was dropped when it is dragged by its handle', async () => {
            const reorder = vi.fn();
            const { root, events, waitForChanges } = await renderRecordingTable(
                { ...movable(), onReorder: reorder }
            );
            await dragRow(root, 0, 2);
            await waitForChanges();

            expect(events).toEqual([]);
            expect(reorder).toHaveBeenCalledTimes(1);
            expect(reorder.mock.calls[0][0].detail).toEqual({
                fromRow: data[0],
                toRow: data[2],
                above: false,
            });
        });

        it('emits that a row was dropped above another one when it is dragged to the top', async () => {
            const { root, events, waitForChanges } =
                await renderRecordingTable(movable());
            await dragRow(root, 3, 0);
            await waitForChanges();

            expect(events).toEqual(['reorder: 4 above 1']);
        });

        it('does not activate a row after it was dragged', async () => {
            const { root, events, waitForChanges } =
                await renderRecordingTable(movable());
            await dragRow(root, 0, 2);
            await waitForChanges();

            expect(events).toEqual(['reorder: 1 below 3']);
        });

        it('leaves the rows in the order of `data` after a drop, and shows the order it is given next', async () => {
            const { root, setProps, waitForChanges } =
                await renderTable(movable());
            const names = data.map((row) => row.name);

            await dragRow(root, 0, 2);
            await waitForChanges();
            expect(getFirstColumn(root)).toEqual(names);

            const [first, second, third, ...rest] = data;
            setProps({ data: [second, third, first, ...rest] });
            await waitForChanges();
            expect(getFirstColumn(root)).toEqual([
                names[1],
                names[2],
                names[0],
                ...names.slice(3),
            ]);
        });

        it('lets a row be dragged again after a drop', async () => {
            const { root, events, waitForChanges } =
                await renderRecordingTable(movable());

            await dragRow(root, 0, 2);
            await waitForChanges();
            await dragRow(root, 3, 0);
            await waitForChanges();

            expect(events).toEqual([
                'reorder: 1 below 3',
                'reorder: 4 above 1',
            ]);
        });

        it('lets a row be dragged after the table is moved to another place in the page', async () => {
            const { root, events, waitForChanges } =
                await renderRecordingTable(movable());
            const parent = root.parentElement;
            root.remove();
            parent.append(root);

            await dragRow(root, 0, 2);
            await waitForChanges();

            expect(events).toEqual(['reorder: 1 below 3']);
        });

        it('does not activate a row when its handle is clicked', async () => {
            const { root, events, waitForChanges } =
                await renderRecordingTable(movable());

            click(getRowHandle(root, 1));
            await waitForChanges();

            expect(events).toEqual([]);
        });

        it('warns once when rows can be moved and columns sorted', async () => {
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

            const { waitForChanges, setProps } = await renderTable({
                data,
                columns,
                movableRows: true,
            });
            setProps({ movableRows: false });
            await waitForChanges();
            setProps({ movableRows: true });
            await waitForChanges();

            expect(warn).toHaveBeenCalledTimes(1);
            expect(warn.mock.calls[0][0]).toContain('`sortableColumns`');
        });

        it('names the drag handles in the `language` it is given', async () => {
            const { root } = await renderTable({
                ...movable(),
                language: 'sv',
            });

            expect(getRowHandle(root, 0).language).toBe('sv');
        });

        it('does not activate a row when a drag ends on the row it started on', async () => {
            const { root, events, waitForChanges } =
                await renderRecordingTable(movable());
            const cell = getCell(root, 0).getBoundingClientRect();

            await drag(getRowHandle(root, 0), {
                x: cell.left + 20,
                y: cell.top + cell.height / 2 + 8,
            });
            await waitForChanges();

            expect(events).toEqual([]);
        });
    });

    describe('layout', () => {
        const createWideData = () => [
            {
                id: 1,
                name: 'A name that is much too long to fit '.repeat(5),
                age: 'An age that is much too long to fit '.repeat(5),
            },
        ];

        it('makes each column as wide as its content by default, and lets the table scroll sideways', async () => {
            const { root } = await renderTable({
                data: createWideData(),
                columns,
            });
            const scrollContainer = getScrollContainer(root);

            expect(scrollContainer.scrollWidth).toBeGreaterThan(
                scrollContainer.clientWidth
            );
        });

        it('fits all columns into the width with `stretchColumns`', async () => {
            const { root } = await renderTable({
                data: createWideData(),
                columns,
                layout: 'stretchColumns',
            });
            const scrollContainer = getScrollContainer(root);
            const widths = getHeaders(root).map(
                (header) => header.getBoundingClientRect().width
            );

            expect(scrollContainer.scrollWidth).toBe(
                scrollContainer.clientWidth
            );
            expect(Math.round(widths[0])).toBe(Math.round(widths[1]));
        });

        it('stretches the last column with `stretchLastColumn`', async () => {
            const { root } = await renderTable({
                data,
                columns,
                layout: 'stretchLastColumn',
            });
            const headers = getHeaders(root);
            const lastHeader = getHeader(
                root,
                headers.length - 1
            ).getBoundingClientRect();

            expect(Math.round(lastHeader.right)).toBe(
                Math.round(
                    getScrollContainer(root).getBoundingClientRect().right
                )
            );
            expect(lastHeader.width).toBeGreaterThan(
                headers[0].getBoundingClientRect().width
            );
        });

        it('makes the rows taller with `lowDensity`, and marks the host with `has-low-density`', async () => {
            const getRowHeight = (root: HTMLElement) =>
                getRow(root, 1).getBoundingClientRect().top -
                getRow(root, 0).getBoundingClientRect().top;
            const normal = await renderTable({ data, columns });
            const normalHeight = getRowHeight(normal.root);
            expect(normal.root.classList.contains('has-low-density')).toBe(
                false
            );

            const { root } = await renderTable({
                data,
                columns,
                layout: 'lowDensity',
            });

            expect(root.classList.contains('has-low-density')).toBe(true);
            expect(getRowHeight(root)).toBeGreaterThan(normalHeight);
        });

        it('shows the pagination below the rows by default', async () => {
            const { root } = await renderTable({ data, columns, pageSize: 2 });

            expect(root.classList.contains('has-pagination-on-top')).toBe(
                false
            );
            expect(
                getShownPagination(root).getBoundingClientRect().top
            ).toBeGreaterThan(getRow(root, 0).getBoundingClientRect().top);
        });

        it('shows the pagination above the rows with `paginationLocation` set to `top`', async () => {
            const { root } = await renderTable({
                data,
                columns,
                pageSize: 2,
                paginationLocation: 'top',
            });

            expect(root.classList.contains('has-pagination-on-top')).toBe(true);
            expect(
                getShownPagination(root).getBoundingClientRect().bottom
            ).toBeLessThanOrEqual(
                getHeader(root, 0).getBoundingClientRect().top
            );
        });

        it('shows the empty message when there are no rows', async () => {
            const { root, setProps, waitForChanges } = await renderTable({
                data: [],
                columns,
                emptyMessage: 'Nothing here',
            });

            expect(getRows(root)).toHaveLength(0);
            expect(getHeaderTitles(root)).toEqual(['Name', 'Age']);
            expect(getEmptyMessage(root)).toBe('Nothing here');

            setProps({ data: data });
            await waitForChanges();

            expect(getEmptyMessage(root)).toBeNull();
        });

        it('shows no empty message without an `emptyMessage`', async () => {
            const { root } = await renderTable({ data: [], columns });

            expect(getEmptyMessage(root)).toBeNull();
        });

        it('shows a spinner instead of the empty message while loading', async () => {
            const { root } = await renderTable({
                data: [],
                columns,
                emptyMessage: 'Nothing here',
                loading: true,
            });

            expect(getEmptyMessage(root)).toBeNull();
            expect(isLoading(root)).toBe(true);
        });

        it('keeps the rows while loading', async () => {
            const { root } = await renderTable({
                data,
                columns,
                loading: true,
            });

            expect(getRows(root)).toHaveLength(5);
            expect(isLoading(root)).toBe(true);
        });

        it('marks the host with `has-pagination` when there is more than one page', async () => {
            const { root, setProps, waitForChanges } = await renderTable({
                columns,
                data,
                pageSize: 2,
            });
            expect(root.classList.contains('has-pagination')).toBe(true);

            setProps({ pageSize: 10 });
            await waitForChanges();
            expect(root.classList.contains('has-pagination')).toBe(false);
        });

        it('does not mark the host with `has-pagination` without a page size', async () => {
            const { root } = await renderTable({ columns, data });

            expect(root.classList.contains('has-pagination')).toBe(false);
        });

        it('lets a consumer hide the pagination of a single-page table', async () => {
            const { root, setProps, waitForChanges } = await renderTable({
                columns,
                data,
                pageSize: 10,
            });
            expect(isShown(getPagination(root))).toBe(true);

            root.style.setProperty(
                '--limel-table-single-page-paginator-display',
                'none'
            );

            expect(isShown(getPagination(root))).toBe(false);

            setProps({ pageSize: 2 });
            await waitForChanges();

            expect(isShown(getPagination(root))).toBe(true);
        });

        it('gives the active row a background of its own only when the consumer marks the host with `has-interactive-rows`', async () => {
            const props = {
                data,
                columns,
                activeRow: { id: 3 },
                style: {
                    '--contrast-100': '250, 250, 250',
                    '--contrast-200': '240, 240, 240',
                    '--mdc-theme-primary': 'rgb(0, 128, 128)',
                },
            };
            const plain = await renderTable(props);
            expect(getRowBackground(getRow(plain.root, 2))).toBe(
                getRowBackground(getRow(plain.root, 0))
            );

            const { root } = await renderTable({
                ...props,
                class: 'has-interactive-rows',
            });
            expect(getRowBackground(getRow(root, 2))).not.toBe(
                getRowBackground(getRow(root, 0))
            );
        });

        it('marks the active row with a dot, also without `has-interactive-rows`', async () => {
            const getDot = (row: Element) =>
                getComputedStyle(row.querySelector('td'), '::after').content;
            const props = { data, columns, activeRow: { id: 3 } };

            const plain = await renderTable(props);
            expect(getDot(getRow(plain.root, 2))).not.toBe('none');
            expect(getDot(getRow(plain.root, 0))).toBe('none');

            const { root } = await renderTable({
                ...props,
                class: 'has-interactive-rows',
                movableRows: true,
                selectable: true,
            });
            expect(getDot(getRow(root, 2))).not.toBe('none');
            expect(getDot(getRow(root, 0))).toBe('none');
        });

        it('keeps a column no wider than `--table-max-column-width`', async () => {
            const { root } = await renderTable({
                data: [
                    { id: 1, name: 'A name that is far too long '.repeat(8) },
                ],
                columns,
                style: { '--table-max-column-width': '10rem' },
            });

            expect(
                getHeader(root, 0).getBoundingClientRect().width
            ).toBeLessThanOrEqual(160);
            expect(
                getCell(root, 0).getBoundingClientRect().width
            ).toBeLessThanOrEqual(160);
        });

        it('scrolls its rows inside a `max-height`, with the pagination below them', async () => {
            const { root, waitForChanges } = await renderTable({
                data: Array.from({ length: 60 }, (_, index) => ({
                    id: index + 1,
                    name: `Row ${index + 1}`,
                })),
                columns,
                pageSize: 50,
            });
            Object.assign(root.style, { height: '', maxHeight: '300px' });
            await waitForChanges();
            const scrollContainer = getScrollContainer(root);
            const host = root.getBoundingClientRect();

            expect(host.height).toBe(300);
            expect(scrollContainer.scrollHeight).toBeGreaterThan(
                scrollContainer.clientHeight
            );
            expect(
                getShownPagination(root).getBoundingClientRect().bottom
            ).toBeLessThanOrEqual(host.bottom);
        });

        it('tells the pagination when the table is loading', async () => {
            const { root } = await renderTable({
                columns,
                data,
                pageSize: 2,
                loading: true,
            });

            expect(getShownPagination(root).loading).toBe(true);
        });
    });
});
