import { Component, h, Host, State } from '@stencil/core';
import { Column, RowReorderEvent } from '@limetech/lime-elements';
import { data, Bird } from './birds';
import { capitalize } from 'lodash-es';

/**
 * Movable rows
 *
 * This option is aimed more for managing data, rather than just viewing it.
 * Hence, it is not suitable combining with attributes that affect sorting.
 *
 *  With `mode="remote"` sorting is provided by remote data source, so any user provided sorting is ignored
 *  on data updates.
 *
 *  Combining with `sortableColumns` makes the data look different from what it is.
 *  It is recommended to set `sortableColumns` to `false` when using movable rows.
 *  Try to reorder the data in this example after sorting by any column, and then
 *  see how the reorder behaves.
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
        event: CustomEvent<RowReorderEvent<Bird>>
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
