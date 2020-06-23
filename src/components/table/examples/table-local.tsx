import { Component, h, State } from '@stencil/core';
import { Column, ColumnSorter } from '../table.types';
import { data, Bird } from './birds';
import { capitalize } from 'lodash-es';

@Component({
    tag: 'limel-example-table-local',
    styleUrl: 'table.scss',
    shadow: true,
})
export class TableExampleLocal {
    private columns: Array<Column<Bird>> = [];

    @State()
    private currentPage: number = 1;

    @State()
    private currentSorting: string = 'None';

    private pageSize = 10;

    constructor() {
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleSort = this.handleSort.bind(this);
    }

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
            { title: 'Eggs per clutch', field: 'eggs' },
            { title: 'Origin', field: 'origin' },
        ];
    }

    private addUnit = (unit: string) => (value: any) => {
        return `${value} ${unit}`;
    };

    private handleChangePage(event: CustomEvent<number>) {
        this.currentPage = event.detail;
    }

    private handleSort(event: CustomEvent<ColumnSorter[]>) {
        this.currentSorting = event.detail[0].column.title;
    }

    public render() {
        return [
            <limel-table
                data={data}
                columns={this.columns}
                pageSize={this.pageSize}
                onChangePage={this.handleChangePage}
                onSort={this.handleSort}
            />,
            <p>Current page is: {this.currentPage}</p>,
            <p>Currently sorting on: {this.currentSorting}</p>,
        ];
    }
}
