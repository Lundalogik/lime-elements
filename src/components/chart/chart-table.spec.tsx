import { VNode } from '@stencil/core';
import { render, h } from '@stencil/vitest';
import { ChartItem } from './chart.types';

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
