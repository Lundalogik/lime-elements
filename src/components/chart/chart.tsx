import {
    Component,
    Element,
    Event,
    EventEmitter,
    h,
    Host,
    Prop,
    Watch,
} from '@stencil/core';
import {
    BarChart,
    GaugeChart,
    LineChart,
    PieChart,
    ScatterChart,
} from 'echarts/charts';
import {
    GridComponent,
    PolarComponent,
    TooltipComponent,
} from 'echarts/components';
import { init, use, type ECElementEvent, type ECharts } from 'echarts/core';
import { SVGRenderer } from 'echarts/renderers';
import { Languages } from '../date-picker/date.types';
import translate from '../../global/translations';
import { ChartItem, ChartType } from './chart.types';
import {
    ChartDrawing,
    ChartSettings,
    drawChart,
    fitItemTexts,
    getItemIndex,
    getItemLabel,
    locateItem,
} from './options';
import {
    formatValue,
    getAxisRange,
    MAX_AXIS_STEPS,
    usesAxisIncrement,
} from './scale';
import {
    ChartTheme,
    createThemeReader,
    ThemeReader,
    watchTheme,
} from './theme';

const extensions = [
    BarChart,
    GaugeChart,
    LineChart,
    PieChart,
    ScatterChart,
    GridComponent,
    PolarComponent,
    TooltipComponent,
    SVGRenderer,
];

/**
 * A chart is a graphical representation of data, in which
 * visual symbols such as such bars, dots, lines, or slices, represent
 * each data point, in comparison to others.
 *
 * @exampleComponent limel-example-chart-stacked-bar
 * @exampleComponent limel-example-chart-orientation
 * @exampleComponent limel-example-chart-max-value
 * @exampleComponent limel-example-chart-display-item-percentage
 * @exampleComponent limel-example-chart-type-bar
 * @exampleComponent limel-example-chart-type-dot
 * @exampleComponent limel-example-chart-type-area
 * @exampleComponent limel-example-chart-type-line
 * @exampleComponent limel-example-chart-type-scatter
 * @exampleComponent limel-example-chart-type-pie
 * @exampleComponent limel-example-chart-type-doughnut
 * @exampleComponent limel-example-chart-type-ring
 * @exampleComponent limel-example-chart-type-gantt
 * @exampleComponent limel-example-chart-type-nps
 * @exampleComponent limel-example-chart-multi-axis
 * @exampleComponent limel-example-chart-multi-axis-with-negative-start-values
 * @exampleComponent limel-example-chart-multi-axis-area-with-negative-start-values
 * @exampleComponent limel-example-chart-type-scatter-negative
 * @exampleComponent limel-example-chart-axis-increment
 * @exampleComponent limel-example-chart-clickable-items
 * @exampleComponent limel-example-chart-accessibility
 * @exampleComponent limel-example-chart-axis-labels
 * @exampleComponent limel-example-chart-styling
 * @beta
 */

@Component({
    tag: 'limel-chart',
    shadow: true,
    styleUrl: 'chart.scss',
})
export class Chart {
    /**
     * Defines the language for translations.
     * Will translate the translatable strings on the components.
     */
    @Prop({ reflect: true })
    public language: Languages = 'en';

    /**
     * Helps users of assistive technologies to understand
     * the context of the chart, and what is being displayed.
     */
    @Prop({ reflect: true })
    public accessibleLabel?: string;

    /**
     * Helps users of assistive technologies to understand
     * what the items in the chart represent.
     * Defaults to the translation for "items" in the current language.
     */
    @Prop({ reflect: true })
    public accessibleItemsLabel?: string;

    /**
     * Helps users of assistive technologies to understand
     * what the values in the chart represent.
     * Defaults to the translation for "value" in the current language.
     */
    @Prop({ reflect: true })
    public accessibleValuesLabel?: string;

    /**
     * When set to true, renders visible labels for X and Y axes.
     * Only affects chart types with X and Y axes, such as area, bar, and line charts.
     */

    @Prop({ reflect: true })
    public displayAxisLabels = false;

    /**
     * Makes the `text` of chart items constantly visible,
     * By default, item texts are displayed in a tooltip,
     * when the item is hovered or focused.
     * Only affects chart types with X and Y axes, such as area, bar, and line charts.
     */
    @Prop({ reflect: true })
    public displayItemText = false;

    /**
     * Makes the `value` (or `formattedValue`) of chart items constantly visible,
     * By default, item values are displayed in a tooltip,
     * when the item is hovered or focused.
     * Only affects chart types with X and Y axes, such as area, bar, and line charts.
     */
    @Prop({ reflect: true })
    public displayItemValue = false;

    /**
     * Set to `false` to hide the percentage in item tooltips.
     * The percentage is an item's value or range extent as a share of the
     * whole. The whole is `maxValue` when set and the combined items otherwise.
     * Applies to `stacked-bar`, `pie`, `doughnut`, and `ring` charts.
     */
    @Prop({ reflect: true })
    public displayItemPercentage = true;

    /**
     * List of items in the chart,
     * each representing a data point.
     */
    @Prop()
    public items!: ChartItem[];

    /**
     * Defines how items are visualized in the chart.
     */
    @Prop({ reflect: true })
    public type?: ChartType = 'stacked-bar';

    /**
     * Defines whether the chart is intended to be displayed wide or tall.
     * Does not have any effect on chart types which generate circular forms.
     */
    @Prop({ reflect: true })
    public orientation?: 'landscape' | 'portrait' = 'landscape';

    /**
     * Sets the value used to scale item values.
     * For `stacked-bar`, `pie`, `doughnut`, and `ring`, it is the denominator
     * used as the whole. It defaults to the combined item values or range
     * extents. The combined size can exceed `maxValue` and produce a total
     * above 100%.
     * For `bar`, `dot`, `area`, and `line`, it is the requested upper bound.
     * The chart can round that bound up to the next `axisIncrement`.
     * Has no effect on `nps` or `scatter`.
     */
    @Prop({ reflect: true })
    public maxValue?: number;

    /**
     * Sets the axis increment for `bar`, `dot`, `area`, and `line` charts.
     * When it is not set, or not above zero, the chart works out a step
     * from the values. It also does that when the step would divide the
     * axis into more than 100 parts, so that it does not draw too many lines.
     * Has no effect on other chart types.
     */
    @Prop({ reflect: true })
    public axisIncrement?: number;

    /**
     * Indicates whether the chart is in a loading state.
     */
    @Prop({ reflect: true })
    public loading: boolean = false;

    /**
     * Fired when a chart item with `clickable` set to `true` is clicked
     */
    @Event()
    public interact: EventEmitter<ChartItem>;

    @Element()
    private readonly host: HTMLLimelChartElement;

    private plot?: HTMLElement;
    private chart?: ECharts;
    private drawing?: ChartDrawing;
    private drawnSettings?: string;
    private drawnTheme?: string;
    private themeMayHaveChanged = false;
    private itemSpace?: number;
    private axisIncrementWarning?: string;
    private readonly invalidColors = new Set<string>();
    private themeReader?: ThemeReader;
    private resizeObserver?: ResizeObserver;
    private stopWatchingTheme?: () => void;

    public componentWillLoad() {
        this.warnAboutAxisIncrement();
    }

    public connectedCallback() {
        this.draw();
    }

    public componentDidRender() {
        this.draw();
    }

    public disconnectedCallback() {
        this.disposeChart();
        this.resizeObserver?.disconnect();
        this.resizeObserver = undefined;
        this.stopWatchingTheme?.();
        this.stopWatchingTheme = undefined;
        this.themeReader?.dispose();
        this.themeReader = undefined;
    }

    @Watch('axisIncrement')
    @Watch('items')
    @Watch('maxValue')
    @Watch('type')
    protected warnAboutAxisIncrement() {
        const warning = this.getAxisIncrementWarning();
        if (warning && warning !== this.axisIncrementWarning) {
            console.warn(warning);
        }

        this.axisIncrementWarning = warning;
    }

    private getAxisIncrementWarning(): string | undefined {
        const increment = this.axisIncrement;
        if (increment === undefined || increment === null) {
            return;
        }

        if (increment <= 0 || Number.isNaN(increment)) {
            return `limel-chart: \`axisIncrement\` must be above 0, but was ${increment}. Working out a step from the values instead.`;
        }

        if (!usesAxisIncrement(this.type)) {
            return;
        }

        const range = getAxisRange(this.items ?? [], this.maxValue, increment);
        if (range.increment !== increment) {
            return `limel-chart: \`axisIncrement\` ${increment} would divide the axis into more than ${MAX_AXIS_STEPS} steps. Working out a step from the values instead.`;
        }
    }

    public render() {
        if (this.loading) {
            return <limel-spinner limeBranded={false} />;
        }

        return (
            <Host>
                <div class="plot" aria-hidden="true" ref={this.setPlot} />
                <table aria-live="polite">
                    {this.renderCaption()}
                    {this.renderTableHeader()}
                    <tbody>{this.renderItems()}</tbody>
                </table>
            </Host>
        );
    }

    private renderCaption() {
        if (!this.accessibleLabel) {
            return;
        }

        return <caption>{this.accessibleLabel}</caption>;
    }

    private renderTableHeader() {
        return (
            <thead>
                <tr>
                    <th scope="col">{this.itemsLabel}</th>
                    <th scope="col">{this.valuesLabel}</th>
                </tr>
            </thead>
        );
    }

    private get itemsLabel() {
        return (
            this.accessibleItemsLabel ?? translate.get('items', this.language)
        );
    }

    private get valuesLabel() {
        return (
            this.accessibleValuesLabel ?? translate.get('value', this.language)
        );
    }

    private renderItems() {
        return this.items?.map((item, index) => (
            <tr
                data-index={index}
                aria-description={this.getRowDescription(index)}
                tabIndex={0}
                role={item.clickable ? 'button' : null}
                onClick={this.handleClick}
                onKeyDown={this.handleKeyDown}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
            >
                <td>{item.text}</td>
                <td>{formatValue(item, this.type)}</td>
            </tr>
        ));
    }

    private getRowDescription(index: number): string | undefined {
        const label = getItemLabel(
            {
                items: this.items,
                type: this.type,
                maxValue: this.maxValue,
                displayItemPercentage: this.displayItemPercentage,
            },
            index
        );

        return label === this.items[index].text ? undefined : label;
    }

    private draw() {
        if (!this.plot?.isConnected) {
            this.disposeChart();

            return;
        }

        this.observeSize();
        const { clientWidth: width, clientHeight: height } = this.plot;
        if (!width || !height) {
            return;
        }

        this.createChart();
        if (
            width !== this.chart.getWidth() ||
            height !== this.chart.getHeight()
        ) {
            this.chart.resize();
        }

        this.updateChart();
        this.fitItemTextsToSize();
    }

    private createChart() {
        if (this.chart?.getDom() === this.plot) {
            return;
        }

        this.disposeChart();
        use(extensions);
        this.chart = init(this.plot, null, { renderer: 'svg' });
        this.chart.on('click', this.handleChartClick);
        this.chart.on('mouseover', this.handleChartOver);
        this.chart.on('mouseout', this.handleChartOut);
    }

    private updateChart() {
        const settings = this.getSettings();
        const drawnSettings = JSON.stringify(settings);
        if (drawnSettings === this.drawnSettings && !this.themeMayHaveChanged) {
            return;
        }

        this.themeMayHaveChanged = false;
        this.themeReader ??= createThemeReader(this.host.shadowRoot);
        this.stopWatchingTheme ??= watchTheme(this.handleThemeChange);
        const theme = this.themeReader.theme();
        const drawnTheme = JSON.stringify(theme);
        if (
            drawnSettings === this.drawnSettings &&
            drawnTheme === this.drawnTheme
        ) {
            return;
        }

        this.drawnSettings = drawnSettings;
        this.drawnTheme = drawnTheme;
        this.drawing = drawChart(
            this.withItemColors(settings, theme),
            theme,
            this.itemSpace
        );
        this.chart.setOption(this.drawing.option, { notMerge: true });

        const focusedRow = this.host.shadowRoot.activeElement;
        if (focusedRow instanceof HTMLElement && focusedRow.dataset.index) {
            this.showItem(focusedRow, true);
        }
    }

    private fitItemTextsToSize() {
        const axis = this.drawing?.itemTextAxis;
        if (!axis) {
            return;
        }

        const finder = { [`${axis}Index`]: 0 };
        const itemSpace = Math.floor(
            Math.abs(
                this.chart.convertToPixel(finder, 1) -
                    this.chart.convertToPixel(finder, 0)
            )
        );
        if (itemSpace === this.itemSpace) {
            return;
        }

        this.itemSpace = itemSpace;
        this.chart.setOption(fitItemTexts(this.drawing, itemSpace));
    }

    private getSettings(): ChartSettings {
        return {
            items: (this.items ?? []).map((item) => ({
                text: item.text,
                value: item.value,
                formattedValue: item.formattedValue,
                color: item.color,
                clickable: item.clickable,
            })),
            type: this.type,
            orientation: this.orientation,
            maxValue: this.maxValue,
            axisIncrement: this.axisIncrement,
            displayAxisLabels: this.displayAxisLabels,
            itemsLabel: this.itemsLabel,
            valuesLabel: this.valuesLabel,
            displayItemText: this.displayItemText,
            displayItemValue: this.displayItemValue,
            displayItemPercentage: this.displayItemPercentage,
        };
    }

    private withItemColors(
        settings: ChartSettings,
        theme: ChartTheme
    ): ChartSettings {
        return {
            ...settings,
            items: settings.items.map((item) => ({
                ...item,
                color: this.getItemColor(item, theme),
            })),
        };
    }

    private getItemColor(item: ChartItem, theme: ChartTheme): string {
        if (!item.color) {
            return theme.itemColor;
        }

        const color = this.themeReader.color(item.color);
        if (color) {
            return color;
        }

        if (!this.invalidColors.has(item.color)) {
            this.invalidColors.add(item.color);
            const hint = item.color.includes('var(')
                ? ' Check that its variables are set, and that they make a color.'
                : '';
            console.warn(
                `limel-chart: the color of an item must be a CSS color, but was \`${item.color}\`.${hint} Using the default item color instead.`
            );
        }

        return theme.itemColor;
    }

    private observeSize() {
        if (this.resizeObserver || typeof ResizeObserver === 'undefined') {
            return;
        }

        this.resizeObserver = new ResizeObserver(this.handleResize);
        this.resizeObserver.observe(this.host);
    }

    private disposeChart() {
        this.chart?.dispose();
        this.chart = undefined;
        this.drawing = undefined;
        this.drawnSettings = undefined;
        this.drawnTheme = undefined;
        this.itemSpace = undefined;
    }

    private readonly setPlot = (element?: HTMLElement) => {
        this.plot = element;
    };

    private readonly handleResize = () => {
        this.draw();
    };

    private readonly handleThemeChange = () => {
        this.themeMayHaveChanged = true;
        this.draw();
    };

    private readonly handleChartClick = (event: ECElementEvent) => {
        if (!this.drawing) {
            return;
        }

        const item = this.getClickableItem(getItemIndex(this.drawing, event));
        if (!item) {
            return;
        }

        event.event?.event?.stopPropagation();
        this.interact.emit(item);
    };

    private readonly handleChartOver = (event: ECElementEvent) => {
        this.highlightItemAt(event, true);
    };

    private readonly handleChartOut = (event: ECElementEvent) => {
        this.highlightItemAt(event, false);
    };

    private highlightItemAt(event: ECElementEvent, highlight: boolean) {
        if (!this.drawing) {
            return;
        }

        const location = locateItem(
            this.drawing,
            getItemIndex(this.drawing, event)
        );
        if (location.seriesIndex === event.seriesIndex) {
            return;
        }

        this.chart.dispatchAction({
            type: highlight ? 'highlight' : 'downplay',
            ...location,
        });
    }

    private getClickableItem(index: number): ChartItem | undefined {
        const item = this.items[index];
        if (!item?.clickable) {
            return;
        }

        return item;
    }

    private getRowIndex(event: Event): number {
        return Number((event.currentTarget as HTMLElement).dataset.index);
    }

    private readonly handleClick = (event: MouseEvent) => {
        const item = this.getClickableItem(this.getRowIndex(event));
        if (!item) {
            return;
        }

        event.stopPropagation();
        this.interact.emit(item);
    };

    private readonly handleKeyDown = (event: KeyboardEvent) => {
        if (event.key !== 'Enter' && event.key !== ' ') {
            return;
        }

        const item = this.getClickableItem(this.getRowIndex(event));
        if (!item) {
            return;
        }

        event.preventDefault();
        this.interact.emit(item);
    };

    private readonly handleFocus = (event: FocusEvent) => {
        this.showItem(event.currentTarget as HTMLElement, true);
    };

    private readonly handleBlur = (event: FocusEvent) => {
        this.showItem(event.currentTarget as HTMLElement, false);
    };

    private showItem(row: HTMLElement, show: boolean) {
        if (!this.chart || !this.drawing) {
            return;
        }

        const location = locateItem(this.drawing, Number(row.dataset.index));
        this.chart.dispatchAction({
            type: show ? 'highlight' : 'downplay',
            ...location,
        });
        this.chart.dispatchAction({
            type: show ? 'showTip' : 'hideTip',
            ...location,
        });
    }
}
