import { CellComponent, RowComponent, Tabulator } from 'tabulator-tables';
import { ElementPool } from './element-pool';
import { TableSelection } from './table-selection';

describe('table selection', () => {
    let tableSelection: TestTableSelection;
    let table;
    let emitSelect;

    class TestTableSelection extends TableSelection {
        public clickRowSelector(index: number, shiftKey?: boolean) {
            const ev = {
                shiftKey: shiftKey,
                preventDefault: () => {},
                stopPropagation: () => {},
            } as any;
            this.rowSelectorCellClick(ev, table.getRows()[index].getCells()[0]);
        }
    }

    beforeEach(() => {
        emitSelect = jest.fn();
        table = {
            getRow: function (this: Tabulator, id: string | number) {
                return this.getRows().find((row) => row.getData().id === id);
            },
            element: {
                classList: {
                    toggle: jest.fn(),
                },
            },
        };
        tableSelection = new TestTableSelection(
            () => table,
            new ElementPool(document),
            { emit: emitSelect },
            jest.fn((key: string) => key)
        );
    });

    const setupTableWithRowSelectors: (
        ...rowData: any[]
    ) => Map<any, { checked: boolean }> = (...rowData: any[]) => {
        const rowCheckboxMap = new Map<any, { checked: boolean }>();
        const makeCell: (row: any, data: any) => CellComponent = (
            row: any,
            data: any
        ) => {
            const checkbox = { checked: false };
            rowCheckboxMap.set(data, checkbox);
            const cell: any = {
                getElement: () => ({
                    querySelector: () => checkbox,
                }),
                getRow: () => row,
            };

            return cell as any;
        };

        const makeRow: (data: any, position: number) => RowComponent = (
            data,
            position
        ) => {
            const row: Partial<RowComponent> = {
                getData: () => data,
                getPosition: () => position,
            };
            row.getCells = () => [makeCell(row, data)];

            return row as any;
        };

        const rows = rowData.map(makeRow);
        table.getRows = () => rows;
        table.getRowFromPosition = (index: number) => rows[index];

        return rowCheckboxMap;
    };

    describe('setSelection', () => {
        it('checks all rows with data found in selection', () => {
            const a = {};
            const b = {};
            const c = {};
            const selection = [a, b, c];
            const checkboxes = setupTableWithRowSelectors(a, b);

            tableSelection.setSelection(selection);

            expect(checkboxes.size).toEqual(2);
            expect(checkboxes.get(a)).toBeDefined();
            expect(checkboxes.get(b)).toBeDefined();
            expect(checkboxes.get(a).checked).toBeTruthy();
            expect(checkboxes.get(b).checked).toBeTruthy();
        });

        it('unchecks all rows with empty selection', () => {
            const a = {};
            const b = {};
            const checkboxes = setupTableWithRowSelectors(a, b);
            tableSelection.setSelection([a, b]);

            tableSelection.setSelection([]);

            expect(checkboxes.size).toEqual(2);
            expect(checkboxes.get(a)).toBeDefined();
            expect(checkboxes.get(b)).toBeDefined();
            expect(checkboxes.get(a).checked).toBeFalsy();
            expect(checkboxes.get(b).checked).toBeFalsy();
        });

        it('can select a single row', () => {
            const a = {};
            const b = {};
            const c = {};
            const checkboxes = setupTableWithRowSelectors(a, b, c);

            tableSelection.setSelection([b]);

            expect(checkboxes.size).toEqual(3);
            expect(checkboxes.get(a)).toBeDefined();
            expect(checkboxes.get(b)).toBeDefined();
            expect(checkboxes.get(c)).toBeDefined();
            expect(checkboxes.get(a).checked).toBeFalsy();
            expect(checkboxes.get(b).checked).toBeTruthy();
            expect(checkboxes.get(c).checked).toBeFalsy();
        });

        it('can select a single row by id', () => {
            const a = { id: 'a' };
            const b = { id: 'b' };
            const c = { id: 'c' };
            const checkboxes = setupTableWithRowSelectors(a, b, c);

            tableSelection.setSelection([{ id: 'b' }]);

            expect(checkboxes.size).toEqual(3);
            expect(checkboxes.get(a)).toBeDefined();
            expect(checkboxes.get(b)).toBeDefined();
            expect(checkboxes.get(c)).toBeDefined();
            expect(checkboxes.get(a).checked).toBeFalsy();
            expect(checkboxes.get(b).checked).toBeTruthy();
            expect(checkboxes.get(c).checked).toBeFalsy();
        });
    });

    describe('row selector cell click', () => {
        it('emits the select event with the data of the selected row', () => {
            const a = { id: 1 };
            const b = {};
            setupTableWithRowSelectors(a, b);

            tableSelection.clickRowSelector(0);

            expect(emitSelect).toHaveBeenCalledWith([a]);
        });

        it('emits the select event with the data of the range of selected rows when using shift click', () => {
            const a = {};
            const b = {};
            const c = {};
            const d = {};
            setupTableWithRowSelectors(a, b, c, d);

            tableSelection.clickRowSelector(0);
            tableSelection.clickRowSelector(3, true);

            expect(emitSelect).toHaveBeenCalledWith([a, b, c, d]);
        });
    });
});
