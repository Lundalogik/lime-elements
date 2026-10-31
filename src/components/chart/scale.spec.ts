import { ChartItem } from './chart.types';
import {
    formatValue,
    getAxisRange,
    getScatterRanges,
    getShare,
    getWholeRange,
    isPartOfWhole,
} from './scale';

const items = (...values: Array<ChartItem['value']>): ChartItem[] =>
    values.map((value, index) => ({ text: `Item ${index}`, value: value }));

test('the axis step divides the largest value into about ten steps', () => {
    expect(getAxisRange(items(25, 75))).toEqual({
        minValue: 0,
        maxValue: 80,
        totalRange: 80,
        increment: 8,
    });
});

test('maxValue on an axis is rounded up to the next step', () => {
    expect(getAxisRange(items(25, 75), 210)).toEqual({
        minValue: 0,
        maxValue: 216,
        totalRange: 216,
        increment: 8,
    });
});

test('axisIncrement is used as the axis step', () => {
    expect(getAxisRange(items(25, 75), undefined, 20)).toEqual({
        minValue: 0,
        maxValue: 80,
        totalRange: 80,
        increment: 20,
    });
});

test.each([0, -20, NaN])('an axisIncrement of %d is ignored', (step) => {
    expect(getAxisRange(items(25, 75), undefined, step).increment).toBe(8);
});

test('negative values extend the axis below zero to a whole step', () => {
    expect(getAxisRange(items(-15, 38))).toEqual({
        minValue: -16,
        maxValue: 40,
        totalRange: 56,
        increment: 4,
    });
});

test('range values extend the axis down to their lower end', () => {
    expect(getAxisRange(items([-7, 10], [4, 32]))).toEqual({
        minValue: -8,
        maxValue: 32,
        totalRange: 40,
        increment: 4,
    });
});

test('an axis of zeros gets a step of one', () => {
    expect(getAxisRange(items(0, 0))).toEqual({
        minValue: 0,
        maxValue: 0,
        totalRange: 0,
        increment: 1,
    });
});

test.each(['stacked-bar', 'pie', 'doughnut', 'ring'] as const)(
    'the items of a %s chart are parts of a whole',
    (type) => {
        expect(isPartOfWhole(type)).toBe(true);
    }
);

test.each(['bar', 'dot', 'area', 'line', 'scatter', 'nps'] as const)(
    'the items of a %s chart are not parts of a whole',
    (type) => {
        expect(isPartOfWhole(type)).toBe(false);
    }
);

test('the whole is the sum of the items', () => {
    expect(getWholeRange(items(25, 75))).toEqual({
        minValue: 0,
        maxValue: 100,
        totalRange: 100,
        increment: 100,
    });
});

test('maxValue is the whole, and is not rounded', () => {
    expect(getWholeRange(items(25, 75), 210).totalRange).toBe(210);
});

test('range items add their extents to the whole', () => {
    expect(getWholeRange(items([10, 40], [40, 100])).totalRange).toBe(90);
});

test('a whole of zero items falls back to one', () => {
    expect(getWholeRange(items(0, 0)).totalRange).toBe(1);
});

test('a maxValue of zero falls back to a whole of one', () => {
    expect(getWholeRange(items(25, 75), 0).totalRange).toBe(1);
});

test('an item has its value as its share of the whole', () => {
    const whole = getWholeRange(items(25, 75));

    expect(getShare({ text: 'Photos', value: 75 }, whole)).toBe(75);
});

test('a range item has its extent as its share of the whole', () => {
    const whole = getWholeRange(items([10, 40], [40, 100]));

    expect(getShare({ text: 'Planning', value: [10, 40] }, whole)).toBeCloseTo(
        33.333
    );
});

test('the shares can add up to more than the whole', () => {
    const whole = getWholeRange(items(25, 75), 80);

    expect(getShare({ text: 'Photos', value: 75 }, whole)).toBe(93.75);
});

test('a negative item has a negative share', () => {
    const whole = getWholeRange(items(-5), 20);

    expect(getShare({ text: 'Refunds', value: -5 }, whole)).toBe(-25);
});

test('each scatter axis gets its own range and step', () => {
    expect(getScatterRanges(items([1, 2], [12, 48]))).toEqual({
        x: { minValue: 0, maxValue: 12, totalRange: 12, increment: 2 },
        y: { minValue: 0, maxValue: 50, totalRange: 50, increment: 5 },
    });
});

test('scatter axes reach past zero on both sides for negative values', () => {
    expect(getScatterRanges(items([-30, 12], [45, -8]))).toEqual({
        x: { minValue: -32, maxValue: 48, totalRange: 80, increment: 8 },
        y: { minValue: -8, maxValue: 12, totalRange: 20, increment: 2 },
    });
});

test('scatter axes of zeros get a step of one', () => {
    expect(getScatterRanges(items([0, 0]))).toEqual({
        x: { minValue: 0, maxValue: 0, totalRange: 0, increment: 1 },
        y: { minValue: 0, maxValue: 0, totalRange: 0, increment: 1 },
    });
});

test('formattedValue is shown instead of the value', () => {
    const item = { text: 'Photos', value: 18, formattedValue: '18 GB' };

    expect(formatValue(item, 'bar')).toBe('18 GB');
});

test('a value is shown as a number', () => {
    expect(formatValue({ text: 'Photos', value: 18 }, 'bar')).toBe('18');
});

test('a value of zero is shown', () => {
    expect(formatValue({ text: 'Photos', value: 0 }, 'bar')).toBe('0');
});

test('a range is shown with its two ends', () => {
    expect(formatValue({ text: 'Week 2', value: [4, 32] }, 'bar')).toBe(
        '4 — 32'
    );
});

test('a scatter point is shown as coordinates', () => {
    expect(formatValue({ text: 'Deal', value: [4, 32] }, 'scatter')).toBe(
        '(4, 32)'
    );
});
