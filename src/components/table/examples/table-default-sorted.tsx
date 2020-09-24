import { Component, h, State } from '@stencil/core';
import { Column, ColumnSorter } from '../table.types';
import { data, Bird } from './birds';
import { capitalize } from 'lodash-es';

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
            },
            { title: 'Origin', field: 'origin' },
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
