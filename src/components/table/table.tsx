import { Component, h, Prop, Element, Watch } from '@stencil/core';
import TabulatorTable from 'tabulator-tables';
import config from '../../global/config';
import { Column } from './table.types';
import { createColumnDefinition } from './columns';

@Component({
    tag: 'limel-table',
    styleUrl: 'table.scss',
    shadow: true,
})
export class Table {
    /**
     * Data to be displayed in the table
     */
    @Prop()
    public data: object[] = [];

    /**
     * Columns used to display the data
     */
    @Prop()
    public columns: Column[] = [];

    @Element()
    private host: HTMLElement;

    private tabulator: Tabulator;

    public componentDidLoad() {
        const options: Tabulator.Options = {
            data: this.data,
            columns: this.getColumnDefinitions(),
        };
        const table: HTMLElement = this.host.shadowRoot.querySelector(
            '#tabulator-table'
        );
        this.tabulator = new TabulatorTable(table, options);
    }

    @Watch('data')
    public updateData() {
        this.tabulator.setData(this.data);
    }

    @Watch('columns')
    public updateColumns() {
        this.tabulator.setColumns(this.getColumnDefinitions());
    }

    private getColumnDefinitions(): Tabulator.ColumnDefinition[] {
        return this.columns.map(createColumnDefinition);
    }

    render() {
        if (!config.featureSwitches.enableTable) {
            return;
        }

        return <div id="tabulator-table" />;
    }
}
