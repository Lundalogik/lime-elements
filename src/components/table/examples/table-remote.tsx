import { Component, h, State } from '@stencil/core';
import { Column, TableParams, ColumnSorter } from '@limetech/lime-elements';
import { data, Bird } from './birds';
import { capitalize } from 'lodash-es';

const NETWORK_DELAY = 500;
type BirdRow = Bird & { id: string };

/**
 * Remote sorting and pagination
 *
 * Use `mode="remote"` when the rows come from a server, and you only load one
 * page of them at a time. The table then does not sort or split the rows by
 * itself. Instead, it emits `load` with the `page` and the `sorters` it needs.
 * You fetch those rows, and give them to the table as `data`. The table shows
 * them in the order you give them.
 *
 * - `load` is also emitted when the table is created, so you can load the
 * first page when you get it.
 * - Set `totalRows` to the number of rows on the server, so that the table
 * knows how many pages there are.
 * - Set `loading` to `true` while you fetch the rows, to show a spinner.
 *
 * :::important
 * One click can make the table emit `load` more than once. Always show what
 * the **last** `load` asked for, and drop the answers to the earlier ones when
 * they arrive later.
 * :::
 *
 * In this example, a delay pretends to be the server. Each answer reads the
 * page and the sorting of the last `load` when it arrives, so the last one
 * wins. Its sorting only compares text, so the number columns are not sorted
 * correctly. It also only sorts by the first item in `sorters`, so a column
 * that the user adds to the sorting with <kbd>Shift</kbd>-click is ignored.
 *
 * :::note
 * The table only has the rows of the page it shows, so an `aggregator` only
 * gets those rows. The average below "Eggs per clutch" is worked out from all
 * the rows by the example itself. With a real server, ask the server for the
 * totals, and give them to the table in `aggregates`, as objects with the
 * `field` of the column and the `value` to show. Then remove the column's own
 * `aggregator`: a column that has one ignores its value in `aggregates`.
 * :::
 *
 * @sourceFile birds.ts
 */
@Component({
    tag: 'limel-example-table-remote',
    styleUrl: 'table-basic.scss',
    shadow: true,
})
export class TableExampleRemote {
    private columns: Array<Column<Bird>> = [];

    @State()
    private currentData: BirdRow[] = [];

    @State()
    private loading = false;

    private allData: Bird[] = data;

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
        const sorter = event.detail.sorters?.[0];

        this.currentPage = event.detail.page;
        if (sorter?.column) {
            this.allData = [...data].sort(this.compareBy(sorter));
        } else {
            // When sorting is cleared, reset to the original order
            this.allData = [...data];
        }

        this.loadData();
    };

    /**
     * This will only handle how to compare strings. This means the two number
     * columns in the example will not be sorted in the correct way
     * @param sorter
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
     * @param column
     * @param values
     * @param rowsData
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
        this.loading = true;
        setTimeout(() => {
            const start = (this.currentPage - 1) * this.pageSize;
            const end = start + this.pageSize;

            this.currentData = this.allData.slice(start, end).map((item) => ({
                ...item,
                // Provide a stable id to keep scroll position and selection
                // intact while the remote dataset refreshes.
                id: item.binominalName,
            }));

            this.loading = false;
        }, NETWORK_DELAY);
    }

    public render() {
        return (
            <limel-table
                mode="remote"
                loading={this.loading}
                data={this.currentData}
                columns={this.columns}
                pageSize={this.pageSize}
                totalRows={data.length}
                onLoad={this.handleLoad}
            />
        );
    }
}
