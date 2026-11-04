import { render, h } from '@stencil/vitest';
import { onTestFinished } from 'vitest';
import { userEvent } from 'vitest/browser';
import { ChartSeries, ChartType } from './chart.types';

const RED = 'rgb(255, 0, 0)';
const BLUE = 'rgb(0, 0, 255)';
const GREEN = 'rgb(0, 128, 0)';

const won: ChartSeries = {
    text: 'Won',
    color: RED,
    items: [
        { text: 'Jan', value: 12 },
        { text: 'Feb', value: 15 },
        { text: 'Mar', value: 9 },
    ],
};

const lost: ChartSeries = {
    text: 'Lost',
    color: BLUE,
    items: [
        { text: 'Jan', value: 7 },
        { text: 'Mar', value: 11 },
    ],
};

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

async function setup(
    series: ChartSeries[] = [won, lost],
    type: ChartType = 'bar',
    props: Partial<HTMLLimelChartElement> = {}
) {
    const rendered = await render(
        <div style={{ width: '300px', height: '200px' }}>
            <button>Before the chart</button>
            <limel-chart type={type} series={series} {...props} />
        </div>
    );
    unmount = rendered.unmount;
    await rendered.waitForChanges();

    const chart = rendered.root.querySelector('limel-chart');

    return {
        chart: chart,
        before: rendered.root.querySelector('button'),
        waitForChanges: rendered.waitForChanges,
        cell: (series: number, index: number) =>
            chart.shadowRoot.querySelector<HTMLElement>(
                `td[data-series="${series}"][data-index="${index}"]`
            ),
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

function addStyles(css: string) {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.append(style);
    onTestFinished(() => style.remove());
}

function getSwatches(chart: HTMLLimelChartElement) {
    return [...chart.shadowRoot.querySelectorAll('li > span')].map((swatch) =>
        getComputedStyle(swatch)
    );
}

function getSwatchColors(chart: HTMLLimelChartElement) {
    return getSwatches(chart).map((swatch) => swatch.backgroundColor);
}

function getTooltip(text = 'Won') {
    return [...document.body.children].find((element) =>
        element.textContent.includes(text)
    );
}

function isShown(element?: Element) {
    const style = element && getComputedStyle(element);

    return (
        Boolean(style) &&
        style.display !== 'none' &&
        style.visibility !== 'hidden'
    );
}

test('each series is drawn in its color', async () => {
    const { chart } = await setup();

    expect(await drawn(chart, RED)).toBeTruthy();
    expect(await drawn(chart, BLUE)).toBeTruthy();
});

test('series without a color are drawn in colors of their own, as the legend shows them', async () => {
    addStyles(
        ':root { --color-blue-default: 33, 150, 243; --color-coral-default: 255, 87, 34; }'
    );
    const { chart } = await setup([
        { ...won, color: undefined },
        { ...lost, color: undefined },
    ]);
    const [first, second] = getSwatchColors(chart);

    expect([first, second]).toEqual(['rgb(33, 150, 243)', 'rgb(255, 87, 34)']);
    expect(await drawn(chart, first)).toBeTruthy();
    expect(await drawn(chart, second)).toBeTruthy();
});

test('an item with a color of its own is drawn in it, instead of the color of its series', async () => {
    const { chart } = await setup([
        { ...won, items: [{ text: 'Jan', value: 12, color: GREEN }] },
        lost,
    ]);

    expect(await drawn(chart, GREEN)).toBeTruthy();
});

test('an item color that is not a color is drawn in the color of its series, with a warning saying so', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { chart } = await setup([
        { ...won, items: [{ text: 'Jan', value: 12, color: 'url(#stripes)' }] },
        lost,
    ]);

    expect(await drawn(chart, RED)).toBeTruthy();
    expect(warn).toHaveBeenCalledExactlyOnceWith(
        'limel-chart: the color of an item must be a CSS color, but was `url(#stripes)`. Using the color of its series instead.'
    );
});

test('a series color that is not a color is drawn, and shown in the legend, in the default series color, with a warning', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    addStyles(':root { --color-blue-default: 33, 150, 243; }');
    const { chart } = await setup([
        { ...won, color: 'var(--brand-green)' },
        lost,
    ]);
    const [swatch] = getSwatchColors(chart);

    expect(swatch).toBe('rgb(33, 150, 243)');
    expect(await drawn(chart, swatch)).toBeTruthy();
    expect(warn).toHaveBeenCalledExactlyOnceWith(
        'limel-chart: the color of a series must be a CSS color, but was `var(--brand-green)`. Check that its variables are set, and that they make a color. Using the default series color instead.'
    );
});

test('the legend follows a change of theme that makes a series color a color', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    addStyles(':root { --color-blue-default: 33, 150, 243; }');
    const { chart } = await setup([
        { ...won, color: 'rgb(var(--brand))' },
        lost,
    ]);
    await drawn(chart, BLUE);

    chart.style.setProperty('--brand', '0, 128, 0');

    await expect.poll(() => getSwatchColors(chart)[0]).toBe(GREEN);
    expect(await drawn(chart, GREEN)).toBeTruthy();
});

test('a chart that is updated while it is out of the page does not warn about its series colors', async () => {
    const warn = vi.spyOn(console, 'warn');
    const { chart, waitForChanges } = await setup();
    const container = chart.parentElement;
    chart.remove();

    chart.series = [lost, won];
    await waitForChanges();
    container.append(chart);

    expect(warn).not.toHaveBeenCalled();
});

test('clicking a drawn item of a series after a place where it has none emits that item', async () => {
    const lostInMarch = { text: 'Mar', value: 11, clickable: true };
    const { chart } = await setup([
        won,
        { ...lost, items: [lost.items[0], lostInMarch] },
    ]);
    const onInteract = vi.fn();
    chart.addEventListener('interact', onInteract);
    await drawn(chart, BLUE);
    const [, march] = chart.shadowRoot.querySelectorAll<SVGElement>(
        `.plot path[fill="${BLUE}"]`
    );

    await userEvent.click(march);

    expect(onInteract).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ detail: lostInMarch })
    );
});

test('the legend of a dot chart marks each series with a dot', async () => {
    const { chart } = await setup();
    chart.type = 'dot';

    await expect
        .poll(() => getSwatches(chart).map((swatch) => swatch.borderRadius))
        .toEqual(['50%', '50%']);
});

test('clicking the start dot of a range in a later series emits that item', async () => {
    const range = {
        text: 'Jan',
        value: [2, 8] as [number, number],
        clickable: true,
    };
    const { chart } = await setup([won, { ...lost, items: [range] }], 'dot');
    const onInteract = vi.fn();
    chart.addEventListener('interact', onInteract);
    await drawn(chart, BLUE);
    const dots = [
        ...chart.shadowRoot.querySelectorAll<SVGElement>(
            `.plot path[fill="${BLUE}"]`
        ),
    ].filter((path) => path.getBoundingClientRect().width > 4);
    const top = (dot: SVGElement) => dot.getBoundingClientRect().top;
    const [start] = dots.sort((a, b) => top(b) - top(a));

    await userEvent.click(start);

    expect(onInteract).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ detail: range })
    );
});

test('a type that cannot draw series draws the items of the first series in its color', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { chart } = await setup([won, lost], 'pie');

    expect(await drawn(chart, RED)).toBeTruthy();
});

test('a type that cannot draw series draws the items of a first series without a color in the first color of the palette', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    addStyles(':root { --color-blue-default: 33, 150, 243; }');
    const { chart } = await setup([{ ...won, color: undefined }], 'pie');

    expect(await drawn(chart, 'rgb(33, 150, 243)')).toBeTruthy();
});

test('clicking a point of a dense clickable line emits its item', async () => {
    const weeks = Array.from({ length: 40 }, (_, index) => ({
        text: `Week ${index + 1}`,
        value: index % 7,
        clickable: true,
    }));
    const { chart } = await setup([{ ...won, items: weeks }], 'line');
    const onInteract = vi.fn();
    chart.addEventListener('interact', onInteract);
    await drawn(chart, RED);
    const points = chart.shadowRoot.querySelectorAll<SVGElement>(
        `.plot path[fill="${RED}"]`
    );

    await userEvent.click(points[9]);

    expect(onInteract).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ detail: weeks[9] })
    );
});

test('clicking a point of a clickable line where the points overlap emits the item of the nearest place', async () => {
    const days = Array.from({ length: 100 }, (_, index) => ({
        text: `Day ${index + 1}`,
        value: 3,
        clickable: true,
    }));
    const { chart } = await setup([{ ...won, items: days }], 'line');
    const onInteract = vi.fn();
    chart.addEventListener('interact', onInteract);
    await drawn(chart, RED);
    const points = chart.shadowRoot.querySelectorAll<SVGElement>(
        `.plot path[fill="${RED}"]`
    );

    await userEvent.click(points[50], { force: true });

    expect(onInteract).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ detail: days[50] })
    );
});

test('a dense clickable line shows only the value labels that fit', async () => {
    const weeks = Array.from({ length: 40 }, (_, index) => ({
        text: `Week ${index + 1}`,
        value: 3,
        formattedValue: '3 pts',
        clickable: true,
    }));
    const { chart } = await setup([{ ...won, items: weeks }], 'line', {
        displayItemValue: true,
    });
    await drawn(chart, RED);
    const labels = [...chart.shadowRoot.querySelectorAll('.plot text')].filter(
        (text) => text.textContent.endsWith(' pts')
    );

    expect(labels.length).toBeGreaterThan(0);
    expect(labels.length).toBeLessThan(weeks.length);
});

test('a chart with a legend keeps the height its container gives it', async () => {
    const { chart } = await setup();
    await drawn(chart, RED);

    expect(chart.getBoundingClientRect().height).toBe(200);
});

test('the legend is above the plot', async () => {
    const { chart } = await setup();
    const legend = chart.shadowRoot.querySelector('ul').getBoundingClientRect();
    const plot = chart.shadowRoot
        .querySelector('.plot')
        .getBoundingClientRect();

    expect(legend.bottom).toBeLessThanOrEqual(plot.top);
});

test('focusing a value shows the values of every series at its place on the axis', async () => {
    const { chart, cell } = await setup();
    await drawn(chart, RED);

    cell(0, 2).focus();

    await expect.poll(() => getTooltip()?.textContent).toContain('Mar');
    expect(getTooltip().textContent).toContain('Won9');
    expect(getTooltip().textContent).toContain('Lost11');
});

function phases(name: string): ChartSeries {
    const month = (index: number) => new Date(2026, index, 1).getTime();

    return {
        ...won,
        items: ['A', 'B', 'C'].map((letter, index) => ({
            text: `${name} ${letter}`,
            value: [month(index), month(index + 1)] as [number, number],
        })),
    };
}

test('focusing a range of dates in a series shows the tooltip of its place', async () => {
    const { chart, cell } = await setup([phases('Phase')], 'bar', {
        valueFormat: 'date',
    });
    await drawn(chart, RED);

    cell(0, 2).focus();

    await expect.poll(() => getTooltip('Phase C')).toBeTruthy();
});

test('focusing a range of dates in a series of a portrait chart shows the tooltip of its place', async () => {
    const { chart, cell } = await setup([phases('Step')], 'bar', {
        valueFormat: 'date',
        orientation: 'portrait',
    });
    await drawn(chart, RED);

    cell(0, 0).focus();

    await expect.poll(() => getTooltip('Step A')).toBeTruthy();
});

test('focusing a value of a portrait chart with long item texts shows the tooltip of its place', async () => {
    const { chart, cell } = await setup(
        [
            {
                ...won,
                items: [
                    { text: 'This is a longer category label', value: 4 },
                    { text: 'Another rather long category label', value: 6 },
                ],
            },
        ],
        'bar',
        { orientation: 'portrait', displayItemText: true }
    );
    await drawn(chart, RED);

    cell(0, 1).focus();

    await expect
        .poll(() => getTooltip('Another rather long category label'))
        .toBeTruthy();
});

test('focusing a value above maxValue shows its tooltip', async () => {
    const { chart, cell } = await setup(
        [{ ...won, items: [{ text: 'Overflow', value: 15 }] }],
        'bar',
        { maxValue: 10 }
    );
    await drawn(chart, RED);

    cell(0, 0).focus();

    await expect.poll(() => getTooltip('Overflow')).toBeTruthy();
});

test('the tooltip at a place on the axis goes away when focus leaves its value', async () => {
    const { chart, cell } = await setup();
    await drawn(chart, RED);
    cell(0, 2).focus();
    await expect.poll(() => isShown(getTooltip('Mar'))).toBe(true);

    cell(0, 2).blur();

    await expect.poll(() => isShown(getTooltip('Mar'))).toBe(false);
});

test('the pointer at a place on the axis goes away when focus leaves its value', async () => {
    const { before, chart, cell } = await setup();
    await drawn(chart, RED);
    const plot = () => chart.shadowRoot.querySelector('.plot svg').innerHTML;
    const unfocused = plot();
    cell(0, 2).focus();
    await expect.poll(plot).not.toBe(unfocused);

    before.focus();

    await expect.poll(plot).toBe(unfocused);
});

test('Tab moves focus from before the chart to its first value', async () => {
    const { before, chart, cell } = await setup();
    before.focus();

    await userEvent.tab();

    expect(chart.shadowRoot.activeElement).toBe(cell(0, 0));
});

test('the right arrow moves focus to the next series, at the same place on the axis', async () => {
    const { chart, cell } = await setup();
    cell(0, 0).focus();

    await userEvent.keyboard('{ArrowRight}');

    expect(chart.shadowRoot.activeElement).toBe(cell(1, 0));
});

test('the down arrow moves focus to the next place on the axis, in the same series', async () => {
    const { chart, cell } = await setup();
    cell(0, 0).focus();

    await userEvent.keyboard('{ArrowDown}');

    expect(chart.shadowRoot.activeElement).toBe(cell(0, 1));
});

test('the left arrow moves focus to the previous series, at the same place on the axis', async () => {
    const { chart, cell } = await setup();
    cell(1, 0).focus();

    await userEvent.keyboard('{ArrowLeft}');

    expect(chart.shadowRoot.activeElement).toBe(cell(0, 0));
});

test('the up arrow moves focus to the previous place on the axis, in the same series', async () => {
    const { chart, cell } = await setup();
    cell(0, 2).focus();

    await userEvent.keyboard('{ArrowUp}');

    expect(chart.shadowRoot.activeElement).toBe(cell(0, 1));
});

test('Home moves focus to the first series, at the same place on the axis', async () => {
    const { chart, cell } = await setup();
    cell(1, 2).focus();

    await userEvent.keyboard('{Home}');

    expect(chart.shadowRoot.activeElement).toBe(cell(0, 2));
});

test('End moves focus to the last series, at the same place on the axis', async () => {
    const { chart, cell } = await setup();
    cell(0, 2).focus();

    await userEvent.keyboard('{End}');

    expect(chart.shadowRoot.activeElement).toBe(cell(1, 2));
});

test('the down arrow moves to the next place on the axis, in the nearest series that has an item there', async () => {
    const { chart, cell } = await setup();
    cell(1, 0).focus();

    await userEvent.keyboard('{ArrowDown}');

    expect(chart.shadowRoot.activeElement).toBe(cell(0, 1));
});

test('the down arrow reaches an item that shares neither a place nor a series with the focused one', async () => {
    const { chart, cell } = await setup([
        { ...won, items: [{ text: 'Jan', value: 12 }] },
        { ...lost, items: [{ text: 'Feb', value: 7 }] },
    ]);
    cell(0, 0).focus();

    await userEvent.keyboard('{ArrowDown}');

    expect(chart.shadowRoot.activeElement).toBe(cell(1, 1));
});

test('the right arrow stays on the last series that has an item at the place', async () => {
    const { chart, cell } = await setup();
    cell(0, 1).focus();

    await userEvent.keyboard('{ArrowRight}');

    expect(chart.shadowRoot.activeElement).toBe(cell(0, 1));
});

test('Tab returns to the value that last had focus', async () => {
    const { before, chart, cell, waitForChanges } = await setup();
    cell(0, 0).focus();
    await userEvent.keyboard('{ArrowRight}');
    await waitForChanges();
    before.focus();

    await userEvent.tab();

    expect(chart.shadowRoot.activeElement).toBe(cell(1, 0));
});
