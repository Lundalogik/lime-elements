import { Component, h, State } from '@stencil/core';
import { Column, TableParams, ColumnSorter } from '@limetech/lime-elements';
import { data, Bird } from './birds';
import { capitalize } from 'lodash-es';

const NETWORK_DELAY = 500;

/**
 * Remote sorting and pagination
 * @link birds.ts
 */
@Component({
    tag: 'limel-example-table-remote',
    styleUrl: 'table.scss',
    shadow: true,
})
export class TableExampleRemote {
    private columns: Array<Column<Bird>> = [];

    @State()
    private currentData: object[] = [];

    private allData: object[] = data;

    private pageSize = 10;

    private currentPage: number;

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
                horizontalAlign: 'right',
                field: 'eggs',
                aggregator: this.calculateAverage,
            },
            { title: 'Origin', field: 'origin' },
        ];
    }

    private addUnit = (unit: string) => (value: any) => {
        return `${value} ${unit}`;
    };

    private handleLoad = (event: CustomEvent<TableParams>) => {
        console.log('Loading new data', event.detail);
        const sorter = event.detail.sorters[0];

        this.currentPage = event.detail.page;
        if (sorter) {
            this.allData = [...data].sort(this.compareBy(sorter));
        }

        this.loadData();
    };

    /**
     * This will only handle how to compare strings. This means the two number
     * columns in the example will not be sorted in the correct way
     */
    private compareBy = (sorter: ColumnSorter) => (a: Bird, b: Bird) => {
        const column = sorter.column;
        const fieldA = a[column.field];
        const fieldB = b[column.field];

        if (sorter.direction === 'ASC') {
            return String(fieldA).localeCompare(String(fieldB));
        }

        return String(fieldB).localeCompare(String(fieldA));
    };

    /**
     * Calculate the average value for a column for all the available data
     *
     * `values` and `rowsData` are not needed in this example since they only
     * contain the values for the data that is currently loaded in the table
     */
    private calculateAverage(column: Column, values: any[], rowsData: Bird[]) {
        console.log(values, rowsData);

        const total = data.reduce((sum: number, value: Bird) => {
            return sum + value[column.field];
        }, 0);

        return total / data.length;
    }

    /**
     * Simulate some network delay, like loading data from a server
     */
    private loadData() {
        setTimeout(() => {
            const start = (this.currentPage - 1) * this.pageSize;
            const end = start + this.pageSize;
            this.currentData = this.allData.slice(start, end);
        }, NETWORK_DELAY);
    }

    public render() {
        return (
            <limel-table
                mode="remote"
                data={this.currentData}
                columns={this.columns}
                pageSize={this.pageSize}
                totalRows={data.length}
                onLoad={this.handleLoad}
            />
        );
    }
}
