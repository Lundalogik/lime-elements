import { VNode } from '@stencil/core';
import { render, h } from '@stencil/vitest';
import { ChartItem } from './chart.types';

const items: ChartItem[] = [{ text: 'Photos', value: 75 }];
const largeItems: ChartItem[] = [{ text: 'Revenue', value: 1_000_000 }];

test('an axis step worked out from the items leaves axisIncrement unset', async () => {
    const { root, waitForChanges } = await render(
        <limel-chart type="bar" items={items} />
    );
    await waitForChanges();

    expect(root.axisIncrement).toBeUndefined();
});

test.each([0, -10, NaN])(
    'an axisIncrement of %s makes the chart warn',
    async (axisIncrement) => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

        const { waitForChanges } = await render(
            <limel-chart
                type="bar"
                items={items}
                axisIncrement={axisIncrement}
            />
        );
        await waitForChanges();

        expect(warn).toHaveBeenCalledExactlyOnceWith(
            `limel-chart: \`axisIncrement\` must be above 0, but was ${axisIncrement}. Working out a step from the values instead.`
        );
        warn.mockRestore();
    }
);

test.each([undefined, 25])(
    'an axisIncrement of %s does not make the chart warn',
    async (axisIncrement) => {
        const warn = vi.spyOn(console, 'warn');

        const { waitForChanges } = await render(
            <limel-chart
                type="bar"
                items={items}
                axisIncrement={axisIncrement}
            />
        );
        await waitForChanges();

        expect(warn).not.toHaveBeenCalled();
        warn.mockRestore();
    }
);

test('an axisIncrement that would draw too many axis lines makes the chart warn', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { waitForChanges } = await render(
        <limel-chart type="bar" items={largeItems} axisIncrement={1} />
    );
    await waitForChanges();

    expect(warn).toHaveBeenCalledExactlyOnceWith(
        'limel-chart: `axisIncrement` 1 would divide the axis into more than 100 steps. Working out a step from the values instead.'
    );
    warn.mockRestore();
});

test('items that grow too large for axisIncrement make the chart warn', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { root, waitForChanges } = await render(
        <limel-chart
            type="bar"
            items={[{ text: 'Revenue', value: 50 }]}
            axisIncrement={1}
        />
    );
    await waitForChanges();

    root.items = largeItems;
    await waitForChanges();

    expect(warn).toHaveBeenCalledExactlyOnceWith(
        'limel-chart: `axisIncrement` 1 would divide the axis into more than 100 steps. Working out a step from the values instead.'
    );
    warn.mockRestore();
});

test('a chart without a value axis does not warn about axisIncrement', async () => {
    const warn = vi.spyOn(console, 'warn');

    const { waitForChanges } = await render(
        <limel-chart type="pie" items={largeItems} axisIncrement={1} />
    );
    await waitForChanges();

    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
});

test('changing axisIncrement to one that is not above 0 makes the chart warn', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { root, waitForChanges } = await render(
        <limel-chart type="bar" items={items} axisIncrement={25} />
    );
    await waitForChanges();

    root.axisIncrement = -10;
    await waitForChanges();

    expect(warn).toHaveBeenCalledExactlyOnceWith(
        'limel-chart: `axisIncrement` must be above 0, but was -10. Working out a step from the values instead.'
    );
    warn.mockRestore();
});

test('a stacked-bar chart warns that the type is now called proportion-bar', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { waitForChanges } = await render(
        <limel-chart type="stacked-bar" items={items} />
    );
    await waitForChanges();

    expect(warn).toHaveBeenCalledExactlyOnceWith(
        'limel-chart: the type `stacked-bar` is now called `proportion-bar`. It draws the same chart, but please use the new name.'
    );
    warn.mockRestore();
});

test('changing the type to stacked-bar makes the chart warn', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { root, waitForChanges } = await render(
        <limel-chart type="bar" items={items} />
    );
    await waitForChanges();

    root.type = 'stacked-bar';
    await waitForChanges();

    expect(warn).toHaveBeenCalledExactlyOnceWith(
        'limel-chart: the type `stacked-bar` is now called `proportion-bar`. It draws the same chart, but please use the new name.'
    );
    warn.mockRestore();
});

test.each([undefined, 'proportion-bar'] as const)(
    'a chart of type %s does not warn about its type',
    async (type) => {
        const warn = vi.spyOn(console, 'warn');

        const { waitForChanges } = await render(
            <limel-chart type={type} items={items} />
        );
        await waitForChanges();

        expect(warn).not.toHaveBeenCalled();
        warn.mockRestore();
    }
);

test('a currency that is not a three-letter code makes the chart warn', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { waitForChanges } = await render(
        <limel-chart
            type="bar"
            items={items}
            valueFormat="currency"
            currency="kronor"
        />
    );
    await waitForChanges();

    expect(warn).toHaveBeenCalledExactlyOnceWith(
        'limel-chart: `currency` must be a three-letter code such as `SEK` when `valueFormat` is `currency`, but was "kronor". Writing the values as numbers instead.'
    );
    warn.mockRestore();
});

test('changing valueFormat to currency without a currency makes the chart warn', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { root, waitForChanges } = await render(
        <limel-chart type="bar" items={items} />
    );
    await waitForChanges();

    root.valueFormat = 'currency';
    await waitForChanges();

    expect(warn).toHaveBeenCalledExactlyOnceWith(
        'limel-chart: `currency` must be a three-letter code such as `SEK` when `valueFormat` is `currency`, but was undefined. Writing the values as numbers instead.'
    );
    warn.mockRestore();
});

test('a chart of amounts with a currency code does not warn', async () => {
    const warn = vi.spyOn(console, 'warn');

    const { waitForChanges } = await render(
        <limel-chart
            type="bar"
            items={items}
            valueFormat="currency"
            currency="SEK"
        />
    );
    await waitForChanges();

    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
});

test('a language this browser cannot write values in makes the chart warn once', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { root, waitForChanges } = await render(
        <limel-chart type="bar" items={items} language={'sv_SE' as any} />
    );
    await waitForChanges();

    root.items = [...items];
    await waitForChanges();

    expect(warn).toHaveBeenCalledExactlyOnceWith(
        'limel-chart: `language` must be one that this browser can write values in, such as `sv`, but was "sv_SE". Writing the values in English instead.'
    );
    warn.mockRestore();
});

test('a language this browser can write values in does not make the chart warn', async () => {
    const warn = vi.spyOn(console, 'warn');

    const { waitForChanges } = await render(
        <limel-chart type="bar" items={items} language="sv" />
    );
    await waitForChanges();

    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
});

test('setting valueFormat and currency together does not make the chart warn', async () => {
    const warn = vi.spyOn(console, 'warn');
    const { root, waitForChanges } = await render(
        <limel-chart type="bar" items={items} />
    );
    await waitForChanges();

    root.valueFormat = 'currency';
    root.currency = 'SEK';
    await waitForChanges();

    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
});

test.each([1, 0])(
    'a chart of dates does not warn about an axisIncrement of %d',
    async (axisIncrement) => {
        const warn = vi.spyOn(console, 'warn');

        const { waitForChanges } = await render(
            <limel-chart
                type="bar"
                items={[{ text: 'Signed', value: Date.UTC(2026, 0, 12) }]}
                valueFormat="date"
                axisIncrement={axisIncrement}
            />
        );
        await waitForChanges();

        expect(warn).not.toHaveBeenCalled();
        warn.mockRestore();
    }
);

test('a chart of dates with a value that is not a date warns once', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { root, waitForChanges } = await render(
        <limel-chart
            type="bar"
            valueFormat="date"
            items={[
                { text: 'Signed', value: Date.UTC(2026, 0, 12) },
                { text: 'Lost', value: 1.7e18 },
            ]}
        />
    );
    await waitForChanges();

    root.language = 'sv';
    await waitForChanges();

    expect(warn).toHaveBeenCalledExactlyOnceWith(
        'limel-chart: with `valueFormat` `date`, each value must be a date in milliseconds since 1970, as `Date.getTime()` gives, but was 1700000000000000000. Showing it as it is.'
    );
    warn.mockRestore();
});

test('a chart of numbers with large values does not warn about dates', async () => {
    const warn = vi.spyOn(console, 'warn');

    const { waitForChanges } = await render(
        <limel-chart type="bar" items={[{ text: 'Big', value: 1.7e18 }]} />
    );
    await waitForChanges();

    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
});

test('switching a chart from dates to numbers together with its items does not warn about axisIncrement', async () => {
    const warn = vi.spyOn(console, 'warn');
    const { root, waitForChanges } = await render(
        <limel-chart
            type="bar"
            valueFormat="date"
            axisIncrement={10}
            items={[{ text: 'Signed', value: Date.UTC(2026, 0, 12) }]}
        />
    );
    await waitForChanges();

    root.valueFormat = 'number';
    root.items = [{ text: 'Deals', value: 40 }];
    await waitForChanges();

    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
});

const series = [
    { text: 'Won', items: [{ text: 'Jan', value: 12 }] },
    { text: 'Lost', items: [{ text: 'Jan', value: 7 }] },
];

async function renderAndCollectWarnings(chart: VNode) {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { waitForChanges } = await render(chart);
    await waitForChanges();
    const warnings = warn.mock.calls.map(([message]) => message);
    warn.mockRestore();

    return warnings;
}

test('series on a type that cannot draw them make the chart warn', async () => {
    const warnings = await renderAndCollectWarnings(
        <limel-chart type="pie" series={series} />
    );

    expect(warnings).toEqual([
        'limel-chart: `series` can only be drawn by `bar`, `dot`, `line`, and `area` charts, but `type` is `pie`. Drawing the items of the first series instead.',
    ]);
});

test('series and items on a type that cannot draw series make the chart warn that it draws the items', async () => {
    const warnings = await renderAndCollectWarnings(
        <limel-chart type="pie" series={series} items={items} />
    );

    expect(warnings).toEqual([
        'limel-chart: `series` can only be drawn by `bar`, `dot`, `line`, and `area` charts, but `type` is `pie`. Drawing `items` instead.',
    ]);
});

test('series and items together make the chart warn that it draws the series', async () => {
    const warnings = await renderAndCollectWarnings(
        <limel-chart type="bar" series={series} items={items} />
    );

    expect(warnings).toEqual([
        'limel-chart: both `items` and `series` are set. Drawing `series`, and leaving out `items`.',
    ]);
});

test('series on a type that can draw them do not make the chart warn', async () => {
    const warnings = await renderAndCollectWarnings(
        <limel-chart type="line" series={series} />
    );

    expect(warnings).toEqual([]);
});
