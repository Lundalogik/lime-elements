import { Component, h, Host, State } from '@stencil/core';
import {
    Column,
    LimelTableCustomEvent,
    RowReorderEvent,
} from '@limetech/lime-elements';
import { data, Bird } from './birds';
import { capitalize } from 'lodash-es';

/**
 * Movable rows
 *
 * Set `movableRows` to `true` to let the user change the order of the rows.
 * Each row then gets a handle at its start, which the user drags the row by.
 *
 * The table does not move the row by itself. When the user drops a row, the
 * table emits `reorder`, which says which row was moved (`fromRow`), which row
 * it was dropped next to (`toRow`), and whether it was dropped `above` that
 * row or below it. Change the order of the rows in `data` to match. If you do
 * not, the row goes back to where it was the next time the table is drawn.
 *
 * This is meant for tables where the user manages the order of the data,
 * rather than just looking at it. So it does not go well with sorting:
 *
 * - When the user sorts by a column, the rows are shown in another order than
 * they have in `data`, so a moved row does not end up where it looks like it
 * should. Set `sortableColumns` to `false` when you use movable rows, as this
 * example does. The table warns in the console when both are on.
 * - With `mode="remote"`, the table shows the rows in the order you give them.
 * When the user sorts, you fetch the rows in the new order, and that order
 * replaces the one the user made by moving rows.
 *
 * @sourceFile birds.ts
 */
@Component({
    tag: 'limel-example-table-movable-rows',
    styleUrl: 'table-basic.scss',
    shadow: true,
})
export class TableExampleMovableRows {
    @State()
    private movableRows = true;

    @State()
    private selectable = false;

    @State()
    private tableData: Bird[] = [...data];

    private readonly columns: Array<Column<Bird>> = [
        { title: 'Name', field: 'name' },
        { title: 'Binominal name', field: 'binominalName' },
        { title: 'Nest type', field: 'nest', formatter: capitalize },
        { title: 'Eggs per clutch', field: 'eggs', horizontalAlign: 'right' },
    ];

    private readonly handleReorder = (
        event: LimelTableCustomEvent<RowReorderEvent<Bird>>
    ) => {
        const { fromRow, toRow, above } = event.detail;
        const items = [...this.tableData];

        const fromIndex = items.findIndex((bird) => bird.name === fromRow.name);
        if (fromIndex === -1) {
            return;
        }
        items.splice(fromIndex, 1);

        let toIndex = items.findIndex((bird) => bird.name === toRow.name);
        if (toIndex === -1) {
            return;
        }
        if (!above) {
            toIndex += 1;
        }

        items.splice(toIndex, 0, fromRow);
        this.tableData = items;
    };

    public render() {
        const rowOrder = this.tableData.map((bird) => bird.name);

        return (
            <Host>
                <limel-table
                    data={this.tableData}
                    columns={this.columns}
                    movableRows={this.movableRows}
                    selectable={this.selectable}
                    sortableColumns={false}
                    onReorder={this.handleReorder}
                />
                <limel-example-controls>
                    <limel-switch
                        label="movableRows"
                        onChange={this.toggleMovableRows}
                        value={this.movableRows}
                    />
                    <limel-switch
                        label="selectable"
                        onChange={this.toggleSelectable}
                        value={this.selectable}
                    />
                    <limel-switch
                        label="sortableColumns"
                        value={false}
                        disabled={true}
                        id="sortableColumns"
                    />
                    <limel-tooltip
                        label="You cannot use `sortableColumns` and `movableRows` together"
                        helperLabel="Combining `movableRows` with `sortableColumns` is not recommended. Sorting reorders the rows visually, so dragging a row to a new position will not match the underlying data order."
                        elementId="sortableColumns"
                        max-length="100ch"
                    />
                </limel-example-controls>
                <limel-example-value
                    label="Current row order is"
                    value={rowOrder}
                />
            </Host>
        );
    }

    private toggleMovableRows = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.movableRows = event.detail;
    };

    private toggleSelectable = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.selectable = event.detail;
    };
}
