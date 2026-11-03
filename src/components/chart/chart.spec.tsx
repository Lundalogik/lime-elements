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
