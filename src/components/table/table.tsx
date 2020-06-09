import { Component, h, Prop, Element, Watch } from '@stencil/core';
import TabulatorTable from 'tabulator-tables';
import config from '../../global/config';
export interface Column {
    /**
     * column title to be displayed
     */
    title: string;
    /**
     * the key for this column in the data array
     */
    field: string;
}
@Component({
    tag: 'limel-table',
    styleUrl: 'table.scss',
    shadow: true,
})
export class Table {
    /**
     * table data to be displayed
     */
    @Prop()
    public data: object[] = [];

    @Prop()
    public columns: Column[] = [];

    @Element()
    el: HTMLElement;

    private tabulator: Tabulator;

    public componentDidLoad() {
        const option: Tabulator.Options = {
            data: this.data,
            columns: this.columns,
        };
        const table: HTMLElement = this.el.shadowRoot.querySelector(
            '#tabulator-table'
        );
        this.tabulator = new TabulatorTable(table, option);
    }
    @Watch('data')
    public updateData() {
        this.tabulator.setData(this.data);
    }
    @Watch('columns')
    public updateColumns() {
        this.tabulator.setColumns(this.columns);
    }
    render() {
        if (!config.featureSwitches.enableTable) {
            return;
        }
        return <div id="tabulator-table" />;
    }
}
