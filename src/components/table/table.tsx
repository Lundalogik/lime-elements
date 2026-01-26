import {
    Component,
    h,
    Prop,
    Element,
    Watch,
    EventEmitter,
    Event,
    Host,
} from '@stencil/core';
import {
    TabulatorFull,
    Tabulator,
    Options as TabulatorOptions,
    Sorter as TabulatorSorter,
    SorterFromTable as TabulatorSorterFromTable,
    SortDirection as TabulatorSortDirection,
    ColumnComponent as TabulatorColumnComponent,
    ColumnDefinition as TabulatorColumnDefinition,
    RowComponent as TabulatorRowComponent,
    OptionsData as TabulatorOptionsData,
    OptionsPagination as TabulatorOptionsPagination,
    OptionsColumns as TabulatorOptionsColumns,
} from 'tabulator-tables';
import {
    Column,
    TableParams,
    ColumnSorter,
    ColumnAggregate,
    RowData,
} from './table.types';
import { ColumnDefinitionFactory, createColumnSorter } from './columns';
import { isEqual, has } from 'lodash-es';
import { ElementPool } from './element-pool';
import { TableSelection } from './table-selection';
import { _mapLayout, Layout } from './layout';
import { areRowsEqual } from './utils';
import { Languages } from '../date-picker/date.types';
import translate from '../../global/translations';

const FIRST_PAGE = 1;

/**
 * @exampleComponent limel-example-table
 * @exampleComponent limel-example-table-custom-components
 * @exampleComponent limel-example-table-header-menu
 * @exampleComponent limel-example-table-movable-columns
 * @exampleComponent limel-example-table-sorting-disabled
 * @exampleComponent limel-example-table-pagination
 * @exampleComponent limel-example-table-local
 * @exampleComponent limel-example-table-remote
 * @exampleComponent limel-example-table-activate-row
 * @exampleComponent limel-example-table-selectable-rows
 * @exampleComponent limel-example-table-default-sorted
 * @exampleComponent limel-example-table-layout-default
 * @exampleComponent limel-example-table-layout-stretch-last-column
 * @exampleComponent limel-example-table-layout-stretch-columns
 * @exampleComponent limel-example-table-layout-low-density
 * @exampleComponent limel-example-table-interactive-rows
 */
@Component({
    tag: 'limel-table',
    styleUrl: 'table.scss',
    shadow: true,
})
export class Table {
    /**
     * Data to be displayed in the table. Provide a stable `id` on each row to keep
     * scroll position, focus, and selections intact across updates.
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
     * Defines the layout of the table, based on how width of the columns are calculated.
     *
     * - `default`: makes columns as wide as their contents.
     * - `stretchLastColumn`: makes columns as wide as their contents, stretch the last column to fill up the remaining table width.
     * - `stretchColumns`: stretches all columns to fill the available width when possible.
     * - `lowDensity`: makes columns as wide as their contents, and creates a low density and airy layout.
     */
    @Prop()
    public layout: Layout;

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
    public activeRow: RowData;

    /**
     * Set to `true` to enable reordering of the columns by dragging them
     */
    @Prop()
    public movableColumns: boolean;

    /**
     * Set to `false` to disable column sorting through header interactions.
     * Programmatic sorting through the `sorting` prop and `sort` event remains available.
     */
    @Prop()
    public sortableColumns: boolean = true;

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
     * Column aggregates to be displayed in the table
     */
    @Prop()
    public aggregates: ColumnAggregate[];

    /**
     * Enables row selection
     */
    @Prop()
    public selectable: boolean;

    /**
     * Selected data. Requires `selectable` to be true.
     */
    @Prop()
    public selection: object[];

    /**
     * Defines the language for translations.
     */
    @Prop({ reflect: true })
    public language: Languages = 'en';

    /**
     * Location of the pagination controls.
     * - `top`: Display pagination controls at the top of the table
     * - `bottom`: Display pagination controls at the bottom of the table (default)
     */
    @Prop({ reflect: true })
    public paginationLocation: 'top' | 'bottom' = 'bottom';

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

    /**
     * Emitted when the row selection has been changed
     */
    @Event()
    public select: EventEmitter<object[]>;

    /**
     * Emitted when the select all rows state is toggled
     */
    @Event()
    public selectAll: EventEmitter<boolean>;

    @Element()
    private host: HTMLLimelTableElement;

    private currentLoad: { page: number; sorters: ColumnSorter[] };

    private tabulator: Tabulator;

    private pool: ElementPool;
    private columnFactory: ColumnDefinitionFactory;
    private initialized = false;
    private destroyed = false;
    private resizeObserver: ResizeObserver;
    private currentSorting: ColumnSorter[];
    private tableSelection: TableSelection;
    private shouldSort = false;

    constructor() {
        this.handleDataSorting = this.handleDataSorting.bind(this);
        this.handlePageLoaded = this.handlePageLoaded.bind(this);
        this.handleRenderComplete = this.handleRenderComplete.bind(this);
        this.handleAjaxRequesting = this.handleAjaxRequesting.bind(this);
        this.requestData = this.requestData.bind(this);
        this.onClickRow = this.onClickRow.bind(this);
        this.formatRow = this.formatRow.bind(this);
        this.formatRows = this.formatRows.bind(this);
        this.updateMaxPage = this.updateMaxPage.bind(this);
        this.initTabulatorComponent = this.initTabulatorComponent.bind(this);
        this.setSelection = this.setSelection.bind(this);
        this.addColumnAggregator = this.addColumnAggregator.bind(this);
        this.pool = new ElementPool(document);
        this.columnFactory = new ColumnDefinitionFactory(this.pool);
    }

    public componentWillLoad() {
        this.initTableSelection();
    }

    public componentDidLoad() {
        this.destroyed = false;
        this.init();
    }

    public disconnectedCallback() {
        this.destroyed = true;
        this.initialized = false;

        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }

        if (this.tabulator) {
            this.tabulator.destroy();
            this.tabulator = null;
        }

        this.pool.clear();
    }

    @Watch('totalRows')
    protected totalRowsChanged() {
        this.updateMaxPage();
    }

    @Watch('pageSize')
    protected pageSizeChanged() {
        this.updateMaxPage();
    }

    @Watch('page')
    protected pageChanged() {
        if (!this.tabulator) {
            return;
        }

        if (this.tabulator.getPage() === this.page) {
            return;
        }

        this.tabulator.setPage(this.page);
    }

    @Watch('activeRow')
    protected activeRowChanged() {
        if (!this.tabulator) {
            return;
        }

        this.formatRows();
    }

    @Watch('data')
    protected updateData(newData: RowData[] = [], oldData: RowData[] = []) {
        const newIds = this.getRowIds(newData);
        const oldIds = this.getRowIds(oldData);
        const shouldReplace = this.shouldReplaceData(newIds, oldIds);
        const hasRowUpdates = !areRowsEqual(newData, oldData);

        setTimeout(() => {
            if (!this.tabulator || !this.initialized) {
                return;
            }

            if (shouldReplace) {
                this.pool.releaseAll();
                this.tabulator.replaceData(newData);
                this.setSelection();

                return;
            }

            if (hasRowUpdates) {
                this.tabulator.updateData(newData);
                this.setSelection();

                return;
            }

            if (newData.length > 0) {
                this.tabulator.updateOrAddData(newData);
            }
        });
    }

    @Watch('columns')
    protected updateColumns(newColumns: Column[], oldColumns: Column[]) {
        if (!this.tabulator) {
            return;
        }

        if (this.areSameColumns(newColumns, oldColumns)) {
            return;
        }

        const columnsInTable = this.tabulator
            .getColumns()
            .filter((c) => c.getField());

        const oldColumnsInTable = columnsInTable.map((c) =>
            oldColumns.find((old) => old.field === c.getField())
        );

        if (this.areSameColumns(newColumns, oldColumnsInTable)) {
            return;
        }

        this.tabulator.setColumns(this.getColumnDefinitions());
        this.shouldSort = true;
    }

    @Watch('aggregates')
    protected updateAggregates(
        newAggregates: ColumnAggregate[],
        oldAggregates: ColumnAggregate[]
    ) {
        if (!this.tabulator) {
            return;
        }

        if (isEqual(newAggregates, oldAggregates)) {
            return;
        }

        if (!this.haveSameAggregateFields(newAggregates, oldAggregates)) {
            this.init();

            return;
        }

        this.tabulator.recalc();
        this.tabulator.rowManager.redraw();
    }

    @Watch('selection')
    protected updateSelection(newSelection: any[]) {
        if (!this.tableSelection) {
            return;
        }

        this.tableSelection.setSelection(newSelection);
    }

    @Watch('selectable')
    protected updateSelectable() {
        if (this.tableSelection && !this.selectable) {
            this.tableSelection = null;
        }

        this.initTableSelection();
        this.init();
    }

    @Watch('sortableColumns')
    protected updateSortableColumns() {
        if (!this.tabulator) {
            return;
        }

        this.tabulator.setColumns(this.getColumnDefinitions());
        this.shouldSort = true;
    }

    @Watch('sorting')
    protected updateSorting(
        newValue: ColumnSorter[],
        oldValue: ColumnSorter[]
    ) {
        const newSorting = this.getColumnSorter(newValue);
        const oldSorting = this.getColumnSorter(oldValue);
        if (isEqual(newSorting, oldSorting)) {
            return;
        }

        this.tabulator.setSort(newSorting);
    }

    private shouldReplaceData(
        newIds: Array<string | number>,
        oldIds: Array<string | number>
    ) {
        return (
            !this.areEqualIds(newIds, oldIds) ||
            !this.isSameOrder(newIds, oldIds)
        );
    }

    private getRowIds(data: RowData[]): Array<string | number> {
        return data.map((item) => item.id ?? item) as Array<string | number>;
    }

    private areEqualIds(
        newIds: Array<string | number>,
        oldIds: Array<string | number>
    ): boolean {
        const newIdSet = new Set(newIds);
        const oldIdSet = new Set(oldIds);

        return (
            newIdSet.size === oldIdSet.size &&
            newIds.every((id) => oldIdSet.has(id))
        );
    }

    private isSameOrder(
        newIds: Array<string | number>,
        oldIds: Array<string | number>
    ): boolean {
        return newIds.every((id, index) => id === oldIds[index]);
    }

    private areSameColumns(newColumns: Column[], oldColumns: Column[]) {
        return (
            newColumns.length === oldColumns.length &&
            newColumns.every((column) => oldColumns.includes(column))
        );
    }

    private haveSameAggregateFields(
        newAggregates: ColumnAggregate[],
        oldAggregates: ColumnAggregate[]
    ) {
        const oldAggregateFields = oldAggregates?.map((a) => a.field) || [];

        return (
            newAggregates?.length === oldAggregates?.length &&
            !!newAggregates?.every((a) => oldAggregateFields.includes(a.field))
        );
    }

    private init() {
        if (this.tabulator) {
            this.pool.releaseAll();
            this.tabulator.destroy();
            this.initialized = false;
        }

        const table: HTMLElement =
            this.host.shadowRoot.querySelector('#tabulator-table');
        this.initTabulatorComponent(table);
    }

    /*
     * Tabulator requires that the html element it's rendered inside
     * has a size before it's created, otherwise it doesn't consider
     * it self renderedy completely. (the callback "renderComplete"
     * is never run).
     *
     * @param table {HTMLElement}
     *
     */
    private initTabulatorComponent(table: HTMLElement) {
        // Some browsers do not implement the ResizeObserver API...
        // If that's the case lets just create the table no
        // matter if its rendered or not.
        if (!('ResizeObserver' in window)) {
            this.tabulator = this.createTabulator(table);
            this.setSelection();

            return;
        }

        this.resizeObserver = new ResizeObserver(() => {
            requestAnimationFrame(() => {
                if (this.destroyed) {
                    return;
                }

                this.tabulator = this.createTabulator(table);
                this.setSelection();
                this.resizeObserver?.unobserve(table);
                this.resizeObserver?.disconnect();
            });
        });
        this.resizeObserver.observe(table);
    }

    private createTabulator(table: HTMLElement): Tabulator {
        const tabulator = new TabulatorFull(table, this.getOptions());
        tabulator.on('rowClick', this.onClickRow);
        tabulator.on('dataSorting', this.handleDataSorting);
        tabulator.on('pageLoaded', this.handlePageLoaded);
        tabulator.on('columnMoved', this.handleMoveColumn);
        tabulator.on('renderComplete', this.handleRenderComplete);
        tabulator.on('tableBuilt', () => {
            if (this.destroyed) {
                tabulator.destroy();

                return;
            }

            this.initialized = true;
            if (this.isRemoteMode() && !this.data?.length) {
                this.tabulator.setData();
            } else if (!this.isRemoteMode()) {
                this.updateData(this.data, []);
            }
        });

        return tabulator;
    }

    private initTableSelection() {
        if (this.selectable) {
            this.tableSelection = new TableSelection(
                () => this.tabulator,
                this.pool,
                this.select,
                (key: string) => this.getTranslation(key)
            );
            this.tableSelection.setSelection(this.selection);
        }
    }

    private setSelection() {
        if (!(this.tabulator && this.tableSelection)) {
            return;
        }

        this.tableSelection.setSelection(this.selection);
    }

    private updateMaxPage() {
        this.tabulator?.setMaxPage(this.calculatePageCount());
    }

    private getOptions(): TabulatorOptions {
        const ajaxOptions = this.getAjaxOptions();
        const paginationOptions = this.getPaginationOptions();
        const columnOptions = this.getColumnOptions();

        return {
            data: this.data,
            layout: _mapLayout(this.layout),
            columns: this.getColumnDefinitions(),
            ...ajaxOptions,
            ...paginationOptions,
            rowFormatter: this.formatRow,
            initialSort: this.getInitialSorting(),
            nestedFieldSeparator: false,
            ...columnOptions,
        };
    }

    private getInitialSorting(): TabulatorSorter[] {
        if (this.currentSorting && this.currentSorting.length > 0) {
            return this.getColumnSorter(this.currentSorting);
        }

        return this.getColumnSorter(this.sorting);
    }

    private getColumnSorter(sorting: ColumnSorter[]): TabulatorSorter[] {
        return sorting.map((sorter: ColumnSorter) => {
            return {
                column: String(sorter.column.field),
                dir: sorter.direction.toLocaleLowerCase() as TabulatorSortDirection,
            };
        });
    }

    private getColumnDefinitions(): TabulatorColumnDefinition[] {
        const columnDefinitions = this.columns
            .map(this.addColumnAggregator)
            .map((column) => {
                const definition = this.columnFactory.create(column);
                const columnSortable = column.headerSort ?? true;
                definition.headerSort = this.sortableColumns && columnSortable;

                return definition;
            });

        if (this.tableSelection) {
            return this.tableSelection.getColumnDefinitions(columnDefinitions);
        }

        return columnDefinitions;
    }

    private addColumnAggregator(column: Column<any>): Column<any> {
        if (!this.aggregates?.length || column.aggregator) {
            return column;
        }

        const aggregate = this.aggregates.find((a) => a.field === column.field);
        if (aggregate) {
            column.aggregator = (col?: Column) => {
                if (!col) {
                    return;
                }

                const value = this.aggregates.find(
                    (a) => a.field === col.field
                )?.value;

                if (col.formatter) {
                    return col.formatter(value);
                }

                return value;
            };
        }

        return column;
    }

    private getAjaxOptions(): TabulatorOptionsData {
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
        return !this.destroyed;
    }

    private getPaginationOptions(): TabulatorOptionsPagination {
        if (!this.pageSize) {
            return {};
        }

        return {
            pagination: true,
            paginationMode: this.isRemoteMode() ? 'remote' : 'local',
            paginationSize: this.pageSize,
            paginationInitialPage: this.page,
        };
    }

    private requestData(_, __, params: any): Promise<object> {
        if (this.destroyed) {
            return Promise.reject();
        }

        const sorters = params.sorters ?? [];
        const currentPage = params.page ?? FIRST_PAGE;

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
            last_page: this.calculatePageCount(),
            data: this.data,
        });

        if (!isEqual(this.currentLoad, load)) {
            this.currentSorting = columnSorters;
            this.currentLoad = load;
            this.load.emit(load);
        }

        return resolveExistingData;
    }

    private isRemoteMode(): boolean {
        return this.mode === 'remote';
    }

    private handleDataSorting(sorters: TabulatorSorterFromTable[]): void {
        const columnSorters = sorters.map(createColumnSorter(this.columns));

        if (this.isRemoteMode()) {
            const tabulatorPage = this.tabulator?.getPage?.();
            const currentPage =
                typeof tabulatorPage === 'number' ? tabulatorPage : this.page;
            const load = {
                page: currentPage ?? FIRST_PAGE,
                sorters: columnSorters,
            };

            if (!isEqual(this.currentLoad, load)) {
                this.currentSorting = columnSorters;
                this.currentLoad = load;
                this.load.emit(load);
            }

            return;
        }

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

    private handleRenderComplete(): void {
        if (this.tabulator && this.shouldSort) {
            this.shouldSort = false;
            this.tabulator.setSort(this.getInitialSorting());
        }
    }

    private onClickRow(event: PointerEvent, row: TabulatorRowComponent): void {
        if (row.getPosition === undefined) {
            // Not a data row, probably a CalcComponent
            return;
        }

        if (event.defaultPrevented) {
            return;
        }

        if (this.isActiveRow(row)) {
            this.activeRow = null;
        } else {
            this.activeRow = row.getData();
        }

        this.activate.emit(this.activeRow);
    }

    private readonly getActiveRows: () => TabulatorRowComponent[] = () => {
        if (!this.tabulator) {
            return [];
        }

        return this.tabulator.getRows('active');
    };

    private getActiveRowsData: () => object[] = () => {
        // Note: Tabulator.getData() creates copies of each data object
        // and will break this.selection.has checks, hence why this function
        // intentionally retrieves the data using the row components
        return this.getActiveRows().map((row) => row.getData());
    };

    private selectAllOnChange = (ev: CustomEvent<boolean>) => {
        const selectAll = ev.detail;

        ev.stopPropagation();
        ev.preventDefault();

        const newSelection = selectAll ? this.getActiveRowsData() : [];
        this.select.emit(newSelection);
        this.tableSelection.setSelection(newSelection);
        this.selectAll.emit(selectAll);
    };

    private formatRows() {
        // eslint-disable-next-line unicorn/no-array-for-each
        this.tabulator.getRows().forEach(this.formatRow);
    }

    private formatRow(row: TabulatorRowComponent) {
        if (this.isActiveRow(row)) {
            row.getElement().classList.add('active');
        } else {
            row.getElement().classList.remove('active');
        }

        const interactiveFeedbackElement = row
            .getElement()
            .querySelectorAll('.interactive-feedback');
        if (interactiveFeedbackElement.length === 0) {
            const element = row.getElement().ownerDocument.createElement('div');
            element.classList.add('interactive-feedback');
            row.getElement().prepend(element);
        }
    }

    private isActiveRow(row: TabulatorRowComponent) {
        if (!this.activeRow) {
            return false;
        }

        const activeRowId = this.activeRow.id ?? null;

        if (activeRowId !== null) {
            return activeRowId === row.getData().id;
        }

        return this.activeRow === row.getData();
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

    private readonly getColumnOptions = (): TabulatorOptionsColumns => {
        if (!this.movableColumns) {
            return {};
        }

        return {
            movableColumns: true,
        };
    };

    private readonly handleMoveColumn = (
        _,
        components: TabulatorColumnComponent[]
    ) => {
        if (!this.movableColumns) {
            return;
        }

        const columns = components.map(this.findColumn).filter(Boolean);
        this.changeColumns.emit(columns);
    };

    private readonly findColumn = (
        component: TabulatorColumnComponent
    ): Column => {
        return this.columns.find((column) => {
            return (
                column.field === component.getField() &&
                column.title === component.getDefinition().title
            );
        });
    };

    render() {
        const totalRows = this.totalRows ?? this.data.length;

        return (
            <Host
                class={{
                    'has-low-density': this.layout === 'lowDensity',
                    'has-pagination-on-top': this.paginationLocation === 'top',
                }}
            >
                <div
                    id="tabulator-container"
                    class={{
                        'has-pagination': totalRows > this.pageSize,
                        'has-aggregation': this.hasAggregation(this.columns),
                        'has-movable-columns': this.movableColumns,
                        'has-rowselector': this.selectable,
                        'has-selection': this.tableSelection?.hasSelection,
                    }}
                >
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
                    {this.renderSelectAll()}
                    <div id="tabulator-table" />
                </div>
            </Host>
        );
    }

    private renderSelectAll() {
        if (!this.selectable) {
            return;
        }

        const showSelectAll = !this.loading && this.tableSelection;

        return (
            <div
                class="select-all"
                style={{ display: showSelectAll ? 'inline-block' : 'none' }}
            >
                <limel-checkbox
                    class="hide-label"
                    onChange={this.selectAllOnChange}
                    disabled={this.data.length === 0}
                    checked={this.tableSelection?.hasSelection}
                    indeterminate={
                        this.tableSelection?.hasSelection &&
                        this.selection?.length < this.data.length
                    }
                    label={this.getTranslation('table.select-all')}
                />
            </div>
        );
    }

    private renderEmptyMessage() {
        const showEmptyMessage =
            !this.loading && this.data.length === 0 && this.emptyMessage;

        return (
            <div
                id="tabulator-empty-text"
                style={{ display: showEmptyMessage ? 'flex' : 'none' }}
            >
                <span>{this.emptyMessage}</span>
            </div>
        );
    }

    private getTranslation = (key: string) => {
        return translate.get(key, this.language);
    };
}
