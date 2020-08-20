import {
    Component,
    h,
    Prop,
    Element,
    Watch,
    EventEmitter,
    Event,
} from '@stencil/core';
import TabulatorTable from 'tabulator-tables';
import { Column, TableParams, ColumnSorter } from './table.types';
import { createColumnDefinition, createColumnSorter } from './columns';
import { isEqual } from 'lodash-es';

const FIRST_PAGE = 1;

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

    /**
     * Set to either `local` or `remote` to change how the table handles the
     * loaded data. When in `local` mode, all sorting and pagination will be
     * done locally with the data given. When in `remote` mode, the consumer
     * is responsible to give the table new data when a `load` event occurs
     */
    @Prop()
    public mode: 'local' | 'remote' = 'local';

    /**
     * Number of rows per page
     */
    @Prop()
    public pageSize: number;

    /**
     * The number of total rows available for the data
     */
    @Prop()
    public totalRows: number;

    /**
     * Emitted when `mode` is `local` the data is sorted
     */
    @Event()
    public sort: EventEmitter<ColumnSorter[]>;

    /**
     * Emitted when `mode` is `local` and a new page has been set
     */
    @Event()
    public changePage: EventEmitter<number>;

    /**
     * Emitted when `mode` is `remote` and the table is loading new data. The
     * consumer is responsible for giving the table new data
     */
    @Event()
    public load: EventEmitter<TableParams>;

    @Element()
    private host: HTMLLimelTableElement;

    private currentPage: number;

    private tabulator: Tabulator;

    private resolver: (data: any) => void;

    constructor() {
        this.handleDataSorting = this.handleDataSorting.bind(this);
        this.handlePageLoaded = this.handlePageLoaded.bind(this);
        this.requestData = this.requestData.bind(this);
    }

    public componentDidLoad() {
        if (this.pageSize) {
            this.currentPage = FIRST_PAGE;
        }

        const options = this.getOptions();
        const table: HTMLElement = this.host.shadowRoot.querySelector(
            '#tabulator-table'
        );
        this.tabulator = new TabulatorTable(table, options);
    }

    @Watch('data')
    public updateData(newData = [], oldData = []) {
        if (this.resolver) {
            this.setResolvedData(this.data);
            this.resolver = null;

            return;
        }

        if (isEqual(newData, oldData)) {
            return;
        }

        this.tabulator.setData(this.data);
    }

    @Watch('columns')
    public updateColumns() {
        this.tabulator.setColumns(this.getColumnDefinitions());
    }

    private getOptions(): Tabulator.Options {
        const ajaxOptions = this.getAjaxOptions();
        const paginationOptions = this.getPaginationOptions();

        return {
            data: this.data,
            layout: 'fitDataFill',
            columns: this.getColumnDefinitions(),
            dataSorting: this.handleDataSorting,
            pageLoaded: this.handlePageLoaded,
            ...ajaxOptions,
            ...paginationOptions,
        };
    }

    private getColumnDefinitions(): Tabulator.ColumnDefinition[] {
        return this.columns.map(createColumnDefinition);
    }

    private getAjaxOptions(): Tabulator.OptionsData {
        if (!this.isRemoteMode()) {
            return {};
        }

        // Tabulator needs a URL to be set, even though this one will never be
        // used since we have our own custom `ajaxRequestFunc`
        const remoteUrl = 'https://localhost';

        return {
            ajaxSorting: true,
            ajaxURL: remoteUrl,
            ajaxRequestFunc: this.requestData,
        };
    }

    private getPaginationOptions(): Tabulator.OptionsPagination {
        if (!this.pageSize) {
            return {};
        }

        return {
            pagination: this.isRemoteMode() ? 'remote' : 'local',
            paginationSize: this.pageSize,
            paginationInitialPage: this.currentPage,
        };
    }

    private requestData(_, __, params: any): Promise<object[]> {
        const promise = new Promise<object[]>((resolve) => {
            this.resolver = resolve;
        });

        const sorters = params.sorters;
        const currentPage = params.page;
        const columnSorters = sorters.map(createColumnSorter(this.columns));

        this.currentPage = currentPage;
        this.load.emit({
            page: this.currentPage,
            sorters: columnSorters,
        });

        return promise;
    }

    private isRemoteMode(): boolean {
        return this.mode === 'remote';
    }

    private handleDataSorting(sorters: Tabulator.Sorter[]): void {
        if (this.isRemoteMode()) {
            return;
        }

        const columnSorters = sorters.map(createColumnSorter(this.columns));
        if (columnSorters.length === 0) {
            return;
        }

        this.sort.emit(columnSorters);
    }

    private handlePageLoaded(page: number): void {
        if (this.isRemoteMode()) {
            return;
        }

        this.changePage.emit(page);
    }

    private setResolvedData(data: object[]): void {
        if (this.pageSize) {
            this.resolver({
                last_page: this.calculatePageCount(), // eslint-disable-line camelcase
                data: data,
            });
        } else {
            this.resolver(data);
        }
    }

    private calculatePageCount(): number {
        let total = this.totalRows;
        if (!total) {
            total = this.data.length;
        }

        return Math.ceil(total / this.pageSize);
    }

    render() {
        return <div id="tabulator-table" />;
    }
}
