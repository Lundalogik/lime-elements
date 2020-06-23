import { Component, h, State } from '@stencil/core';
import { Column, TableParams } from '../table.types';
import { data, Bird } from './birds';
import { capitalize } from 'lodash-es';

const NETWORK_DELAY = 500;

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

    constructor() {
        this.handleLoad = this.handleLoad.bind(this);
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

    private handleLoad(event: CustomEvent<TableParams>) {
        console.log('Loading new data', event.detail);

        this.currentPage = event.detail.page;

        this.loadData();
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
