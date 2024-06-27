import { EventEmitter } from '@stencil/core';
import Tabulator from 'tabulator-tables';
import { setElementProperties } from './columns';
import { ElementPool } from './element-pool';
import { Selection, SelectionChangeSet } from './selection';
import { RowData } from './table.types';

const LIMEL_CHECKBOX = 'limel-checkbox';

const getRowId = (data: RowData) => data.id ?? data;

/**
 * Provides row selection to Tabulator with shift-click support for range selections
 */
export class TableSelection {
    private selection: Selection;

    /**
     * Creates an instance of the TableSelection class
     *
     * @param getTable - Function that returns the Tabulator instance
     * @param pool - The element pool used to cache the checkbox components
     * @param selectEvent - The event emitter to use when checkboxes are toggled
     */
    constructor(
        private getTable: () => Tabulator,
        private pool: ElementPool,
        private selectEvent: EventEmitter<RowData[]>,
    ) {
        this.selection = new Selection((index) =>
            getRowId(this.getRowByIndex(index).getData()),
        );
    }

    /**
     * @returns Returns `true` when the selection is non-empty, otherwise `false`
     */
    get hasSelection(): boolean {
        return this.selection.size > 0;
    }

    /**
     * Clears the selection
     */
    public clear(): void {
        this.selection.clear();
    }

    /**
     * Sets the selected items
     *
     * @param data - The selected items
     */
    public setSelection(data: RowData[] = []): void {
        const newItems = data.map(getRowId);
        if (
            this.selection.size === data.length &&
            this.selection.items.every(
                (oldItem, index) => oldItem === newItems[index],
            )
        ) {
            return;
        }

        this.selection.items = newItems;
        const rows = this.getActiveRows();
        rows.forEach((row) =>
            this.updateRowSelector(
                row,
                this.selection.has(getRowId(row.getData())),
            ),
        );
    }

    /**
     * Prepends a checkbox column used for row selection to the given column definitions
     *
     * @param columnDefinitions - The column definition for the table
     * @returns The column definitions with the checkbox column prepended to it
     */
    public getColumnDefinitions(
        columnDefinitions: Tabulator.ColumnDefinition[],
    ): Tabulator.ColumnDefinition[] {
        return [this.getRowSelectorColumnDefinition(), ...columnDefinitions];
    }

    private getRowSelectorColumnDefinition(): Tabulator.ColumnDefinition {
        return {
            title: '',
            formatter: this.getRowSelectorFormatter(),
            cellClick: this.rowSelectorCellClick,
            headerClick: this.headerClick,
            headerSort: false,
            cssClass: 'limel-table--row-selector',
            resizable: false,
            htmlOutput: false,
            clipboard: false,
        };
    }

    private headerClick(ev: Event): void {
        ev.stopPropagation();
    }

    private getRowSelectorFormatter() {
        return (cell: Tabulator.CellComponent) => {
            const element = this.pool.get(LIMEL_CHECKBOX);
            setElementProperties(element, {
                checked: this.selection.has(getRowId(cell.getData())),
            });
            element.style.display = 'inline-block';

            return element;
        };
    }

    /**
     * Tabulator cell click handler that updates the selection for the clicked
     * row and toggles the selection from the last clicked row if the shift key
     * is pressed down.
     *
     * @param ev - The pointer event
     * @param cell - The clicked cell component
     */
    protected rowSelectorCellClick = (
        ev: PointerEvent,
        cell: Tabulator.CellComponent,
    ): void => {
        ev.stopPropagation();
        ev.preventDefault();

        const clickedRow = cell.getRow();
        const rowPosition = clickedRow.getPosition(true);

        if (ev.shiftKey) {
            this.updateRowSelectors(
                this.selection.toggleSelectionFromLastIndex(rowPosition),
            );
        } else {
            this.updateRowSelectors(
                this.selection.toggleSelection(rowPosition),
            );
        }

        this.selectEvent.emit(this.selection.items.map(this.getRowData));
    };

    private getRowData = (item: RowData | RowData['id']) => {
        if (typeof item === 'object') {
            return item;
        }

        return this.getTable().getRow(item).getData();
    };

    private updateRowSelectors = (changeSet: SelectionChangeSet): void => {
        changeSet.indexes
            .map(this.getRowByIndex)
            .forEach((row) => this.updateRowSelector(row, changeSet.selected));
    };

    private updateRowSelector = (
        row: Tabulator.RowComponent,
        checked: boolean,
    ): void => {
        const cell = row.getCells()[0];
        if (cell) {
            const checkBox = cell.getElement().querySelector(LIMEL_CHECKBOX);
            checkBox.checked = checked;
        }
    };

    private getActiveRows: () => Tabulator.RowComponent[] = () => {
        const table = this.getTable();
        if (!table) {
            return [];
        }

        return table.getRows('active');
    };

    private getRowByIndex = (index: number) => {
        return this.getTable().getRowFromPosition(index, true);
    };
}
