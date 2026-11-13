import { Component, h, State } from '@stencil/core';
import { Column } from '@limetech/lime-elements';
import { data, Bird } from './birds';
import { capitalize } from 'lodash-es';

/**
 * Movable columns
 *
 * Set `movableColumns` to `true` to let the user change the order of the
 * columns, by dragging a column header to another place.
 *
 * After a move, the table emits `changeColumns` with all the columns, in their
 * new order. To keep that order, for example the next time the user opens the
 * same view, save it and give it to the table as `columns`.
 *
 * @sourceFile birds.ts
 */
@Component({
    tag: 'limel-example-table-movable-columns',
    styleUrl: 'table-basic.scss',
    shadow: true,
})
export class TableExampleLocal {
    @State()
    private columns: Array<Column<Bird>> = [
        { title: 'Name', field: 'name' },
        { title: 'Binominal name', field: 'binominalName' },
        { title: 'Nest type', field: 'nest', formatter: capitalize },
        { title: 'Eggs per clutch', field: 'eggs', horizontalAlign: 'right' },
        { title: 'Origin', field: 'origin' },
    ];

    private handleChangeColumns = (event: CustomEvent<Column[]>) => {
        this.columns = event.detail;
    };

    public render() {
        const columnOrder = this.columns.map((column) => column.title);

        return [
            <limel-table
                data={data}
                columns={this.columns}
                movableColumns={true}
                onChangeColumns={this.handleChangeColumns}
            />,
            <limel-example-value
                label="Current column order is"
                value={columnOrder}
            />,
        ];
    }
}
