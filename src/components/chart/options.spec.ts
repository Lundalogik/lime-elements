import { ChartItem, ChartSeries } from './chart.types';
import {
    ChartSettings,
    drawChart,
    findItem,
    fitItemTexts,
    getCategoryTooltip,
    getSeriesGrid,
    getTooltip,
    locateItem,
} from './options';
import { ChartTheme } from './theme';

const theme: ChartTheme = {
    itemColor: 'rgb(0, 0, 0)',
    lineColor: 'rgb(10, 10, 10)',
    axisLineColor: 'rgb(1, 1, 1)',
    textColor: 'rgb(2, 2, 2)',
    backgroundColor: 'rgb(3, 3, 3)',
    dividerColor: 'rgb(4, 4, 4)',
    surfaceColor: 'rgb(5, 5, 5)',
    itemBorderRadius: [2, 2, 2, 2],
    scatterItemSize: 8,
    fontFamily: 'Inter',
    npsColors: ['rgb(6, 6, 6)', 'rgb(7, 7, 7)', 'rgb(8, 8, 8)', 'rgb(9, 9, 9)'],
    animate: false,
};

const items: ChartItem[] = [
    { text: 'Applications', value: 25 },
    { text: 'Photos', value: 75 },
];

function settings(overrides: Partial<ChartSettings> = {}): ChartSettings {
    const chartItems = (overrides.items ?? items).map((item, index) => ({
        color: `rgb(${index}, 100, 100)`,
        ...item,
    }));

    return {
        type: 'bar',
        orientation: 'landscape',
        displayAxisLabels: false,
        itemsLabel: 'City',
        valuesLabel: 'Temperature',
        displayItemText: false,
        displayItemValue: false,
        displayItemPercentage: true,
        language: 'en',
        valueFormat: 'number',
        ...overrides,
        items: chartItems,
    };
}

const points: ChartItem[] = [{ text: 'Deal', value: [4, 32] }];

const draw = (overrides: Partial<ChartSettings> = {}) =>
    drawChart(settings(overrides), theme).option as any;

test('the share of an item is written in the language of the chart', () => {
    const chart = settings({ type: 'proportion-bar', language: 'sv' });

    expect(getTooltip(chart, 0)).toBe('Applications (25,00\u{A0}%)<br/>25');
});

test('a proportion bar shows each item as its share of their sum', () => {
    const chart = settings({ type: 'proportion-bar' });

    expect(getTooltip(chart, 0)).toBe('Applications (25.00%)<br/>25');
});

test('maxValue is the whole of a proportion bar, and is not rounded', () => {
    const chart = settings({ type: 'proportion-bar', maxValue: 210 });

    expect(getTooltip(chart, 0)).toBe('Applications (11.90%)<br/>25');
});

test('a ring shows each item as its share of maxValue', () => {
    const chart = settings({ type: 'ring', maxValue: 250 });

    expect(getTooltip(chart, 0)).toBe('Applications (10.00%)<br/>25');
});

test('range items use their extents as shares', () => {
    const chart = settings({
        type: 'pie',
        items: [
            { text: 'Planning', value: [10, 40] },
            { text: 'Delivery', value: [40, 100] },
        ],
    });

    expect(getTooltip(chart, 0)).toBe('Planning (33.33%)<br/>10 — 40');
});

test('with displayItemPercentage set to false, the tooltip has no share', () => {
    const chart = settings({
        type: 'proportion-bar',
        displayItemPercentage: false,
    });

    expect(getTooltip(chart, 0)).toBe('Applications<br/>25');
});

test.each(['bar', 'dot', 'line', 'area', 'scatter'] as const)(
    'a %s chart shows no percentage',
    (type) => {
        const chart = settings({
            type: type,
            items: [{ text: 'Applications', value: 25 }],
        });

        expect(getTooltip(chart, 0)).toBe('Applications<br/>25');
    }
);

test('the tooltip shows the formattedValue', () => {
    const chart = settings({
        items: [{ text: 'Photos', value: 75, formattedValue: '75 GB' }],
    });

    expect(getTooltip(chart, 0)).toBe('Photos<br/>75 GB');
});

test('the tooltip escapes HTML in the text', () => {
    const chart = settings({ items: [{ text: '<b>Photos</b>', value: 75 }] });

    expect(getTooltip(chart, 0)).toBe('&lt;b&gt;Photos&lt;/b&gt;<br/>75');
});

test('a landscape bar chart has its items along the x axis', () => {
    const option = draw();

    expect(option.xAxis.type).toBe('category');
    expect(option.xAxis.data).toEqual(['Applications', 'Photos']);
});

test('a portrait bar chart has its items down the y axis, first on top', () => {
    const option = draw({ orientation: 'portrait' });

    expect(option.yAxis.type).toBe('category');
    expect(option.yAxis.inverse).toBe(true);
});

test('the value axis follows maxValue and axisIncrement', () => {
    const { yAxis } = draw({ maxValue: 210, axisIncrement: 50 });

    expect([yAxis.min, yAxis.max, yAxis.interval]).toEqual([0, 250, 50]);
});

test('without an axisIncrement, the step is worked out from the items', () => {
    const { yAxis } = draw({ items: [{ text: 'Large', value: 10_000 }] });

    expect(yAxis.interval).toBe(1000);
});

test('the value axis always shows its numbers', () => {
    expect(draw().yAxis.axisLabel.show).toBe(true);
});

test('the value axis writes its values in the language of the chart', () => {
    const { yAxis } = draw({
        items: [{ text: 'Revenue', value: 1_200_000 }],
        language: 'sv',
    });

    expect(yAxis.axisLabel.formatter(1_200_000)).toBe('1,2\u{A0}mn');
});

test('a chart of dates has an axis that spans its dates', () => {
    const start = new Date(2026, 0, 12).getTime();
    const end = new Date(2026, 2, 3).getTime();
    const { yAxis } = draw({
        items: [{ text: 'Phase 1', value: [start, end] }],
        valueFormat: 'date',
    });

    expect(yAxis).toMatchObject({
        min: start,
        max: end,
        interval: undefined,
    });
});

test('the axis of a chart of dates marks the first days of its months', () => {
    const { yAxis } = draw({
        items: [
            {
                text: 'Phase 1',
                value: [
                    new Date(2026, 0, 12).getTime(),
                    new Date(2026, 3, 20).getTime(),
                ],
            },
        ],
        valueFormat: 'date',
    });
    const months = [1, 2, 3].map((month) => new Date(2026, month, 1).getTime());

    expect([yAxis.axisLabel.customValues, yAxis.axisTick.customValues]).toEqual(
        [months, months]
    );
});

test('the axis of a chart of dates writes the year on its first month only', () => {
    const { yAxis } = draw({
        items: [
            {
                text: 'Phase 1',
                value: [
                    new Date(2026, 0, 12).getTime(),
                    new Date(2026, 3, 20).getTime(),
                ],
            },
        ],
        valueFormat: 'date',
    });

    expect(
        yAxis.axisLabel.customValues.map((value: number) =>
            yAxis.axisLabel.formatter(value)
        )
    ).toEqual(['Feb 2026', 'Mar', 'Apr']);
});

test('both axes of a scatter chart of dates mark the days of their dates', () => {
    const first = new Date(2026, 0, 12).getTime();
    const second = new Date(2026, 2, 20).getTime();
    const { xAxis, yAxis } = draw({
        type: 'scatter',
        items: [{ text: 'Deal', value: [first, second] }],
        valueFormat: 'date',
    });

    expect([
        xAxis.axisLabel.customValues,
        yAxis.axisLabel.customValues,
    ]).toEqual([
        [first, new Date(2026, 0, 13).getTime()],
        [second, new Date(2026, 2, 21).getTime()],
    ]);
});

test('both axes of a scatter chart write their values in the language of the chart', () => {
    const { xAxis, yAxis } = draw({
        type: 'scatter',
        items: [{ text: 'Deal', value: [1500, 2500] }],
        language: 'sv',
    });

    expect([
        xAxis.axisLabel.formatter(1500),
        yAxis.axisLabel.formatter(2500),
    ]).toEqual(['1\u{A0}500', '2\u{A0}500']);
});

test('the axes have no names unless displayAxisLabels is set', () => {
    const { xAxis, yAxis } = draw();

    expect([xAxis.name, yAxis.name]).toEqual([undefined, undefined]);
});

test('with displayAxisLabels, the axes are named by the labels', () => {
    const { xAxis, yAxis } = draw({ displayAxisLabels: true });

    expect([xAxis.name, yAxis.name]).toEqual(['City', 'Temperature']);
});

test('with displayAxisLabels, a portrait chart names its items axis on the left', () => {
    const { yAxis } = draw({
        displayAxisLabels: true,
        orientation: 'portrait',
    });

    expect(yAxis.name).toBe('City');
});

test('the plot of a bar chart has the background color', () => {
    expect(draw().grid.backgroundColor).toBe('rgb(3, 3, 3)');
});

test('the plot of a scatter chart has the background color', () => {
    const { grid } = draw({ type: 'scatter', items: points });

    expect(grid.show).toBe(true);
    expect(grid.backgroundColor).toBe('rgb(3, 3, 3)');
});

test('tooltips are drawn outside the chart, so its edges do not cut them off', () => {
    expect(draw().tooltip.appendTo).toBe('body');
});

test('the item texts are shown along the axis when displayItemText is set', () => {
    expect(draw().xAxis.axisLabel.show).toBe(false);
    expect(draw({ displayItemText: true }).xAxis.axisLabel.show).toBe(true);
});

test('the item texts are on the x axis of a landscape chart, and the y axis of a portrait one', () => {
    const drawn = (orientation: ChartSettings['orientation']) =>
        drawChart(
            settings({ orientation: orientation, displayItemText: true }),
            theme
        ).itemTextAxis;

    expect(drawn('landscape')).toBe('xAxis');
    expect(drawn('portrait')).toBe('yAxis');
});

test('a single item has the whole axis for its text, so there is nothing to fit', () => {
    const drawing = drawChart(
        settings({ displayItemText: true, items: [items[0]] }),
        theme
    );

    expect(drawing.itemTextAxis).toBeUndefined();
});

test('a drawing fits the item texts to the space the items had before', () => {
    const { xAxis } = drawChart(settings({ displayItemText: true }), theme, 60)
        .option as any;

    expect(xAxis.axisLabel).toMatchObject({
        interval: 0,
        width: 56,
        overflow: 'truncate',
    });
});

test('without displayItemText, there are no item texts to fit', () => {
    expect(drawChart(settings(), theme).itemTextAxis).toBeUndefined();
});

test('a chart without axes has no item texts to fit', () => {
    expect(
        drawChart(settings({ type: 'pie', displayItemText: true }), theme)
            .itemTextAxis
    ).toBeUndefined();
});

test('every item text along the x axis is shown, cut short to the space of its item', () => {
    expect(fitItemTexts({ itemTextAxis: 'xAxis' }, 60)).toEqual({
        xAxis: [
            {
                axisLabel: {
                    interval: 0,
                    width: 56,
                    overflow: 'truncate',
                    ellipsis: '…',
                },
            },
        ],
    });
});

test('when the items along the x axis are too close, only the texts that fit are shown', () => {
    expect(fitItemTexts({ itemTextAxis: 'xAxis' }, 30)).toEqual({
        xAxis: [{ axisLabel: { interval: 'auto', overflow: 'none' } }],
    });
});

test('every item text down the y axis is shown when each item has room for a line', () => {
    expect(fitItemTexts({ itemTextAxis: 'yAxis' }, 20)).toEqual({
        yAxis: [{ axisLabel: { interval: 0 } }],
    });
});

test('when the items down the y axis are too close, only the texts that fit are shown', () => {
    expect(fitItemTexts({ itemTextAxis: 'yAxis' }, 10)).toEqual({
        yAxis: [{ axisLabel: { interval: 'auto' } }],
    });
});

test('the item values are shown on the items when displayItemValue is set', () => {
    const { series } = draw({
        displayItemValue: true,
        items: [{ text: 'Photos', value: 75, formattedValue: '75 GB' }],
    });

    expect(series[0].label.show).toBe(true);
    expect(series[0].label.formatter({ dataIndex: 0 })).toBe('75 GB');
});

test.each(['bar', 'dot', 'line', 'area', 'scatter'] as const)(
    'the item values of a %s chart are drawn in the text color, without an outline',
    (type) => {
        const drawing = drawChart(
            settings({
                type: type,
                displayItemValue: true,
                items: type === 'scatter' ? points : items,
            }),
            theme
        );
        const series = drawing.option.series as any[];

        expect(series[drawing.seriesIndexes[0]].label).toMatchObject({
            color: 'rgb(2, 2, 2)',
            textBorderWidth: 0,
        });
    }
);

test('each bar has the color of its item', () => {
    const { series } = draw();

    expect(series[0].data.map((bar) => bar.itemStyle.color)).toEqual([
        'rgb(0, 100, 100)',
        'rgb(1, 100, 100)',
    ]);
});

test('a range bar is stacked on an invisible bar up to its start', () => {
    const { series } = draw({
        items: [
            { text: 'Week 1', value: [-7, 10] },
            { text: 'Week 2', value: 32 },
        ],
    });

    expect(series[0].data).toEqual([-7, 0]);
    expect(series[0].itemStyle.color).toBe('transparent');
    expect(series[1].data.map((bar) => bar.value)).toEqual([17, 32]);
});

test('a dot chart draws a dot at the value of each item', () => {
    const { series } = draw({ type: 'dot' });

    expect(series[0].type).toBe('scatter');
    expect(series[0].data.map((dot) => dot.value)).toEqual([
        [0, 25],
        [1, 75],
    ]);
});

test('a dot chart draws a range with a dot at both ends', () => {
    const { series } = draw({
        type: 'dot',
        items: [{ text: 'Week 1', value: [-7, 10] }],
    });

    expect(series[2].data[0].value).toEqual([0, -7]);
    expect(series[3].data[0].value).toEqual([0, 10]);
});

test('an area chart fills the area under its line', () => {
    const { series } = draw({ type: 'area' });

    expect(series[0].type).toBe('line');
    expect(series[0].areaStyle).toBeDefined();
});

test.each(['line', 'area'] as const)(
    'a %s chart draws its line in the line color, and each dot in the color of its item',
    (type) => {
        const { series } = draw({ type });

        expect(series[0].color).toBe('rgb(10, 10, 10)');
        expect(series[0].data.map((dot) => dot.itemStyle.color)).toEqual([
            'rgb(0, 100, 100)',
            'rgb(1, 100, 100)',
        ]);
    }
);

test('an area chart fills the area under its line in the line color', () => {
    const { series } = draw({ type: 'area' });

    expect(series[0].areaStyle.color).toBe('rgb(10, 10, 10)');
});

test('a line chart does not fill the area under its line', () => {
    const { series } = draw({ type: 'line' });

    expect(series[0].areaStyle).toBeUndefined();
});

test('a scatter chart puts the first value on the x axis in landscape', () => {
    const { series, xAxis } = draw({
        type: 'scatter',
        items: [{ text: 'Deal', value: [-30, 12] }],
    });

    expect(series[0].data[0].value).toEqual([-30, 12]);
    expect([xAxis.min, xAxis.max]).toEqual([-30, 0]);
});

test('a scatter item with a single value is drawn at that value on both axes', () => {
    const { series } = draw({
        type: 'scatter',
        items: [{ text: 'Deal', value: 25 }],
    });

    expect(series[0].data[0].value).toEqual([25, 25]);
});

test('a scatter chart puts the first value on the y axis in portrait', () => {
    const { series, yAxis } = draw({
        type: 'scatter',
        orientation: 'portrait',
        items: [{ text: 'Deal', value: [-30, 12] }],
    });

    expect(series[0].data[0].value).toEqual([12, -30]);
    expect([yAxis.min, yAxis.max]).toEqual([-30, 0]);
});

test('a portrait scatter chart has the smallest first value on top', () => {
    const { yAxis } = draw({
        type: 'scatter',
        orientation: 'portrait',
        items: points,
    });

    expect(yAxis.inverse).toBe(true);
});

test('with displayAxisLabels, a scatter chart names its axes by the labels', () => {
    const { xAxis, yAxis } = draw({
        type: 'scatter',
        displayAxisLabels: true,
        items: points,
    });

    expect([xAxis.name, yAxis.name]).toEqual(['City', 'Temperature']);
});

test('a pie fills the whole circle with its items', () => {
    const { series } = draw({ type: 'pie' });

    expect(series[0].data.map((slice) => slice.value)).toEqual([25, 75]);
});

test('a pie leaves the part of maxValue its items do not fill empty', () => {
    const { series } = draw({ type: 'pie', maxValue: 250 });

    expect(series[0].data[2].value).toBe(150);
    expect(series[0].data[2].itemStyle.color).toBe('rgb(3, 3, 3)');
});

test('a doughnut has a hole, and a pie does not', () => {
    expect(draw({ type: 'doughnut' }).series[0].radius[0]).toBe('50%');
    expect(draw({ type: 'pie' }).series[0].radius[0]).toBe(0);
});

test('a proportion bar draws each item as a series of its own', () => {
    const drawing = drawChart(settings({ type: 'proportion-bar' }), theme);
    const series = drawing.option.series as any[];

    expect(drawing.itemsAreSeries).toBe(true);
    expect(series.map((bar) => bar.data)).toEqual([[25], [75]]);
    expect(series.map((bar) => bar.stack)).toEqual(['whole', 'whole']);
});

test('the proportion bar spans maxValue', () => {
    const { xAxis } = draw({ type: 'proportion-bar', maxValue: 250 });

    expect(xAxis.max).toBe(250);
});

test('negative items in a proportion bar are not turned into positive ones', () => {
    const { series } = draw({
        type: 'proportion-bar',
        items: [
            { text: 'First', value: -5 },
            { text: 'Second', value: -10 },
        ],
    });

    expect(series.map((bar) => bar.data[0])).toEqual([-5, -10]);
});

test('a ring has its range items start at zero', () => {
    const { series, angleAxis } = draw({
        type: 'ring',
        maxValue: 90,
        items: [
            { text: 'Planning', value: [10, 40] },
            { text: 'Delivery', value: [40, 100] },
        ],
    });

    expect(series[0].data.map((ring) => ring.value)).toEqual([30, 60]);
    expect(angleAxis.max).toBe(90);
});

test('an nps chart points at each score on a scale from -100 to 100', () => {
    const { series } = draw({
        type: 'nps',
        items: [
            { text: 'Q1', value: 75 },
            { text: 'Q2', value: -46 },
        ],
    });

    expect([series[0].min, series[0].max]).toEqual([-100, 100]);
    expect(series[0].data.map((pointer) => pointer.value)).toEqual([75, -46]);
});

test('an nps chart does not show the numbers of its scale, not even with displayAxisLabels', () => {
    const { series } = draw({ type: 'nps', displayAxisLabels: true });

    expect(series[0].axisLabel.show).toBe(false);
});

test.each(['line', 'area', 'dot'] as const)(
    'each item of a %s chart has an invisible column across the plot',
    (type) => {
        const { series, xAxis } = draw({ type });
        const columns = series.at(-1);

        expect(columns.data).toEqual([1, 1]);
        expect(columns.itemStyle.color).toBe('transparent');
        expect(xAxis[columns.xAxisIndex].data).toEqual([
            'Applications',
            'Photos',
        ]);
    }
);

test('a bar chart has no invisible columns', () => {
    expect(draw().series).toHaveLength(1);
});

test('the column of an item is found as that item', () => {
    const drawing = drawChart(settings({ type: 'line' }), theme);

    expect(findItem(drawing, { seriesIndex: 1, dataIndex: 1 })).toEqual({
        series: 0,
        index: 1,
    });
});

test('an nps chart fills its gauge with the background color', () => {
    const { series } = draw({ type: 'nps' });

    expect(series[1].data[0].itemStyle.color).toBe('rgb(3, 3, 3)');
});

test('an item drawn as a series of its own is found by its series', () => {
    const drawing = drawChart(settings({ type: 'proportion-bar' }), theme);

    expect(locateItem(drawing, { series: 0, index: 1 })).toEqual({
        seriesIndex: 1,
        dataIndex: 0,
    });
    expect(findItem(drawing, { seriesIndex: 1, dataIndex: 0 })).toEqual({
        series: 0,
        index: 1,
    });
});

test('an item of a range bar is found in the series of visible bars', () => {
    const drawing = drawChart(
        settings({ items: [{ text: 'Week 1', value: [-7, 10] }] }),
        theme
    );

    expect(locateItem(drawing, { series: 0, index: 0 })).toEqual({
        seriesIndex: 1,
        dataIndex: 0,
    });
});

test('an item of a range dot chart is found in the series of end dots', () => {
    const drawing = drawChart(
        settings({ type: 'dot', items: [{ text: 'Week 1', value: [-7, 10] }] }),
        theme
    );

    expect(locateItem(drawing, { series: 0, index: 0 })).toEqual({
        seriesIndex: 3,
        dataIndex: 0,
    });
});

test('the start dots and the lines between the dots of ranges take clicks, as the end dots do', () => {
    const { series } = draw({
        type: 'dot',
        items: [{ text: 'Week 1', value: [-7, 10], clickable: true }],
    });

    expect(
        series.slice(1, 4).map((current) => [current.silent, current.cursor])
    ).toEqual([
        [undefined, 'pointer'],
        [undefined, 'pointer'],
        [undefined, 'pointer'],
    ]);
});

test('an item of a range line chart is found in the series of the line', () => {
    const drawing = drawChart(
        settings({
            type: 'line',
            items: [{ text: 'Week 1', value: [-7, 10] }],
        }),
        theme
    );

    expect(locateItem(drawing, { series: 0, index: 0 })).toEqual({
        seriesIndex: 1,
        dataIndex: 0,
    });
});

test('the empty part of a pie is not an item', () => {
    const chart = settings({ type: 'pie', maxValue: 250 });
    const drawing = drawChart(chart, theme);
    const { index } = findItem(drawing, { seriesIndex: 0, dataIndex: 2 });

    expect(getTooltip(chart, index)).toBe('');
});

test('the empty part of a pie keeps the default cursor when items are clickable', () => {
    const { series } = draw({
        type: 'pie',
        maxValue: 250,
        items: [{ text: 'Photos', value: 75, clickable: true }],
    });

    expect(series[0].cursor).toBe('pointer');
    expect(series[0].data[1].cursor).toBe('default');
});

const green = 'rgb(0, 200, 0)';
const red = 'rgb(200, 0, 0)';

const won: ChartSeries = {
    text: 'Won',
    color: green,
    items: [
        { text: 'Jan', value: 12, color: green },
        { text: 'Feb', value: 15, color: green },
    ],
};

const lost: ChartSeries = {
    text: 'Lost',
    color: red,
    items: [{ text: 'Feb', value: 9, color: red }],
};

test('each series is drawn as bars of its own', () => {
    const { series } = draw({ series: [won, lost] });

    expect(series.map((bars) => bars.data.map((bar) => bar?.value))).toEqual([
        [12, 15],
        [undefined, 9],
    ]);
});

test('the axis of a chart with series has the texts of the items of every series', () => {
    const { xAxis } = draw({ series: [lost, won] });

    expect(xAxis.data).toEqual(['Feb', 'Jan']);
});

test('the value axis of a chart with series spans the items of every series', () => {
    const large = { ...lost, items: [{ text: 'Feb', value: 90 }] };
    const { yAxis } = draw({ series: [won, large] });

    expect(yAxis.max).toBe(90);
});

test('each line of a chart with series is drawn in the color of its series', () => {
    const { series } = draw({ type: 'line', series: [won, lost] });

    expect(series.map((line) => line.color)).toEqual([green, red]);
});

test('a clickable line of a chart with series draws every point, so that each one can be clicked', () => {
    const clickable = {
        ...won,
        items: won.items.map((item) => ({ ...item, clickable: true })),
    };
    const { series } = draw({ type: 'line', series: [clickable, lost] });

    expect(series.map((line) => line.showAllSymbol)).toEqual([true, undefined]);
});

test('the item values of each series are the values of its own items', () => {
    const { series } = draw({ series: [won, lost], displayItemValue: true });

    expect(series[1].label.formatter({ dataIndex: 1 })).toBe('9');
});

test('a chart with series has no invisible columns', () => {
    const { series } = draw({ type: 'line', series: [won, lost] });

    expect(series).toHaveLength(2);
});

test('a type that cannot draw series and has no items draws the items of the first series', () => {
    const { series } = draw({ type: 'pie', items: [], series: [won, lost] });

    expect(series[0].data.map((slice) => slice.value)).toEqual([12, 15]);
});

test('a type that cannot draw series shows the tooltip of an item, not of a place on an axis', () => {
    expect(draw({ type: 'pie', series: [won, lost] }).tooltip.trigger).toBe(
        'item'
    );
});

test('the tooltip of a chart with series shows everything at the place on the axis', () => {
    expect(draw({ series: [won, lost] }).tooltip.trigger).toBe('axis');
});

test('the tooltip of a chart without series shows the item', () => {
    expect(draw().tooltip.trigger).toBe('item');
});

function getTooltipAt(
    series: ChartSeries[],
    index: number,
    type: ChartSettings['type'] = 'bar'
) {
    const drawn = settings({ type: type, series: series });

    return getCategoryTooltip(getSeriesGrid(drawn), drawn, index);
}

test('the tooltip of a place on the axis names it, and each series that has an item there', () => {
    const tooltip = getTooltipAt([won, lost], 0);

    expect(tooltip).toContain('<div>Jan</div>');
    expect(tooltip).toContain('Won</span><span>12</span>');
    expect(tooltip).not.toContain('Lost');
});

test('the tooltip of a place on the axis shows the color of each series', () => {
    const tooltip = getTooltipAt([won, lost], 1);

    expect(tooltip).toContain(`background-color:${red}`);
});

test('the tooltip of a dot chart marks each series with a dot, as its legend does', () => {
    expect(getTooltipAt([won], 0, 'dot')).toContain('border-radius:50%');
});

test('the tooltip of a line chart marks each series with a line, as its legend does', () => {
    expect(getTooltipAt([won], 0, 'line')).toContain('height:0.125rem');
});

test('the tooltip of a place on the axis escapes HTML in the texts', () => {
    const series = {
        text: '<b>Won</b>',
        items: [{ text: '<i>Jan</i>', value: 1 }],
    };
    const tooltip = getTooltipAt([series], 0);

    expect(tooltip).toContain('&lt;b&gt;Won&lt;/b&gt;');
    expect(tooltip).toContain('&lt;i&gt;Jan&lt;/i&gt;');
});

test('a place outside the axis has no tooltip', () => {
    expect(getTooltipAt([won], 5)).toBe('');
});

test('an item of a series is found in the series that draws it', () => {
    const drawing = drawChart(settings({ series: [won, lost] }), theme);

    expect(findItem(drawing, { seriesIndex: 1, dataIndex: 1 })).toEqual({
        series: 1,
        index: 1,
    });
    expect(locateItem(drawing, { series: 1, index: 1 })).toEqual({
        seriesIndex: 1,
        dataIndex: 1,
    });
});

test('the ranges of each series are stacked on invisible bars of their own', () => {
    const ranges = (series: ChartSeries) => ({
        ...series,
        items: [{ text: 'Jan', value: [2, 8] as [number, number] }],
    });
    const drawing = drawChart(
        settings({ series: [ranges(won), ranges(lost)] }),
        theme
    );
    const series = drawing.option.series as any[];

    expect(drawing.seriesIndexes).toEqual([1, 3]);
    expect(series.map((bars) => bars.stack)).toEqual([
        'range0',
        'range0',
        'range1',
        'range1',
    ]);
});

test('a click on any part of a range of a series is found as the item of that series', () => {
    const ranges = (series: ChartSeries) => ({
        ...series,
        items: [{ text: 'Jan', value: [2, 8] as [number, number] }],
    });
    const drawing = drawChart(
        settings({ type: 'dot', series: [ranges(won), ranges(lost)] }),
        theme
    );
    const secondSeries = [5, 6, 7].map((seriesIndex) =>
        findItem(drawing, { seriesIndex: seriesIndex, dataIndex: 0 })
    );

    expect(secondSeries).toEqual([
        { series: 1, index: 0 },
        { series: 1, index: 0 },
        { series: 1, index: 0 },
    ]);
});

test('the lines between the dots of ranges are in the middle of their place, whatever their series', () => {
    const ranges = {
        ...won,
        items: [{ text: 'Jan', value: [2, 8] as [number, number] }],
    };
    const { series } = draw({ type: 'dot', series: [ranges, ranges] });
    const bars = series.filter((current) => current.type === 'bar');

    expect(bars.map((current) => current.barGap)).toEqual([
        '-100%',
        '-100%',
        '-100%',
        '-100%',
    ]);
});

test('the areas of a chart with series are fainter, so that they do not hide each other', () => {
    const { series } = draw({ type: 'area', series: [won, lost] });

    expect(series.map((area) => area.areaStyle.opacity)).toEqual([0.15, 0.15]);
});

test('the area of a chart with one series is as strong as the area of a single line', () => {
    const { series } = draw({ type: 'area', series: [won] });

    expect(series[0].areaStyle.opacity).toBe(0.4);
});

const revenue: ChartSeries[] = [
    {
        text: 'Licences',
        color: green,
        items: [
            { text: 'Q1', value: 40, color: green },
            { text: 'Q2', value: 50, color: green },
        ],
    },
    {
        text: 'Services',
        color: red,
        items: [
            { text: 'Q1', value: 20, color: red },
            { text: 'Q2', value: -40, color: red },
        ],
    },
];

test.each(['bar', 'line', 'area'] as const)(
    'stacked series of a %s chart are drawn in one stack',
    (type) => {
        const { series } = draw({ type, series: revenue, stacked: true });

        expect(series.map((current) => current.stack)).toEqual([
            'series',
            'series',
        ]);
    }
);

test.each(['bar', 'line', 'area'] as const)(
    'stacked series of a %s chart stack each side of zero on its own',
    (type) => {
        const { series } = draw({ type, series: revenue, stacked: true });

        expect(series.map((current) => current.stackStrategy)).toEqual([
            'samesign',
            'samesign',
        ]);
    }
);

test('stacked has no effect on the value axis of a dot chart, which cannot stack', () => {
    const { yAxis } = draw({ type: 'dot', series: revenue, stacked: true });

    expect([yAxis.min, yAxis.max]).toEqual([-45, 54]);
});

test('stacked has no effect on series of dates', () => {
    const { series } = draw({
        valueFormat: 'date',
        series: revenue,
        stacked: true,
    });

    expect(series.map((bars) => bars.stack)).toEqual([undefined, undefined]);
});

test('the value axis of stacked series reaches the ends of the stacks, on both sides of zero', () => {
    const { yAxis } = draw({ series: revenue, stacked: true });

    expect([yAxis.min, yAxis.max]).toEqual([-40, 60]);
});

test('only the outer corners of the end of a stack of bars are rounded', () => {
    const { series } = draw({ series: revenue, stacked: true });

    expect(series.map((bars) => bars.data[0].itemStyle.borderRadius)).toEqual([
        0,
        [2, 2, 0, 0],
    ]);
});

test('the end of a stack of bars below zero is rounded at the bottom', () => {
    const { series } = draw({ series: revenue, stacked: true });

    expect(series[1].data[1].itemStyle.borderRadius).toEqual([0, 0, 2, 2]);
});

test('the end of a stack of bars in portrait is rounded on its outer side', () => {
    const { series } = draw({
        series: revenue,
        stacked: true,
        orientation: 'portrait',
    });

    expect(
        series.map((bars) => bars.data.map((bar) => bar.itemStyle.borderRadius))
    ).toEqual([
        [0, [0, 2, 2, 0]],
        [
            [0, 2, 2, 0],
            [2, 0, 0, 2],
        ],
    ]);
});

test('the parts of a stack of bars are set apart by the divider color', () => {
    const { series } = draw({ series: revenue, stacked: true });

    expect(series[0].data[0].itemStyle).toMatchObject({
        borderColor: 'rgb(4, 4, 4)',
        borderWidth: 1,
    });
});

test('the item values of stacked bars are written inside the bars', () => {
    const { series } = draw({
        series: revenue,
        stacked: true,
        displayItemValue: true,
    });

    expect(series[0].label.position).toBe('inside');
});

test('a range in a stack of bars is drawn as its extent', () => {
    const ranges = [
        {
            ...revenue[0],
            items: [{ text: 'Q1', value: [10, 40] as [number, number] }],
        },
        revenue[1],
    ];
    const { series } = draw({ series: ranges, stacked: true });

    expect(series[0].data[0].value).toBe(30);
    expect(series).toHaveLength(2);
});

test('stacked areas are as strong as the area of a single line', () => {
    const { series } = draw({ type: 'area', series: revenue, stacked: true });

    expect(series.map((area) => area.areaStyle.opacity)).toEqual([0.4, 0.4]);
});
