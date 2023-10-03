import { Component, h, State } from '@stencil/core';
import { Column } from '@limetech/lime-elements';
import { data, Bird } from './birds';
import { capitalize } from 'lodash-es';

/**
 * Movable columns
 * @link birds.ts
 */
@Component({
    tag: 'limel-example-table-movable-columns',
    styleUrl: 'table.scss',
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
