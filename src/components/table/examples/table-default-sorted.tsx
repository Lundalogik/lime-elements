import { Component, h, State } from '@stencil/core';
import { Column, ColumnSorter } from '@limetech/lime-elements';
import { data, Bird } from './birds';
import { capitalize } from 'lodash-es';

/**
 * Default sorted columns
 *
 * In this example, the table is sorted on *two* columns. Primary sorting is
 * done on the "Eggs per clutch" column, and secondary sorting is done on the
 * "Name" column. The result is that within each "group" of birds that have the
 * same number of eggs per clutch, the birds are sorted by name.
 */
@Component({
    tag: 'limel-example-table-default-sorted',
    styleUrl: 'table.scss',
    shadow: true,
})
export class TableExampleDefaultSorted {
    @State()
    private columns: Array<Column<Bird>> = [];

    private tableData: Bird[] = data;
    private sortedColumns: ColumnSorter[] = [];

    public componentWillLoad() {
        this.columns = [
            { title: 'Name', field: 'name' },
            { title: 'Binominal name', field: 'binominalName' },
            {
                title: 'Wingspan',
                field: 'wingspan',
                formatter: this.addUnit('cm'),
            },
            { title: 'Nest type', field: 'nest', formatter: capitalize },
            {
                title: 'Eggs per clutch',
                field: 'eggs',
                horizontalAlign: 'right',
            },
            {
                title: 'Origin',
                field: 'origin',
                horizontalAlign: 'right',
            },
        ];

        this.sortedColumns = [
            { column: this.columns[0], direction: 'ASC' },
            { column: this.columns[4], direction: 'ASC' },
        ];
    }

    render() {
        return (
            <limel-table
                data={this.tableData}
                columns={this.columns}
                sorting={this.sortedColumns}
            />
        );
    }

    private addUnit = (unit: string) => (value: any) => {
        return `${value} ${unit}`;
    };
}
