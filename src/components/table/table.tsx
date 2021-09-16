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
 * @exampleComponent limel-example-table-header-menu
 * @exampleComponent limel-example-table-movable-columns
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
     * Set to `true` to enable reordering of the columns by dragging them
     */
    @Prop()
    public movableColumns: boolean;

    /**
     * Set to `true` to trigger loading animation
     */
    @Prop()
    public loading: boolean = false;

    /**
     * The page to show
     */
    @Prop()
    public page: number = FIRST_PAGE;

    /**
     * Emitted when `mode` is `local` the data is sorted
     */
    @Event()
    public sort: EventEmitter<ColumnSorter[]>;

    /**
     * Emitted when a new page has been set
     */
    @Event()
    public changePage: EventEmitter<number>;

    /**
     * A message to display when the table has no data
     */
    @Prop()
    public emptyMessage: string;

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

    /**
     * Emitted when the columns have been changed
     */
    @Event()
    public changeColumns: EventEmitter<Column[]>;

    @Element()
    private host: HTMLLimelTableElement;

    private currentLoad: { page: number; sorters: ColumnSorter[] };

    private tabulator: Tabulator;

    private pool: ElementPool;
    private columnFactory: ColumnDefinitionFactory;
    private firstRequest: boolean;
    private currentSorting: ColumnSorter[];

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
        this.init();
    }

    public disconnectedCallback() {
        this.pool.clear();
    }

    @Watch('totalRows')
    public totalRowsChanged() {
        this.updateMaxPage();
    }

    @Watch('pageSize')
    public pageSizeChanged() {
        this.updateMaxPage();
    }

    @Watch('page')
    public pageChanged() {
        if (!this.tabulator) {
            return;
        }

        if (this.tabulator.getPage() === this.page) {
            return;
        }

        this.tabulator.setPage(this.page);
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
        if (isEqual(newData, oldData)) {
            return;
        }

        this.pool.releaseAll();
        setTimeout(() => {
            if (!this.tabulator) {
                return;
            }

            this.tabulator.replaceData(this.data);
        });
    }

    @Watch('columns')
    public updateColumns(newColumns: Column[], oldColumns: Column[]) {
        if (!this.tabulator) {
            return;
        }

        if (this.areSameColumns(newColumns, oldColumns)) {
            return;
        }

        const existingColumns = this.tabulator
            .getColumns()
            .map(this.findColumn);

        if (this.areSameColumns(newColumns, existingColumns)) {
            return;
        }

        // Updating columns requires a reinitialization otherwise sorting will not work
        // afterwards
        this.init();
    }

    private areSameColumns(newColumns: Column[], oldColumns: Column[]) {
        return (
            newColumns.length === oldColumns.length &&
            newColumns.every((column) => oldColumns.includes(column))
        );
    }

    private init() {
        if (this.tabulator) {
            this.pool.releaseAll();
            this.tabulator.destroy();
        }

        const options = this.getOptions();
        const table: HTMLElement =
            this.host.shadowRoot.querySelector('#tabulator-table');

        this.initTabulatorComponent(table, options);
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
        const columnOptions = this.getColumnOptions();

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
            ...columnOptions,
        };
    }

    private getColumnSorter(): Tabulator.Sorter[] {
        const sorting = this.currentSorting ?? this.sorting;

        return sorting.map((sorter: ColumnSorter) => {
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

    /*
     * The ajaxRequesting callback is triggered when ever an ajax request is made.
     *
     * Tabulator is requesting data with an AJAX request even though it has been
     * given data when it was created.
     *
     * It seems unnecessary for us to emit the `load` event as well when this
     * happens, since we can just initialize the table with the data that has been
     * given to us. Therefore, we abort the request if:
     *
     *  * its the first time this method is called and,
     *  * data has been sent in to the component as a prop
     *
     */
    private handleAjaxRequesting() {
        const abortRequest = this.firstRequest && !!this.data?.length;
        this.firstRequest = false;

        if (abortRequest) {
            setTimeout(() => {
                this.updateMaxPage();
                this.tabulator.replaceData(this.data);
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
            paginationInitialPage: this.page,
        };
    }

    private requestData(_, __, params: any): Promise<object> {
        const sorters = params.sorters;
        const currentPage = params.page;

        if (this.page !== currentPage) {
            this.changePage.emit(currentPage);
        }

        const columnSorters = sorters.map(createColumnSorter(this.columns));

        const load = {
            page: currentPage,
            sorters: columnSorters,
        };

        // In order to make limel-table behave more like a controlled component,
        // we always return the existing data from this function, therefore
        // relying on the consumer component to handle the loading
        // state via the loading prop, if it actually decides to load new data.
        const resolveExistingData = Promise.resolve({
            last_page: this.calculatePageCount(), // eslint-disable-line camelcase
            data: this.data,
        });

        if (isEqual(this.currentLoad, load)) {
            return resolveExistingData;
        }

        this.currentSorting = columnSorters;
        this.currentLoad = load;
        this.load.emit(load);

        return resolveExistingData;
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

    private getColumnOptions = (): Tabulator.OptionsColumns => {
        if (!this.movableColumns) {
            return {};
        }

        return {
            movableColumns: true,
            columnMoved: this.handleMoveColumn,
        };
    };

    private handleMoveColumn = (_, components: Tabulator.ColumnComponent[]) => {
        const columns = components.map(this.findColumn);
        this.changeColumns.emit(columns);
    };

    private findColumn = (component: Tabulator.ColumnComponent): Column => {
        return this.columns.find((column) => {
            return (
                column.field === component.getField() &&
                column.title === component.getDefinition().title
            );
        });
    };

    render() {
        return (
            <div id="tabulator-container">
                {/* Toggle style instead of removing the loader
                    because removing the element will cause a rerender, breaking the
                    tabulator table */}
                <div
                    id="tabulator-loader"
                    style={{ display: this.loading ? 'flex' : 'none' }}
                >
                    <limel-spinner size="large" />
                </div>
                {this.renderEmptyMessage()}
                <div
                    id="tabulator-table"
                    class={{
                        'has-pagination': this.totalRows > this.pageSize,
                        'has-aggregation': this.hasAggregation(this.columns),
                        'has-movable-columns': this.movableColumns,
                    }}
                />
            </div>
        );
    }

    private renderEmptyMessage() {
        const showEmptyMessage =
            !this.loading && !this.data.length && this.emptyMessage;

        return (
            <div
                id="tabulator-empty-text"
                style={{ display: showEmptyMessage ? 'flex' : 'none' }}
            >
                <span>{this.emptyMessage}</span>
            </div>
        );
    }
}
