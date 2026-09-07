import { render, h } from '@stencil/vitest';
import { ChartItem } from './chart.types';

const items: ChartItem[] = [
    { text: 'Applications', value: 25 },
    { text: 'Photos', value: 75 },
];

type Props = Partial<
    Pick<
        HTMLLimelChartElement,
        'type' | 'items' | 'maxValue' | 'displayItemPercentage'
    >
>;

async function setup(props: Props = {}) {
    const { root, waitForChanges } = await render(
        <limel-chart items={items} {...props} />
    );
    await waitForChanges();

    const shadow = root.shadowRoot;
    const tooltips = [
        ...shadow.querySelectorAll('limel-tooltip'),
    ] as HTMLLimelTooltipElement[];
    const rows = [...shadow.querySelectorAll('tr.item')];
    const sizes = rows.map((row) =>
        Number(
            (row as HTMLElement).style.getPropertyValue(
                '--limel-chart-item-size'
            )
        )
    );

    return {
        labels: tooltips.map((tooltip) => tooltip.label),
        values: tooltips.map((tooltip) => tooltip.helperLabel),
        sizes,
        offsets: rows.map((row) =>
            Number(
                (row as HTMLElement).style.getPropertyValue(
                    '--limel-chart-item-offset'
                )
            )
        ),
    };
}

describe('limel-chart', () => {
    describe('items that are parts of a whole', () => {
        test('a stacked bar sizes its items as shares of their sum', async () => {
            const { labels, sizes } = await setup();

            expect(sizes).toEqual([25, 75]);
            expect(labels).toEqual([
                'Applications (25.00%)',
                'Photos (75.00%)',
            ]);
        });

        test('maxValue is the whole, and is not rounded to an axis step', async () => {
            const { labels, sizes } = await setup({ maxValue: 210 });

            expect(sizes[0]).toBeCloseTo(11.9, 1);
            expect(labels[0]).toBe('Applications (11.90%)');
        });

        test('a pie fills the whole circle', async () => {
            const { sizes } = await setup({ type: 'pie' });

            expect(sizes[0] + sizes[1]).toBe(100);
        });

        test('a ring shows each item as its share of maxValue', async () => {
            const { labels, sizes } = await setup({
                type: 'ring',
                maxValue: 250,
            });

            expect(sizes).toEqual([10, 30]);
            expect(labels[0]).toBe('Applications (10.00%)');
        });

        test('changing the type recalculates the range', async () => {
            const { root, waitForChanges } = await render(
                <limel-chart items={items} type="bar" />
            );
            await waitForChanges();

            root.type = 'ring';
            await waitForChanges();

            const sizes = [...root.shadowRoot.querySelectorAll('tr.item')].map(
                (row) =>
                    Number(
                        (row as HTMLElement).style.getPropertyValue(
                            '--limel-chart-item-size'
                        )
                    )
            );

            expect(sizes).toEqual([25, 75]);
        });

        test('range items use their extents as shares', async () => {
            const rangeItems: ChartItem[] = [
                { text: 'Planning', value: [10, 40] },
                { text: 'Delivery', value: [40, 100] },
            ];
            const { labels, sizes } = await setup({ items: rangeItems });

            expect(sizes[0]).toBeCloseTo(100 / 3);
            expect(sizes[1]).toBeCloseTo((100 * 2) / 3);
            expect(labels).toEqual(['Planning (33.33%)', 'Delivery (66.67%)']);
        });

        test('ring range items start at zero', async () => {
            const rangeItems: ChartItem[] = [
                { text: 'Planning', value: [10, 40] },
                { text: 'Delivery', value: [40, 100] },
            ];
            const { offsets, sizes } = await setup({
                type: 'ring',
                items: rangeItems,
                maxValue: 90,
            });

            expect(offsets).toEqual([0, 0]);
            expect(sizes[0]).toBeCloseTo(100 / 3);
            expect(sizes[1]).toBeCloseTo((100 * 2) / 3);
        });

        test('negative items are not inverted into positive shares', async () => {
            const negativeItems: ChartItem[] = [
                { text: 'First', value: -5 },
                { text: 'Second', value: -10 },
                { text: 'Third', value: -15 },
            ];
            const { sizes } = await setup({ items: negativeItems });

            expect(sizes.every((size) => size < 0)).toBe(true);
        });
    });

    describe('displayItemPercentage', () => {
        test('set to false, the tooltip shows the text alone', async () => {
            const { labels } = await setup({ displayItemPercentage: false });

            expect(labels).toEqual(['Applications', 'Photos']);
        });

        test('set to false, the tooltip still shows the value', async () => {
            const { values } = await setup({ displayItemPercentage: false });

            expect(values).toEqual(['25', '75']);
        });
    });

    describe('items on an axis', () => {
        test.each(['bar', 'dot', 'line', 'area'] as const)(
            'a %s chart shows no percentage',
            async (type) => {
                const { labels } = await setup({ type });

                expect(labels).toEqual(['Applications', 'Photos']);
            }
        );
    });
});
