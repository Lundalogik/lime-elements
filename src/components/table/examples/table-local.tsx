import { Component, h, State } from '@stencil/core';
import {
    Column,
    ColumnSorter,
    ColumnAggregatorType,
} from '@limetech/lime-elements';
import { data, Bird } from './birds';
import { capitalize } from 'lodash-es';

/**
 * Local sorting and pagination
 *
 * In the default `mode`, which is `local`, you give the table all the rows,
 * and the table sorts them and splits them into pages by itself. Set
 * `pageSize` to the number of rows on each page.
 *
 * The table tells you what the user did, so that you can remember it, for
 * example in the URL:
 *
 * - `sort` is emitted when the user sorts the rows by clicking a column header.
 * Its detail lists the sorted columns, each with its `direction`.
 * - `changePage` is emitted with the number of the new page when the user
 * goes to another page.
 *
 * To show the table with a page or a sorting from the start, set the `page`
 * and `sorting` props.
 *
 * :::note
 * The table also emits these events when it follows a change of the `page` or
 * `sorting` props, and it can emit `sort` when it is created with a `sorting`.
 * If you store what the events say and pass it back, compare it with what you
 * have first, so that you do not set the same value again.
 * :::
 *
 * The "Eggs per clutch" column also shows the average of all its values
 * below the rows, by setting `aggregator` to `ColumnAggregatorType.Average`.
 *
 * @sourceFile birds.ts
 */
@Component({
    tag: 'limel-example-table-local',
    styleUrl: 'table-basic.scss',
    shadow: true,
})
export class TableExampleLocal {
    private columns: Array<Column<Bird>> = [];

    @State()
    private currentPage: number = 1;

    @State()
    private currentSorting: string = 'None';

    private pageSize = 10;

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
                aggregator: ColumnAggregatorType.Average,
                horizontalAlign: 'right',
            },
            { title: 'Origin', field: 'origin' },
        ];
    }

    private addUnit = (unit: string) => (value: any) => {
        return `${value} ${unit}`;
    };

    private handleChangePage = (event: CustomEvent<number>) => {
        this.currentPage = event.detail;
    };

    private handleSort = (event: CustomEvent<ColumnSorter[]>) => {
        this.currentSorting = event.detail[0].column.title;
    };

    public render() {
        return [
            <limel-table
                data={data}
                columns={this.columns}
                pageSize={this.pageSize}
                onChangePage={this.handleChangePage}
                onSort={this.handleSort}
            />,
            <limel-example-value
                label="Current page is"
                value={this.currentPage}
            />,
            <limel-example-value
                label="Currently sorting on"
                value={this.currentSorting}
            />,
        ];
    }
}
