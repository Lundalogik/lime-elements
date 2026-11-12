import {
    Component,
    h,
    Prop,
    Watch,
    EventEmitter,
    Event,
    Host,
    State,
    forceUpdate,
} from '@stencil/core';
import { isEqual } from 'lodash-es';
import {
    Column,
    TableParams,
    ColumnSorter,
    ColumnAggregate,
    RowData,
    RowReorderEvent,
} from './table.types';
import { Layout } from './layout';
import { Selection } from './selection';
import {
    CellView,
    ComponentView,
    createCellView,
    createHeaderView,
    readsTheWholeRow,
    toAggregateText,
} from './cells';
import { describeSorting, getNextSorting, sortRows } from './sorting';
import { getAggregatedValue, hasAggregation } from './aggregation';
import {
    createReorderEvent,
    moveItem,
    trackDrag,
    trackPointer,
} from './reorder';
import { DragToReorder, ReorderEvent } from '../../util/drag-to-reorder';
import { Languages } from '../date-picker/date.types';
import { GoToPageEvent } from '../pagination/pagination.types';
import translate from '../../global/translations';

const FIRST_PAGE = 1;
const MIN_COLUMN_WIDTH = 40;
const DEFAULT_ROOT_FONT_SIZE = 16;

const ARIA_SORT = {
    ASC: 'ascending',
    DESC: 'descending',
} as const;

const getRowId = (row: RowData) => row?.id ?? row;

type CellViewCache = WeakMap<Column, WeakMap<object, CellView>>;

const getViewsOfColumn = (cache: CellViewCache, column: Column) => {
    let views = cache.get(column);
    if (!views) {
        views = new WeakMap();
        cache.set(column, views);
    }

    return views;
};

const toWidthStyle = (
    width: number | undefined,
    rootFontSize: number
): Record<string, string> => {
    if (!width) {
        return {};
    }

    const widthInRem = `${width / rootFontSize}rem`;

    return {
        width: widthInRem,
        minWidth: widthInRem,
        maxWidth: widthInRem,
    };
};

/**
 * @exampleComponent limel-example-table-basic
 * @exampleComponent limel-example-table-custom-components
 * @exampleComponent limel-example-table-header-menu
 * @exampleComponent limel-example-table-movable-columns
 * @exampleComponent limel-example-table-movable-rows
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
    @Prop({ reflect: true })
    public mode: 'local' | 'remote' = 'local';

    /**
     * Defines the layout of the table, based on how width of the columns are calculated.
     *
     * - `default`: makes columns as wide as their contents.
     * - `stretchLastColumn`: makes columns as wide as their contents, stretch the last column to fill up the remaining table width.
     * - `stretchColumns`: stretches all columns to fill the available width when possible.
     * - `lowDensity`: makes columns as wide as their contents, and creates a low density and airy layout.
     */
    @Prop({ reflect: true })
    public layout: Layout;

    /**
     * Number of rows per page. A table in `local` mode without a `pageSize`
     * draws all its rows, so give a table with many rows a `pageSize`.
     */
    @Prop({ reflect: true })
    public pageSize: number;

    /**
     * The number of total rows available for the data
     */
    @Prop({ reflect: true })
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
    @Prop({ reflect: true })
    public movableColumns: boolean;

    /**
     * Set to `true` to enable reordering of the rows by dragging them.
     * A drag handle will be rendered at the start of each row.
     * Listen for the `reorder` event and update the `data` prop accordingly —
     * the table will not persist the new order on its own.
     */
    @Prop({ reflect: true })
    public movableRows: boolean;

    /**
     * Set to `false` to disable column sorting through header interactions.
     * Programmatic sorting through the `sorting` prop and `sort` event remains available.
     */
    @Prop({ reflect: true })
    public sortableColumns: boolean = true;

    /**
     * Set to `true` to trigger loading animation
     */
    @Prop({ reflect: true })
    public loading: boolean = false;

    /**
     * The page to show
     */
    @Prop({ reflect: true })
    public page: number = FIRST_PAGE;

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
    @Prop({ reflect: true })
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
     * Emitted when a row has been reordered via drag-and-drop.
     * The event detail describes which row was moved and where it was placed.
     * The consumer is responsible for updating the `data` prop to reflect the
     * new order; otherwise the next render will revert the row to its original
     * position.
     */
    @Event()
    public reorder: EventEmitter<RowReorderEvent<unknown>>;

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

    @State()
    private currentPage = FIRST_PAGE;

    @State()
    private currentSorting: ColumnSorter[] = [];

    @State()
    private orderedColumns: Column[] = [];

    @State()
    private columnWidths: Record<string, number> = {};

    private focusedRowId: unknown;
    private rowSelection: Selection;
    private currentLoad: TableParams;
    private scrollContainer: HTMLElement;
    private rowInTabOrder: RowData;
    private sortedRows: {
        data: RowData[];
        sorting: ColumnSorter[];
        rows: RowData[];
    };
    private aggregatedValues: {
        data: RowData[];
        aggregates: ColumnAggregate[];
        values: WeakMap<Column, unknown>;
    };
    private ignoreClick = false;
    private bodyElement?: HTMLElement;
    private rowReorder?: DragToReorder;
    private hasWarnedOnConflictingMovableAndSortable = false;
    private cellViews: CellViewCache = new WeakMap();
    private readonly warnedAbout = new Set<string>();
    private readonly awaitedComponents = new Set<string>();
    private readonly headerViews = new WeakMap<Column, ComponentView>();

    public componentWillLoad() {
        this.warnOnConflictingMovableAndSortable();
        this.currentPage = this.page ?? FIRST_PAGE;
        this.currentSorting = this.sorting ?? [];
        this.orderedColumns = this.columns ?? [];
        this.initSelection();
    }

    public componentWillRender() {
        this.leavePageThatNoLongerExists();
    }

    public componentDidRender() {
        this.putOneRowInTabOrder();
        this.setUpRowReorder();
    }

    public connectedCallback() {
        this.setUpRowReorder();
    }

    public disconnectedCallback() {
        this.rowReorder?.teardown();
    }

    public componentDidLoad() {
        if (this.isRemoteMode()) {
            this.requestLoad();

            return;
        }

        this.emitSort();
    }

    @Watch('page')
    protected pageChanged() {
        const page = this.page ?? FIRST_PAGE;
        if (page === this.currentPage) {
            return;
        }

        this.currentPage = page;
        this.scrollToTop();

        if (this.isRemoteMode()) {
            this.requestLoad();
        } else if (page === this.getShownPage()) {
            this.changePage.emit(page);
        }
    }

    @Watch('data')
    protected dataChanged(newValue: RowData[], oldValue: RowData[]) {
        const newData = newValue ?? [];
        const oldData = oldValue ?? [];
        const oldRows = new Map(oldData.map((row) => [getRowId(row), row]));

        const keptViews: CellViewCache = new WeakMap();
        for (const row of newData) {
            const oldRow = oldRows.get(getRowId(row));
            if (oldRow) {
                this.keepCellViewsThatStillHold(keptViews, row, oldRow);
            }
        }

        this.cellViews = keptViews;

        const oldIds = this.getRowsBefore(oldData).map((row) => getRowId(row));
        const hasSameLength = newData.length === oldData.length;
        const hasSameOrder =
            hasSameLength &&
            this.getRows().every(
                (row, index) => getRowId(row) === oldIds[index]
            );
        if (hasSameOrder) {
            return;
        }

        this.rowSelection?.forgetLastToggledIndex();

        const knownIds = new Set(oldIds);
        const hasSameRows =
            hasSameLength &&
            newData.every((row) => knownIds.has(getRowId(row)));
        if (!hasSameRows) {
            this.setSelection(this.selection);
        }
    }

    private getRowsBefore(oldData: RowData[]): RowData[] {
        if (this.isRemoteMode()) {
            return oldData;
        }

        const isCached =
            this.sortedRows?.data === oldData &&
            this.sortedRows.sorting === this.currentSorting;

        return isCached
            ? this.sortedRows.rows
            : sortRows(oldData, this.currentSorting);
    }

    private keepCellViewsThatStillHold(
        keptViews: CellViewCache,
        row: RowData,
        oldRow: RowData
    ) {
        const isSameObject = row === oldRow;
        if (!isSameObject && !isEqual(row, oldRow)) {
            return;
        }

        for (const column of this.orderedColumns) {
            const view = this.cellViews.get(column)?.get(oldRow);
            const isOutdated =
                isSameObject &&
                (readsTheWholeRow(column) ||
                    !isEqual(row[column.field], view?.rawValue));
            if (view && !isOutdated) {
                getViewsOfColumn(keptViews, column).set(row, view);
            }
        }
    }

    @Watch('columns')
    protected columnsChanged(newValue: Column[], oldValue: Column[]) {
        const newColumns = newValue ?? [];
        const oldColumns = oldValue ?? [];
        const isSameAsBefore =
            newColumns.length === oldColumns.length &&
            newColumns.every((column, index) => column === oldColumns[index]);
        if (isSameAsBefore) {
            return;
        }

        this.orderedColumns = newColumns;
    }

    @Watch('sorting')
    protected sortingChanged(
        newValue: ColumnSorter[],
        oldValue: ColumnSorter[]
    ) {
        const newSorting = newValue ?? [];
        const sorting = describeSorting(newSorting);
        const isSameAsBefore = isEqual(
            sorting,
            describeSorting(oldValue ?? [])
        );
        const isAlreadyApplied = isEqual(
            sorting,
            describeSorting(this.currentSorting)
        );
        if (isSameAsBefore || isAlreadyApplied) {
            return;
        }

        this.applySorting(newSorting);
    }

    @Watch('selection')
    protected selectionChanged(newSelection: RowData[]) {
        this.setSelection(newSelection);
    }

    @Watch('selectable')
    protected selectableChanged() {
        this.initSelection();
    }

    @Watch('movableRows')
    @Watch('sortableColumns')
    protected warnOnConflictingMovableAndSortable() {
        if (this.hasWarnedOnConflictingMovableAndSortable) {
            return;
        }

        if (!(this.movableRows && this.sortableColumns)) {
            return;
        }

        console.warn(
            'limel-table: combining `movableRows` with `sortableColumns` is not recommended. Sorting reorders the rows visually, so dragging a row to a new position will not match the underlying data order. Set `sortableColumns` to `false` when using `movableRows`.'
        );
        this.hasWarnedOnConflictingMovableAndSortable = true;
    }

    private isRemoteMode(): boolean {
        return this.mode === 'remote';
    }

    private getData(): RowData[] {
        return this.data ?? [];
    }

    private getRows(): RowData[] {
        const data = this.getData();
        if (this.isRemoteMode()) {
            return data;
        }

        const isCached =
            this.sortedRows?.data === data &&
            this.sortedRows.sorting === this.currentSorting;
        if (!isCached) {
            this.sortedRows = {
                data: data,
                sorting: this.currentSorting,
                rows: sortRows(data, this.currentSorting),
            };
        }

        return this.sortedRows.rows;
    }

    private warnOnce(key: string, message: string) {
        if (this.warnedAbout.has(key)) {
            return;
        }

        this.warnedAbout.add(key);
        console.warn(`limel-table: ${message}`);
    }

    private getPageSize(): number | undefined {
        if (!this.pageSize) {
            return;
        }

        if (Number.isSafeInteger(this.pageSize) && this.pageSize > 0) {
            return this.pageSize;
        }

        this.warnOnce(
            `pageSize:${this.pageSize}`,
            `\`pageSize\` has to be a whole number above 0, but is ${this.pageSize}. All rows are shown without pages.`
        );
    }

    private getTotalRows(): number | undefined {
        if (this.totalRows === undefined || this.totalRows === null) {
            return;
        }

        if (Number.isSafeInteger(this.totalRows) && this.totalRows >= 0) {
            return this.totalRows;
        }

        this.warnOnce(
            `totalRows:${this.totalRows}`,
            `\`totalRows\` has to be a whole number that is not negative, but is ${this.totalRows}. The number of rows counts as unknown.`
        );
    }

    private getRowsOnPage(): { rows: RowData[]; offset: number } {
        const rows = this.getRows();
        const pageSize = this.getPageSize();
        if (this.isRemoteMode() || !pageSize) {
            return { rows: rows, offset: 0 };
        }

        const offset = (this.getShownPage() - 1) * pageSize;

        return {
            rows: rows.slice(offset, offset + pageSize),
            offset: offset,
        };
    }

    /**
     * @returns how many rows there are in all, when that is known. A remote
     * table with a total of 0 does not know it yet, because consumers give 0
     * while they wait for the count
     */
    private getKnownTotal(): number | undefined {
        if (!this.isRemoteMode()) {
            return this.getData().length;
        }

        return this.getTotalRows() || undefined;
    }

    private getLastPage(): number | undefined {
        const pageSize = this.getPageSize();
        const total = this.getKnownTotal();
        if (!pageSize || total === undefined) {
            return;
        }

        return Math.max(FIRST_PAGE, Math.ceil(total / pageSize));
    }

    /**
     * @returns `true` when there is more than one page. While a remote table
     * does not know how many rows there are, a full page, or a page after
     * the first one, counts as a sign of more pages
     */
    private hasSeveralPages(): boolean {
        const lastPage = this.getLastPage();
        if (lastPage !== undefined) {
            return lastPage > FIRST_PAGE;
        }

        const pageSize = this.getPageSize();
        if (!pageSize) {
            return false;
        }

        return (
            this.currentPage > FIRST_PAGE || this.getData().length >= pageSize
        );
    }

    private getShownPage(): number {
        if (this.isRemoteMode()) {
            return this.currentPage;
        }

        const lastPage = this.getLastPage() ?? this.currentPage;

        return Math.min(Math.max(this.currentPage, FIRST_PAGE), lastPage);
    }

    private getTotalItems(): number | null {
        const total = this.getKnownTotal();
        if (total !== undefined) {
            return total;
        }

        return this.getData().length === 0 ? 0 : null;
    }

    private leavePageThatNoLongerExists() {
        const lastPage = this.getLastPage();
        if (lastPage === undefined || this.currentPage <= lastPage) {
            return;
        }

        const isWaitingForRows = this.isRemoteMode()
            ? this.loading
            : this.getData().length === 0;
        if (!isWaitingForRows) {
            this.goToPage(lastPage);
        }
    }

    private requestLoad() {
        const load: TableParams = {
            page: this.currentPage,
            sorters: this.getSortingToEmit(),
        };
        if (isEqual(this.currentLoad, load)) {
            return;
        }

        this.currentLoad = load;
        this.load.emit(load);
    }

    private getSortingToEmit(): ColumnSorter[] {
        return this.currentSorting.map((sorter) => ({
            column:
                (this.columns ?? []).find(
                    (column) => column.field === sorter.column.field
                ) ?? sorter.column,
            direction: sorter.direction,
        }));
    }

    private emitSort() {
        if (this.currentSorting.length > 0) {
            this.sort.emit(this.getSortingToEmit());
        }
    }

    private applySorting(sorting: ColumnSorter[]) {
        this.currentSorting = sorting;
        this.rowSelection?.forgetLastToggledIndex();

        if (!this.isRemoteMode()) {
            this.emitSort();

            return;
        }

        const wasOnAnotherPage = this.currentPage !== FIRST_PAGE;
        this.currentPage = FIRST_PAGE;
        this.scrollToTop();
        if (wasOnAnotherPage) {
            this.changePage.emit(FIRST_PAGE);
        }

        this.requestLoad();
    }

    private isSortable(column: Column): boolean {
        return this.sortableColumns && (column.headerSort ?? true);
    }

    private readonly handleHeaderClick = (
        event: MouseEvent,
        column: Column
    ) => {
        if (this.ignoreClick) {
            return;
        }

        const keepOtherColumns = event.shiftKey || event.ctrlKey;
        this.applySorting(
            getNextSorting(this.currentSorting, column, keepOtherColumns)
        );
    };

    private readonly handleGoToPage = (event: CustomEvent<GoToPageEvent>) => {
        event.stopPropagation();
        const { page, reason } = event.detail;
        if (reason === 'user' && page !== this.currentPage) {
            this.goToPage(page);
        }
    };

    private goToPage(page: number) {
        this.currentPage = page;
        this.scrollToTop();
        this.changePage.emit(page);

        if (this.isRemoteMode()) {
            this.requestLoad();
        }
    }

    private scrollToTop() {
        if (this.scrollContainer) {
            this.scrollContainer.scrollTop = 0;
        }
    }

    private initSelection() {
        if (!this.selectable) {
            this.rowSelection = undefined;
            forceUpdate(this);

            return;
        }

        this.rowSelection = new Selection((index) =>
            getRowId(this.getRows()[index])
        );
        this.setSelection(this.selection);
    }

    private setSelection(rows: RowData[] = []) {
        if (!this.rowSelection) {
            return;
        }

        const items = (rows ?? []).map((row) => getRowId(row));
        const current = this.rowSelection.items;
        const isUnchanged =
            current.length === items.length &&
            current.every((item, index) => item === items[index]);
        if (isUnchanged) {
            return;
        }

        this.rowSelection.items = items;
        forceUpdate(this);
    }

    private getSelectedRows(): RowData[] {
        const rows = new Map<unknown, RowData>();
        for (const row of [...(this.selection ?? []), ...this.getData()]) {
            rows.set(getRowId(row), row);
        }

        return this.rowSelection.items
            .map((item) => (typeof item === 'object' ? item : rows.get(item)))
            .filter((row) => !!row);
    }

    private isSelected(row: RowData): boolean {
        return !!this.rowSelection?.has(getRowId(row));
    }

    private toggleRowSelection(event: MouseEvent, index: number) {
        event.stopPropagation();
        event.preventDefault();

        if (event.shiftKey) {
            this.rowSelection.toggleSelectionFromLastIndex(index);
        } else {
            this.rowSelection.toggleSelection(index);
        }

        forceUpdate(this);
        this.select.emit(this.getSelectedRows());
    }

    private readonly handleSelectAll = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        event.preventDefault();

        const selectAll = event.detail;
        const newSelection = selectAll ? [...this.getRows()] : [];
        this.setSelection(newSelection);
        this.select.emit(newSelection);
        this.selectAll.emit(selectAll);
    };

    private isActiveRow(row: RowData): boolean {
        return !!this.activeRow && getRowId(this.activeRow) === getRowId(row);
    }

    private readonly handleBodyClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        const rowElement = target.closest?.('tr');
        if (this.ignoreClick || !rowElement?.dataset.index) {
            return;
        }

        const index = Number(rowElement.dataset.index);
        const cell = target.closest('td');
        if (cell?.classList.contains('drag')) {
            event.stopPropagation();
            event.preventDefault();

            return;
        }

        if (cell?.classList.contains('select')) {
            this.toggleRowSelection(event, index);

            return;
        }

        if (event.defaultPrevented) {
            return;
        }

        this.toggleActiveRow(this.getRows()[index]);
    };

    private toggleActiveRow(row: RowData) {
        this.activeRow = this.isActiveRow(row) ? null : row;
        this.activate.emit(this.activeRow);
    }

    private getRowOfElement(element: HTMLElement): RowData | undefined {
        if (element.tagName !== 'TR' || !element.dataset.index) {
            return;
        }

        return this.getRows()[Number(element.dataset.index)];
    }

    private readonly handleBodyFocusIn = (event: FocusEvent) => {
        const element = event.target as HTMLElement;
        const row = this.getRowOfElement(element);
        if (!row) {
            return;
        }

        this.focusedRowId = getRowId(row);
        this.rowInTabOrder = row;
        this.putOneRowInTabOrder();
    };

    private putOneRowInTabOrder() {
        const elements =
            this.scrollContainer?.querySelectorAll<HTMLElement>(
                ':scope > table > tbody > tr'
            ) ?? [];
        for (const element of elements) {
            const isInTabOrder =
                this.getRowOfElement(element) === this.rowInTabOrder;
            const tabIndex = isInTabOrder ? '0' : '-1';
            if (element.getAttribute('tabindex') !== tabIndex) {
                element.setAttribute('tabindex', tabIndex);
            }
        }
    }

    private readonly handleBodyKeyDown = (event: KeyboardEvent) => {
        const element = event.target as HTMLElement;
        const row = this.getRowOfElement(element);
        if (!row) {
            return;
        }

        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            const sibling =
                event.key === 'ArrowDown'
                    ? element.nextElementSibling
                    : element.previousElementSibling;
            (sibling as HTMLElement)?.focus();

            return;
        }

        if (!(event.key === 'Enter' || event.key === ' ')) {
            return;
        }

        event.preventDefault();
        this.toggleActiveRow(row);
    };

    private getRowInTabOrder(rows: RowData[]): RowData {
        return (
            rows.find((row) => getRowId(row) === this.focusedRowId) ??
            rows.find((row) => this.isActiveRow(row)) ??
            rows[0]
        );
    }

    private readonly handleBodyMouseDown = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (event.shiftKey && target.closest?.('td.select')) {
            event.preventDefault();
        }
    };

    private setUpRowReorder() {
        if (!this.movableRows || !this.bodyElement) {
            this.rowReorder?.teardown();

            return;
        }

        this.rowReorder ??= new DragToReorder({
            draggable: 'tr[data-reorder-id]',
            revertDrop: true,
            onReorder: this.handleRowReorder,
        });
        this.rowReorder.setup(this.bodyElement, 'vertical');
    }

    private readonly handleRowReorder = ({
        fromIndex,
        toIndex,
    }: ReorderEvent) => {
        const { rows } = this.getRowsOnPage();
        const dropIndex = toIndex > fromIndex ? toIndex + 1 : toIndex;
        const reorder = createReorderEvent(rows, fromIndex, dropIndex);
        if (reorder) {
            this.reorder.emit(reorder);
        }
    };

    private startColumnDrag(event: PointerEvent, column: Column) {
        const target = event.target as HTMLElement;
        const isOnTitle = target.matches(
            'th, th > div, button, button *, span'
        );
        if (!isOnTitle || event.button !== 0) {
            return;
        }

        const source = event.currentTarget as HTMLElement;
        const targets = [
            ...source.parentElement.querySelectorAll<HTMLElement>(
                'th[data-index]'
            ),
        ];

        trackDrag({
            event: event,
            axis: 'x',
            source: source,
            targets: targets,
            onDrop: (dropIndex) => {
                this.ignoreNextClick();
                this.moveColumn(column, dropIndex);
            },
        });
    }

    private ignoreNextClick() {
        this.ignoreClick = true;
        setTimeout(() => {
            this.ignoreClick = false;
        }, 0);
    }

    private moveColumn(column: Column, dropIndex: number) {
        const columns = moveItem(
            this.orderedColumns,
            this.orderedColumns.indexOf(column),
            dropIndex
        );
        if (!columns) {
            return;
        }

        this.orderedColumns = columns;
        this.changeColumns.emit([...columns]);
    }

    private startColumnResize(event: PointerEvent, column: Column) {
        if (event.button !== 0) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        const header = (event.currentTarget as HTMLElement).closest('th');
        const position = [...header.parentElement.children].indexOf(header) + 1;
        const cells = this.scrollContainer.querySelectorAll<HTMLElement>(
            `tr > :nth-child(${position})`
        );
        const startWidth = header.getBoundingClientRect().width;
        const startPosition = event.clientX;
        const rootFontSize = this.getRootFontSize();
        let width: number | undefined;

        trackPointer(
            event,
            (pointer) => {
                width = Math.max(
                    MIN_COLUMN_WIDTH,
                    startWidth + pointer.clientX - startPosition
                );
                const style = toWidthStyle(width, rootFontSize);
                for (const cell of cells) {
                    Object.assign(cell.style, style);
                }
            },
            () => {
                if (width !== undefined) {
                    this.columnWidths = {
                        ...this.columnWidths,
                        [String(column.field)]: width,
                    };
                }
            }
        );
    }

    private getRootFontSize(): number {
        return (
            Number.parseFloat(
                getComputedStyle(document.documentElement).fontSize
            ) || DEFAULT_ROOT_FONT_SIZE
        );
    }

    private getWidthStyles(
        columns: Column[]
    ): Map<Column, Record<string, string>> {
        const hasWidths = Object.keys(this.columnWidths).length > 0;
        const rootFontSize = hasWidths
            ? this.getRootFontSize()
            : DEFAULT_ROOT_FONT_SIZE;

        return new Map(
            columns.map((column) => [
                column,
                toWidthStyle(
                    this.columnWidths[String(column.field)],
                    rootFontSize
                ),
            ])
        );
    }

    private getCellView(column: Column, row: RowData): CellView {
        const views = getViewsOfColumn(this.cellViews, column);
        let view = views.get(row);
        if (!view) {
            view = createCellView(column, row);
            views.set(row, view);
        }

        if (view.missingComponent) {
            this.renderAgainWhenDefined(view.missingComponent);
        }

        return view;
    }

    private renderAgainWhenDefined(name: string) {
        if (this.awaitedComponents.has(name)) {
            return;
        }

        this.awaitedComponents.add(name);
        const table = new WeakRef(this);
        /* eslint-disable unicorn/prefer-await -- the render that asks for this cannot wait. The table is held weakly, because the promise for a name that is never defined lives as long as the page */
        customElements
            .whenDefined(name)
            .then(() => table.deref()?.forgetCellViews())
            .catch(() =>
                console.warn(
                    `limel-table: "${name}" is not a valid name for a custom element, so the cells that ask for it keep showing text.`
                )
            );
        /* eslint-enable unicorn/prefer-await */
    }

    private forgetCellViews() {
        this.cellViews = new WeakMap();
        forceUpdate(this);
    }

    private hasFillerColumn(): boolean {
        return !this.layout || this.layout === 'default';
    }

    private getTranslation(key: string) {
        return translate.get(key, this.language);
    }

    public render() {
        const columns = this.orderedColumns;
        const { rows, offset } = this.getRowsOnPage();
        this.rowInTabOrder = this.getRowInTabOrder(rows);
        const data = this.getData();
        const widthStyles = this.getWidthStyles(columns);
        const showEmptyMessage =
            !this.loading && data.length === 0 && this.emptyMessage;

        return (
            <Host
                class={{
                    'has-low-density': this.layout === 'lowDensity',
                    'has-pagination-on-top': this.paginationLocation === 'top',
                    'has-aggregation': hasAggregation(columns, this.aggregates),
                    'has-pagination': this.hasSeveralPages(),
                    'has-selection': this.rowSelection?.size > 0,
                }}
            >
                <div ref={(element) => (this.scrollContainer = element)}>
                    <table aria-busy={this.loading ? 'true' : undefined}>
                        <thead>
                            <tr>
                                {this.renderUtilityHeaders()}
                                {columns.map((column, index) =>
                                    this.renderHeader(
                                        column,
                                        index,
                                        widthStyles.get(column)
                                    )
                                )}
                                {this.hasFillerColumn() && <td />}
                            </tr>
                        </thead>
                        <tbody
                            onClick={this.handleBodyClick}
                            onKeyDown={this.handleBodyKeyDown}
                            onFocusin={this.handleBodyFocusIn}
                            onMouseDown={
                                this.rowSelection
                                    ? this.handleBodyMouseDown
                                    : undefined
                            }
                            ref={(element) => (this.bodyElement = element)}
                        >
                            {rows.map((row, index) =>
                                this.renderRow(
                                    row,
                                    offset + index,
                                    columns,
                                    widthStyles
                                )
                            )}
                        </tbody>
                        {this.renderAggregates(columns, widthStyles)}
                    </table>
                </div>
                {this.renderPagination()}
                {this.loading && <limel-spinner size="large" />}
                {showEmptyMessage && <p>{this.emptyMessage}</p>}
            </Host>
        );
    }

    private renderPagination() {
        const pageSize = this.getPageSize();
        if (!pageSize) {
            return;
        }

        return (
            <limel-pagination
                page={this.getShownPage()}
                pageSize={pageSize}
                totalItems={this.getTotalItems()}
                language={this.language}
                loading={this.loading}
                onGoToPage={this.handleGoToPage}
            />
        );
    }

    private renderUtilityHeaders() {
        const size = this.rowSelection?.size ?? 0;
        const hasUnselectedRow = this.getRows().some(
            (row) => !this.isSelected(row)
        );

        return [
            this.movableRows && <td class="drag" />,
            this.rowSelection && (
                <th class="select">
                    {!this.loading && (
                        <limel-checkbox
                            class="hide-label"
                            onChange={this.handleSelectAll}
                            disabled={this.getData().length === 0}
                            checked={size > 0}
                            indeterminate={size > 0 && hasUnselectedRow}
                            label={this.getTranslation('table.select-all')}
                        />
                    )}
                </th>
            ),
        ];
    }

    private renderHeader(
        column: Column,
        index: number,
        widthStyle: Record<string, string>
    ) {
        const sortable = this.isSortable(column);
        const sorter = this.currentSorting.find(
            (item) => item.column.field === column.field
        );
        const ariaSort = ARIA_SORT[sorter?.direction] ?? 'none';

        return (
            <th
                key={`${String(column.field)}:${column.title}`}
                scope="col"
                data-index={index}
                aria-sort={sortable ? ariaSort : undefined}
                style={widthStyle}
                onPointerDown={
                    this.movableColumns
                        ? (event: PointerEvent) =>
                              this.startColumnDrag(event, column)
                        : undefined
                }
            >
                <div>
                    {sortable ? (
                        <button
                            type="button"
                            onClick={(event) =>
                                this.handleHeaderClick(event, column)
                            }
                        >
                            <i />
                            <span>{column.title}</span>
                        </button>
                    ) : (
                        <span>{column.title}</span>
                    )}
                    {this.renderHeaderComponent(column)}
                </div>
                <hr
                    aria-orientation="vertical"
                    onPointerDown={(event) =>
                        this.startColumnResize(event, column)
                    }
                />
            </th>
        );
    }

    private renderHeaderComponent(column: Column) {
        if (!column.headerComponent) {
            return;
        }

        let view = this.headerViews.get(column);
        if (!view) {
            view = createHeaderView(column);
            this.headerViews.set(column, view);
        }

        return h(view.name, { ref: view.ref });
    }

    private renderRow(
        row: RowData,
        index: number,
        columns: Column[],
        widthStyles: Map<Column, Record<string, string>>
    ) {
        return (
            <tr
                key={row.id ?? index}
                data-index={index}
                data-reorder-id={this.movableRows ? String(index) : undefined}
                aria-current={this.isActiveRow(row) ? 'true' : undefined}
            >
                {this.movableRows && (
                    <td class="drag" data-drag-handle>
                        <limel-drag-handle
                            dragDirection="vertical"
                            language={this.language}
                        />
                    </td>
                )}
                {this.rowSelection && (
                    <td class="select">
                        <limel-checkbox
                            class="hide-label"
                            checked={this.isSelected(row)}
                            label={this.getTranslation('table.select-row')}
                        />
                    </td>
                )}
                {columns.map((column) =>
                    this.renderCell(column, row, widthStyles.get(column))
                )}
                {this.hasFillerColumn() && <td />}
            </tr>
        );
    }

    private renderCell(
        column: Column,
        row: RowData,
        widthStyle: Record<string, string>
    ) {
        const view = this.getCellView(column, row);
        const style = { ...widthStyle, textAlign: column.horizontalAlign };

        return (
            <td key={`${String(column.field)}:${column.title}`} style={style}>
                {view.component
                    ? h(view.component.name, { ref: view.component.ref })
                    : view.text}
            </td>
        );
    }

    private getAggregate(column: Column): unknown {
        const data = this.getData();
        const isCached =
            this.aggregatedValues?.data === data &&
            this.aggregatedValues.aggregates === this.aggregates;
        if (!isCached) {
            this.aggregatedValues = {
                data: data,
                aggregates: this.aggregates,
                values: new WeakMap(),
            };
        }

        const values = this.aggregatedValues.values;
        if (!values.has(column)) {
            values.set(
                column,
                getAggregatedValue(column, data, this.aggregates)
            );
        }

        return values.get(column);
    }

    private renderAggregates(
        columns: Column[],
        widthStyles: Map<Column, Record<string, string>>
    ) {
        if (!hasAggregation(columns, this.aggregates)) {
            return;
        }

        return (
            <tfoot>
                <tr>
                    {this.movableRows && <td class="drag" />}
                    {this.rowSelection && <td class="select" />}
                    {columns.map((column) => (
                        <td
                            key={`${String(column.field)}:${column.title}`}
                            style={{
                                ...widthStyles.get(column),
                                textAlign: column.horizontalAlign,
                            }}
                        >
                            {toAggregateText(column, this.getAggregate(column))}
                        </td>
                    ))}
                    {this.hasFillerColumn() && <td />}
                </tr>
            </tfoot>
        );
    }
}
