import { ChartItem } from './chart.types';
import {
    alignSeries,
    getAllItems,
    getItemAt,
    getNearestSeries,
} from './series';

const january: ChartItem = { text: 'Jan', value: 12 };
const february: ChartItem = { text: 'Feb', value: 15 };
const march: ChartItem = { text: 'Mar', value: 9 };

test('the categories are the texts of the items, in the order they first appear', () => {
    const grid = alignSeries([
        { text: 'Won', items: [january, february] },
        { text: 'Lost', items: [february, march] },
    ]);

    expect(grid.categories).toEqual(['Jan', 'Feb', 'Mar']);
});

test('items of different series with the same text are at the same place', () => {
    const lostInFebruary = { text: 'Feb', value: 9 };
    const grid = alignSeries([
        { text: 'Won', items: [january, february] },
        { text: 'Lost', items: [lostInFebruary] },
    ]);

    expect(grid.series[1].items[1]).toBe(lostInFebruary);
});

test('a series that leaves out a text has no item at its place', () => {
    const grid = alignSeries([
        { text: 'Won', items: [january, february] },
        { text: 'Lost', items: [february] },
    ]);

    expect(grid.series[1].items).toEqual([undefined, february]);
});

test('a series that has its items in another order is lined up by text', () => {
    const grid = alignSeries([
        { text: 'Won', items: [january, february] },
        { text: 'Lost', items: [february, january] },
    ]);

    expect(grid.series[1].items).toEqual([january, february]);
});

test('the second item with a text lines up with the second one of another series', () => {
    const first = { text: 'Week', value: 1 };
    const second = { text: 'Week', value: 2 };
    const grid = alignSeries([
        { text: 'Won', items: [first, second] },
        { text: 'Lost', items: [second] },
    ]);

    expect(grid.categories).toEqual(['Week', 'Week']);
    expect(grid.series[1].items).toEqual([second, undefined]);
});

test('a single series keeps all of its items, in their order', () => {
    const items = [january, february, { ...january, value: 3 }];

    expect(
        alignSeries([{ text: 'Value', items: items }]).series[0].items
    ).toEqual(items);
});

test('each series keeps its text and color', () => {
    const grid = alignSeries([
        { text: 'Won', color: 'green', items: [january] },
    ]);

    expect(grid.series[0]).toMatchObject({ text: 'Won', color: 'green' });
});

test('a series without items has no items', () => {
    const grid = alignSeries([
        { text: 'Won', items: [january] },
        { text: 'Lost', items: undefined },
    ]);

    expect(grid.series[1].items).toEqual([undefined]);
});

test('the item at a position is found by its series and its category', () => {
    const grid = alignSeries([
        { text: 'Won', items: [january] },
        { text: 'Lost', items: [february] },
    ]);

    expect(getItemAt(grid, { series: 1, index: 1 })).toBe(february);
});

test('there is no item at a position outside the series', () => {
    const grid = alignSeries([{ text: 'Won', items: [january] }]);

    expect(getItemAt(grid, { series: 2, index: 0 })).toBeUndefined();
});

test('all items are the items of every series', () => {
    const grid = alignSeries([
        { text: 'Won', items: [january] },
        { text: 'Lost', items: [february] },
    ]);

    expect(getAllItems(grid)).toEqual([january, february]);
});

test('the nearest series with an item at a place is the series itself, when it has one there', () => {
    const grid = alignSeries([
        { text: 'Won', items: [january, february] },
        { text: 'Lost', items: [{ text: 'Feb', value: 9 }] },
    ]);

    expect(getNearestSeries(grid, { series: 1, index: 1 })).toBe(1);
});

test('the nearest series with an item at a place is the closest one that has an item there', () => {
    const grid = alignSeries([
        { text: 'Won', items: [january] },
        { text: 'Lost', items: [{ text: 'Feb', value: 9 }] },
        { text: 'Open', items: [{ text: 'Feb', value: 4 }] },
        { text: 'Paused', items: [{ text: 'Feb', value: 2 }] },
    ]);

    expect(getNearestSeries(grid, { series: 0, index: 1 })).toBe(1);
});

test('of two series as near to a series, the earlier one is the nearest', () => {
    const grid = alignSeries([
        { text: 'Won', items: [{ text: 'Feb', value: 9 }] },
        { text: 'Lost', items: [january] },
        { text: 'Open', items: [{ text: 'Feb', value: 4 }] },
    ]);

    expect(getNearestSeries(grid, { series: 1, index: 0 })).toBe(0);
});
