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
import { ColumnDefinitionFactory, createColumnSorter } from './columns';
import { isEqual, has } from 'lodash-es';
import { ElementPool } from './element-pool';

const FIRST_PAGE = 1;

/**
 * @exampleComponent limel-example-table
 * @exampleComponent limel-example-table-custom-components
 * @exampleComponent limel-example-table-local
 * @exampleComponent limel-example-table-remote
 * @exampleComponent limel-example-table-activate-row
 * @exampleComponent limel-example-table-default-sorted
 * @exampleComponent limel-example-table-low-density
 */
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
     * The initial sorted columns
     */

    @Prop()
    public sorting: ColumnSorter[] = [];

    /**
     * Active row in the table
     */
    @Prop({ mutable: true })
    public activeRow: object;

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

    /**
     * Emitted when a row is activated
     */
    @Event()
    public activate: EventEmitter<object>;

    @Element()
    private host: HTMLLimelTableElement;

    private currentPage: number;

    private tabulator: Tabulator;

    private resolver: (data: any) => void;

    private pool: ElementPool;
    private columnFactory: ColumnDefinitionFactory;
    private firstRequest: boolean;

    constructor() {
        this.handleDataSorting = this.handleDataSorting.bind(this);
        this.handlePageLoaded = this.handlePageLoaded.bind(this);
        this.handleAjaxRequesting = this.handleAjaxRequesting.bind(this);
        this.requestData = this.requestData.bind(this);
        this.onClickRow = this.onClickRow.bind(this);
        this.formatRow = this.formatRow.bind(this);
        this.updateMaxPage = this.updateMaxPage.bind(this);
        this.initTabulatorComponent = this.initTabulatorComponent.bind(this);
        this.pool = new ElementPool(document);
        this.columnFactory = new ColumnDefinitionFactory(this.pool);
    }

    public componentWillLoad() {
        this.firstRequest = this.mode === 'remote';
    }

    public componentDidLoad() {
        if (this.pageSize) {
            this.currentPage = FIRST_PAGE;
        }

        const options = this.getOptions();
        const table: HTMLElement = this.host.shadowRoot.querySelector(
            '#tabulator-table'
        );

        this.initTabulatorComponent(table, options);
    }

    public disconnectedCallback() {
        this.pool.clear();
    }

    @Watch('activeRow')
    public activeRowChanged() {
        if (!this.tabulator) {
            return;
        }

        this.tabulator.getRows().forEach(this.formatRow);
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

        this.pool.releaseAll();
        setTimeout(() => {
            if (!this.tabulator) {
                return;
            }

            this.tabulator.setData(this.data);
        });
    }

    @Watch('columns')
    public updateColumns() {
        if (!this.tabulator) {
            return;
        }

        this.tabulator.setColumns(this.getColumnDefinitions());
    }

    /*
     * Tabulator requires that the html element it's rendered inside
     * has a size before it's created, otherwise it doesn't consider
     * it self renderedy completely. (the callback "renderComplete"
     * is never run).
     *
     * @param table {HTMLElement}
     * @param options {Tabulator.Options}
     *
     * @returns {void}
     */
    private initTabulatorComponent(
        table: HTMLElement,
        options: Tabulator.Options
    ) {
        // Some browsers do not implement the ResizeObserver API...
        // If that's the case lets just create the table no
        // matter if its rendered or not.
        if (!('ResizeObserver' in window)) {
            this.tabulator = new TabulatorTable(table, options);

            return;
        }

        const observer = new ResizeObserver(() => {
            this.tabulator = new TabulatorTable(table, options);
            observer.unobserve(table);
        });
        observer.observe(table);
    }

    private updateMaxPage() {
        this.tabulator?.setMaxPage(this.calculatePageCount());
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
            rowClick: this.onClickRow,
            rowFormatter: this.formatRow,
            initialSort: this.getColumnSorter(),
            dataLoaded: this.updateMaxPage,
            dataFiltered: this.updateMaxPage,
            nestedFieldSeparator: false,
        };
    }

    private getColumnSorter(): Tabulator.Sorter[] {
        return this.sorting.map((sorter: ColumnSorter) => {
            return {
                column: String(sorter.column.field),
                dir: sorter.direction.toLocaleLowerCase() as Tabulator.SortDirection,
            };
        });
    }

    private getColumnDefinitions(): Tabulator.ColumnDefinition[] {
        return this.columns.map(this.columnFactory.create);
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
            ajaxRequesting: this.handleAjaxRequesting,
        };
    }

    private handleAjaxRequesting() {
        const abortRequest = this.firstRequest && !!this.data?.length;
        this.firstRequest = false;

        if (abortRequest) {
            setTimeout(() => {
                this.updateMaxPage();
                this.tabulator.setData(this.data);
            });

            return false;
        }

        return true;
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

    private onClickRow(_, row: Tabulator.RowComponent): void {
        if (this.activeRow === row.getData()) {
            this.activeRow = null;
        } else {
            this.activeRow = row.getData();
        }

        this.activate.emit(this.activeRow);
    }

    private formatRow(row: Tabulator.RowComponent) {
        if (this.activeRow === row.getData()) {
            row.getElement().classList.add('active');
        } else {
            row.getElement().classList.remove('active');
        }
    }

    private setResolvedData(data: object[]): void {
        this.pool.releaseAll();
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

    private hasAggregation(columns: Column[]): boolean {
        return columns.some((column) => has(column, 'aggregator'));
    }

    render() {
        return (
            <div id="tabulator-container">
                <div
                    id="tabulator-table"
                    class={{
                        'has-pagination': this.totalRows > this.pageSize,
                        'has-aggregation': this.hasAggregation(this.columns),
                    }}
                />
            </div>
        );
    }
}
