import { render, h } from '@stencil/vitest';
import { onTestFinished } from 'vitest';
import { userEvent } from 'vitest/browser';
import { ChartItem } from './chart.types';

const RED = 'rgb(255, 0, 0)';
const GREEN = 'rgb(0, 128, 0)';
const BLUE = 'rgb(0, 0, 255)';

const reports: ChartItem = {
    text: 'Reports',
    value: 40,
    color: RED,
    clickable: true,
};
const archive: ChartItem = { text: 'Archive', value: 60, color: BLUE };

let unmount: () => void;

beforeEach(() => {
    preferReducedMotion();
});

afterEach(() => {
    unmount?.();
    vi.restoreAllMocks();
});

function preferReducedMotion() {
    const matchMedia = window.matchMedia.bind(window);
    vi.spyOn(window, 'matchMedia').mockImplementation((query: string) =>
        matchMedia(
            query.includes('prefers-reduced-motion') ? '(min-width: 0)' : query
        )
    );
}

type Props = Partial<
    Pick<
        HTMLLimelChartElement,
        | 'type'
        | 'items'
        | 'orientation'
        | 'maxValue'
        | 'axisIncrement'
        | 'displayAxisLabels'
        | 'displayItemText'
        | 'displayItemValue'
        | 'displayItemPercentage'
        | 'accessibleItemsLabel'
        | 'accessibleValuesLabel'
        | 'language'
    >
> & {
    style?: Record<string, string>;
};

async function setup(props: Props = {}) {
    const onInteract = vi.fn();
    const rendered = await render(
        <div style={{ width: '300px', height: '200px' }}>
            <limel-chart
                type="bar"
                items={[reports, archive]}
                onInteract={onInteract}
                {...props}
            />
        </div>
    );
    unmount = rendered.unmount;
    await rendered.waitForChanges();

    return {
        onInteract: onInteract,
        container: rendered.root as HTMLElement,
        chart: rendered.root.querySelector('limel-chart'),
        waitForChanges: rendered.waitForChanges,
    };
}

function findDrawn(chart: HTMLLimelChartElement, fill: string) {
    return chart.shadowRoot.querySelector<SVGElement>(
        `.plot path[fill="${fill}"]`
    );
}

async function drawn(chart: HTMLLimelChartElement, fill: string) {
    await expect.poll(() => findDrawn(chart, fill)).toBeTruthy();

    return findDrawn(chart, fill);
}

function getDrawing(chart: HTMLLimelChartElement) {
    return chart.shadowRoot.querySelector('.plot svg')?.outerHTML;
}

function getOpacity(chart: HTMLLimelChartElement, fill: string) {
    return findDrawn(chart, fill)?.getAttribute('fill-opacity');
}

function findStroke(chart: HTMLLimelChartElement, stroke: string) {
    return chart.shadowRoot.querySelector(`.plot path[stroke="${stroke}"]`);
}

function addStyles(css: string) {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.append(style);
    onTestFinished(() => style.remove());
}

function getItemTexts(chart: HTMLLimelChartElement) {
    return [...chart.shadowRoot.querySelectorAll('.plot text')]
        .map((text) => text.textContent)
        .filter((text) => text.startsWith('Item with'));
}

function getTooltip() {
    return [...document.body.children].find((element) =>
        element.textContent.includes('Reports')
    );
}

test('clicking a drawn item that is clickable emits interact', async () => {
    const { chart, onInteract } = await setup();

    await userEvent.click(await drawn(chart, RED));

    expect(onInteract).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ detail: reports })
    );
});

test('clicking a drawn item that is not clickable emits nothing', async () => {
    const { chart, onInteract } = await setup();

    await userEvent.click(await drawn(chart, BLUE));

    expect(onInteract).not.toHaveBeenCalled();
});

test('clicking far above the dot of a line chart emits interact', async () => {
    const { chart, onInteract } = await setup({ type: 'line' });
    await drawn(chart, RED);

    await userEvent.click(chart.shadowRoot.querySelector('.plot'), {
        position: { x: 90, y: 15 },
    });

    expect(onInteract).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ detail: reports })
    );
});

test('changing the items redraws the chart', async () => {
    const { chart } = await setup();
    await drawn(chart, RED);

    chart.items = [{ ...reports, color: GREEN }, archive];

    expect(await drawn(chart, GREEN)).toBeTruthy();
});

const drawnChanges: Array<[keyof Props, Props]> = [
    ['type', { type: 'line' }],
    ['orientation', { orientation: 'portrait' }],
    ['maxValue', { maxValue: 200 }],
    ['axisIncrement', { axisIncrement: 50 }],
    ['displayAxisLabels', { displayAxisLabels: false }],
    ['displayItemText', { displayItemText: true }],
    ['displayItemValue', { displayItemValue: true }],
    ['accessibleItemsLabel', { accessibleItemsLabel: 'Folders' }],
    ['accessibleValuesLabel', { accessibleValuesLabel: 'Megabytes' }],
    ['language', { language: 'sv' }],
];

test.each(drawnChanges)('changing %s redraws the chart', async (_, change) => {
    const { chart } = await setup({ displayAxisLabels: true });
    await drawn(chart, RED);
    const before = getDrawing(chart);

    Object.assign(chart, change);

    await expect.poll(() => getDrawing(chart)).not.toBe(before);
});

test('changing displayItemPercentage changes the tooltips', async () => {
    const { chart, waitForChanges } = await setup({
        type: 'pie',
        displayItemPercentage: false,
    });
    await drawn(chart, RED);

    chart.displayItemPercentage = true;
    await waitForChanges();
    chart.shadowRoot.querySelector<HTMLElement>('tbody tr').focus();

    await expect.poll(() => getTooltip()?.textContent).toContain('40.00%');
});

test('a chart that was hidden draws the items it got while hidden', async () => {
    const { chart, container, waitForChanges } = await setup();
    await drawn(chart, RED);

    container.style.display = 'none';
    chart.items = [{ ...reports, color: GREEN }, archive];
    await waitForChanges();
    container.style.display = '';

    expect(await drawn(chart, GREEN)).toBeTruthy();
});

test('focusing an item shows its tooltip', async () => {
    const { chart } = await setup();
    await drawn(chart, RED);

    chart.shadowRoot.querySelector<HTMLElement>('tbody tr').focus();

    await expect.poll(() => getTooltip()?.textContent).toContain('40');
});

test('focusing an item fades the other items', async () => {
    const { chart } = await setup();
    await drawn(chart, BLUE);

    chart.shadowRoot.querySelector<HTMLElement>('tbody tr').focus();

    await expect.poll(() => getOpacity(chart, BLUE)).toBe('0.4');
});

test('hovering the column of a dot fades the other items', async () => {
    const { chart } = await setup({ type: 'line' });
    await drawn(chart, BLUE);

    await userEvent.hover(chart.shadowRoot.querySelector('.plot'), {
        position: { x: 90, y: 15 },
    });

    await expect.poll(() => getOpacity(chart, BLUE)).toBe('0.4');
});

test('items without a color are drawn in --chart-item-color', async () => {
    const { chart } = await setup({
        items: [{ text: 'Reports', value: 40 }],
        style: { '--chart-item-color': GREEN },
    });

    expect(await drawn(chart, GREEN)).toBeTruthy();
});

test('an item color that is not a color is drawn in the default item color, with a warning', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { chart } = await setup({
        items: [{ text: 'Reports', value: 40, color: 'url(#stripes)' }],
        style: { '--chart-item-color': GREEN },
    });

    expect(await drawn(chart, GREEN)).toBeTruthy();
    expect(warn).toHaveBeenCalledExactlyOnceWith(
        'limel-chart: the color of an item must be a CSS color, but was `url(#stripes)`. Using the default item color instead.'
    );
});

test('an item color made of variables is drawn in the color they make', async () => {
    const warn = vi.spyOn(console, 'warn');
    const { chart } = await setup({
        items: [{ text: 'Reports', value: 40, color: 'rgb(var(--red))' }],
        style: { '--red': '255, 0, 0' },
    });

    expect(await drawn(chart, RED)).toBeTruthy();
    expect(warn).not.toHaveBeenCalled();
});

test('an item color that is not a color once its variables are filled in is drawn in the default item color, with a warning', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const color = 'linear-gradient(rgb(var(--red)), rgb(var(--blue)))';
    const { chart } = await setup({
        items: [{ text: 'Reports', value: 40, color: color }],
        style: {
            '--chart-item-color': GREEN,
            '--red': '255, 0, 0',
            '--blue': '0, 0, 255',
        },
    });

    expect(await drawn(chart, GREEN)).toBeTruthy();
    expect(warn).toHaveBeenCalledExactlyOnceWith(
        `limel-chart: the color of an item must be a CSS color, but was \`${color}\`. Check that its variables are set, and that they make a color. Using the default item color instead.`
    );
});

test('the axis lines are drawn in --chart-axis-line-color', async () => {
    const { chart } = await setup({
        style: { '--chart-axis-line-color': GREEN },
    });

    await expect.poll(() => findStroke(chart, GREEN)).toBeTruthy();
});

test('a --chart-axis-line-color that is not a color is drawn in the color of the text, with a warning', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { chart } = await setup({
        style: { '--chart-axis-line-color': 'url(#lines)' },
    });
    await drawn(chart, RED);

    expect(warn).toHaveBeenCalledExactlyOnceWith(
        'limel-chart: `--chart-axis-line-color` must be a CSS color, but was `url(#lines)`. Using the color of the text instead.'
    );
});

test('the dots of a scatter chart are as wide as --chart-scatter-item-size', async () => {
    const { chart } = await setup({
        type: 'scatter',
        items: [{ text: 'Deal', value: [4, 32], color: RED }],
        style: { '--chart-scatter-item-size': '1.25rem' },
    });

    const dot = await drawn(chart, RED);

    expect(dot.getBoundingClientRect().width).toBeCloseTo(20, 0);
});

test('the chart is drawn again in the colors of the theme when the page switches theme', async () => {
    addStyles(`
        limel-chart { --chart-item-color: ${RED}; }
        :root[data-theme='dark'] limel-chart { --chart-item-color: ${GREEN}; }
    `);
    onTestFinished(() => delete document.documentElement.dataset.theme);
    const { chart } = await setup({ items: [{ text: 'Reports', value: 40 }] });
    await drawn(chart, RED);

    document.documentElement.dataset.theme = 'dark';

    expect(await drawn(chart, GREEN)).toBeTruthy();
});

test('the chart is drawn again when its style changes', async () => {
    const { chart } = await setup({
        items: [{ text: 'Reports', value: 40 }],
        style: { '--chart-item-color': RED },
    });
    await drawn(chart, RED);

    chart.style.setProperty('--chart-item-color', GREEN);

    expect(await drawn(chart, GREEN)).toBeTruthy();
});

test('the chart is drawn again when its class changes', async () => {
    addStyles(`
        limel-chart { --chart-item-color: ${RED}; }
        limel-chart.selected { --chart-item-color: ${GREEN}; }
    `);
    const { chart } = await setup({ items: [{ text: 'Reports', value: 40 }] });
    await drawn(chart, RED);

    chart.classList.add('selected');

    expect(await drawn(chart, GREEN)).toBeTruthy();
});

test('an item color made of variables is drawn again when they change', async () => {
    const { chart } = await setup({
        items: [{ text: 'Reports', value: 40, color: 'rgb(var(--brand))' }],
        style: { '--brand': '255, 0, 0' },
    });
    await drawn(chart, RED);

    chart.style.setProperty('--brand', '0, 128, 0');

    expect(await drawn(chart, GREEN)).toBeTruthy();
});

test('a portrait stacked bar keeps the height it is given, however small', async () => {
    const { chart } = await setup({
        type: 'stacked-bar',
        orientation: 'portrait',
        style: { height: '2px' },
    });

    expect(chart.getBoundingClientRect().height).toBe(2);
});

test.each(['bar', 'dot', 'line', 'area', 'scatter'] as const)(
    '%s charts in a container without a height are half as tall as they are wide',
    async (type) => {
        const rendered = await render(
            <div style={{ width: '300px' }}>
                <limel-chart type={type} items={[reports, archive]} />
            </div>
        );
        unmount = rendered.unmount;
        const chart = rendered.root.querySelector('limel-chart');

        await expect.poll(() => chart.getBoundingClientRect().height).toBe(150);
    }
);

test('an axis chart keeps the height its container gives it', async () => {
    const { chart } = await setup();

    expect(chart.getBoundingClientRect().height).toBe(200);
});

test('an axis chart keeps its min-height in a container without a height', async () => {
    const rendered = await render(
        <div style={{ width: '300px' }}>
            <limel-chart
                type="bar"
                items={[reports, archive]}
                style={{ minHeight: '100px' }}
            />
        </div>
    );
    unmount = rendered.unmount;
    const chart = rendered.root.querySelector('limel-chart');
    await drawn(chart, RED);

    expect(chart.getBoundingClientRect().height).toBe(100);
});

test('the chart is drawn inside its padding', async () => {
    const { chart } = await setup({ style: { padding: '20px' } });
    await drawn(chart, RED);

    const host = chart.getBoundingClientRect();
    const drawing = chart.shadowRoot
        .querySelector('.plot svg')
        .getBoundingClientRect();

    expect([
        drawing.left - host.left,
        drawing.top - host.top,
        drawing.width,
        drawing.height,
    ]).toEqual([20, 20, 260, 160]);
});

test('a stacked bar with a padding and no height draws its items', async () => {
    const rendered = await render(
        <div style={{ width: '300px' }}>
            <limel-chart
                type="stacked-bar"
                items={[reports, archive]}
                style={{ padding: '0.25rem' }}
            />
        </div>
    );
    unmount = rendered.unmount;
    const chart = rendered.root.querySelector('limel-chart');

    expect(await drawn(chart, RED)).toBeTruthy();
});

test('a stacked bar is drawn with round ends', async () => {
    const { chart } = await setup({ type: 'stacked-bar' });
    await drawn(chart, RED);

    const plot = getComputedStyle(chart.shadowRoot.querySelector('.plot'));

    expect([plot.borderTopLeftRadius, plot.overflow]).toEqual([
        '4px',
        'hidden',
    ]);
});

test('an item color that ECharts cannot read is converted to one it can', async () => {
    const { chart } = await setup({
        items: [
            {
                text: 'Reports',
                value: 40,
                color: 'color-mix(in srgb, rgb(255, 0, 0), rgb(0, 0, 255))',
            },
        ],
    });

    expect(await drawn(chart, 'rgb(128,0,128)')).toBeTruthy();
});

const longTexts: ChartItem[] = [1, 2, 3, 4].map((number) => ({
    text: `Item with a long text, number ${number}`,
    value: number,
}));

test('every item text is shown, cut short to the space of its item', async () => {
    const { chart } = await setup({ items: longTexts, displayItemText: true });

    await expect
        .poll(() => getItemTexts(chart))
        .toEqual(['Item with…', 'Item with…', 'Item with…', 'Item with…']);
});

test('the item texts are fitted again when the chart gets wider', async () => {
    const { chart, container } = await setup({
        items: longTexts,
        displayItemText: true,
    });
    await expect.poll(() => getItemTexts(chart)).toHaveLength(4);

    container.style.width = '1200px';

    await expect
        .poll(() => getItemTexts(chart))
        .toEqual(longTexts.map((item) => item.text));
});
