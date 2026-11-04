import { VNode } from '@stencil/core';
import { render, h } from '@stencil/vitest';
import { ChartItem, ChartSeries } from './chart.types';

const items: ChartItem[] = [
    { text: 'Applications', value: 25 },
    { text: 'Photos', value: 75, formattedValue: '75 GB' },
];

async function renderChart(chart: VNode) {
    const { root, waitForChanges } = await render(chart);
    await waitForChanges();

    return root.shadowRoot;
}

const texts = (elements: Iterable<Element>) =>
    [...elements].map((element) => element.textContent);

test('the accessibleLabel is the caption of the table', async () => {
    const shadow = await renderChart(
        <limel-chart items={items} accessibleLabel="Disk usage" />
    );

    expect(shadow.querySelector('caption')).toHaveTextContent('Disk usage');
});

test('without an accessibleLabel the table has no caption', async () => {
    const shadow = await renderChart(<limel-chart items={items} />);

    expect(shadow.querySelector('caption')).toBeNull();
});

test('the columns are called "Items" and "Value" by default', async () => {
    const shadow = await renderChart(<limel-chart items={items} />);

    expect(texts(shadow.querySelectorAll('th'))).toEqual(['Items', 'Value']);
});

test('the column names follow the language', async () => {
    const shadow = await renderChart(
        <limel-chart items={items} language="sv" />
    );

    expect(texts(shadow.querySelectorAll('th'))).toEqual(['Objekt', 'Värde']);
});

test('accessibleItemsLabel and accessibleValuesLabel name the columns', async () => {
    const shadow = await renderChart(
        <limel-chart
            items={items}
            accessibleItemsLabel="Files"
            accessibleValuesLabel="Size"
        />
    );

    expect(texts(shadow.querySelectorAll('th'))).toEqual(['Files', 'Size']);
});

test('each item is a row with its text and its value', async () => {
    const shadow = await renderChart(<limel-chart items={items} />);
    const rows = [...shadow.querySelector('tbody').children];

    expect(rows.map((row) => texts(row.querySelectorAll('td')))).toEqual([
        ['Applications', '25'],
        ['Photos', '75 GB'],
    ]);
});

test('the values in the table are written in the language of the chart', async () => {
    const shadow = await renderChart(
        <limel-chart
            items={[{ text: 'Revenue', value: 1234.5 }]}
            language="sv"
        />
    );

    expect(shadow.querySelectorAll('td')[1]).toHaveTextContent('1\u{A0}234,5');
});

test('the values in the table follow the value format of the chart', async () => {
    const shadow = await renderChart(
        <limel-chart
            items={[{ text: 'Revenue', value: 1234.5 }]}
            language="sv"
            valueFormat="currency"
            currency="SEK"
        />
    );

    expect(shadow.querySelectorAll('td')[1]).toHaveTextContent(
        '1\u{A0}234,50\u{A0}kr'
    );
});

test('each row of a chart of parts is described by its share of the whole', async () => {
    const shadow = await renderChart(
        <limel-chart type="doughnut" items={items} />
    );
    const rows = [...shadow.querySelector('tbody').children];

    expect(rows.map((row) => row.getAttribute('aria-description'))).toEqual([
        'Applications (25.00%)',
        'Photos (75.00%)',
    ]);
});

test('the rows of a stacked-bar chart are described by their share of the whole', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const shadow = await renderChart(
        <limel-chart type="stacked-bar" items={items} />
    );
    const rows = [...shadow.querySelector('tbody').children];

    expect(rows.map((row) => row.getAttribute('aria-description'))).toEqual([
        'Applications (25.00%)',
        'Photos (75.00%)',
    ]);
    warn.mockRestore();
});

test('the shares that describe the rows are written in the language of the chart', async () => {
    const shadow = await renderChart(
        <limel-chart type="doughnut" items={items} language="sv" />
    );
    const row = shadow.querySelector('tr[data-index]');

    expect(row.getAttribute('aria-description')).toBe(
        'Applications (25,00\u{A0}%)'
    );
});

test('without displayItemPercentage, the rows have no description', async () => {
    const shadow = await renderChart(
        <limel-chart
            type="doughnut"
            items={items}
            displayItemPercentage={false}
        />
    );
    const row = shadow.querySelector('tr[data-index]');

    expect(row.hasAttribute('aria-description')).toBe(false);
});

test('the rows of a chart that is not of parts have no description', async () => {
    const shadow = await renderChart(<limel-chart type="bar" items={items} />);
    const row = shadow.querySelector('tr[data-index]');

    expect(row.hasAttribute('aria-description')).toBe(false);
});

test('a scatter point is a row with its coordinates', async () => {
    const shadow = await renderChart(
        <limel-chart
            type="scatter"
            items={[{ text: 'Deal', value: [4, 32] }]}
        />
    );

    expect(texts(shadow.querySelectorAll('td'))).toEqual(['Deal', '(4, 32)']);
});

test('while loading, a spinner is shown instead of the table', async () => {
    const shadow = await renderChart(<limel-chart items={items} loading />);

    expect(shadow.querySelector('limel-spinner')).not.toBeNull();
    expect(shadow.querySelector('table')).toBeNull();
});

const series: ChartSeries[] = [
    {
        text: 'Won',
        items: [
            { text: 'Jan', value: 12 },
            { text: 'Feb', value: 15 },
        ],
    },
    { text: 'Lost', items: [{ text: 'Feb', value: 9 }] },
];

test('the table of a chart with series has a column for each series', async () => {
    const shadow = await renderChart(
        <limel-chart type="bar" series={series} />
    );

    expect(texts(shadow.querySelectorAll('th[scope="col"]'))).toEqual([
        'Items',
        'Won',
        'Lost',
    ]);
});

test('accessibleValuesLabel heads the columns of the series of a chart', async () => {
    const shadow = await renderChart(
        <limel-chart type="bar" series={series} accessibleValuesLabel="Deals" />
    );
    const group = shadow.querySelector('th[colspan]');

    expect(group).toEqualText('Deals');
    expect(group).toEqualAttribute('colspan', '2');
});

test('without accessibleValuesLabel, only the series head the columns of a chart with series', async () => {
    const shadow = await renderChart(
        <limel-chart type="bar" series={series} />
    );

    expect(shadow.querySelector('thead').children).toHaveLength(1);
});

test('the table of a chart with series has a row for each place on the axis', async () => {
    const shadow = await renderChart(
        <limel-chart type="bar" series={series} />
    );
    const rows = [...shadow.querySelector('tbody').children];

    expect(rows.map((row) => texts(row.children))).toEqual([
        ['Jan', '12', ''],
        ['Feb', '15', '9'],
    ]);
});

test('each row of a chart with series is headed by the text of its items', async () => {
    const shadow = await renderChart(
        <limel-chart type="bar" series={series} />
    );

    const header =
        shadow.querySelector('tbody').firstElementChild.firstElementChild;

    expect(header.tagName).toBe('TH');
    expect(header).toEqualAttribute('scope', 'row');
});

test('the first value of a chart with series is the one that Tab lands on', async () => {
    const shadow = await renderChart(
        <limel-chart type="bar" series={series} />
    );

    expect(
        [...shadow.querySelectorAll('td')].map((cell) => cell.tabIndex)
    ).toEqual([0, -1, -1, -1]);
});

test('when the first series has no items, Tab lands on the first value of the next one', async () => {
    const shadow = await renderChart(
        <limel-chart
            type="bar"
            series={[{ text: 'Open', items: [] }, ...series]}
        />
    );

    expect(
        [...shadow.querySelectorAll<HTMLElement>('td[data-series]')].map(
            (cell) => [cell.dataset.series, cell.tabIndex]
        )
    ).toEqual([
        ['1', 0],
        ['1', -1],
        ['2', -1],
    ]);
});

test('a series that leaves out an item has an empty cell that cannot be focused', async () => {
    const shadow = await renderChart(
        <limel-chart type="bar" series={series} />
    );
    const empty = shadow.querySelectorAll('td')[1];

    expect(empty).toHaveTextContent('');
    expect(empty).not.toHaveAttribute('tabindex');
});

test('a chart with two series or more has a legend that names them', async () => {
    const shadow = await renderChart(
        <limel-chart type="bar" series={series} />
    );

    expect(texts(shadow.querySelectorAll('li'))).toEqual(['Won', 'Lost']);
});

test('the legend is hidden from assistive technology, which reads the table instead', async () => {
    const shadow = await renderChart(
        <limel-chart type="bar" series={series} />
    );

    expect(shadow.querySelector('ul')).toEqualAttribute('aria-hidden', 'true');
});

test('a chart with a single series has no legend', async () => {
    const shadow = await renderChart(
        <limel-chart type="bar" series={[series[0]]} />
    );

    expect(shadow.querySelector('ul')).toBeNull();
});

test('a chart without series has no legend', async () => {
    const shadow = await renderChart(<limel-chart type="bar" items={items} />);

    expect(shadow.querySelector('ul')).toBeNull();
});

test('a type that cannot draw series shows the items of the first series in its table', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const shadow = await renderChart(
        <limel-chart type="pie" series={series} />
    );
    const rows = [...shadow.querySelector('tbody').children];

    expect(rows.map((row) => texts(row.querySelectorAll('td')))).toEqual([
        ['Jan', '12'],
        ['Feb', '15'],
    ]);
    warn.mockRestore();
});
