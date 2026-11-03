import { ChartItem } from './chart.types';
import {
    getAxisRange,
    getDateRange,
    getDateTicks,
    isDate,
    getScatterRanges,
    getShare,
    getWholeRange,
    isPartOfWhole,
} from './scale';

const items = (...values: Array<ChartItem['value']>): ChartItem[] =>
    values.map((value, index) => ({ text: `Item ${index}`, value: value }));

test('the axis step divides the axis into about ten steps', () => {
    expect(getAxisRange(items(25, 75))).toEqual({
        minValue: 0,
        maxValue: 80,
        totalRange: 80,
        increment: 8,
    });
});

test('an axisIncrement that divides the axis into 100 steps is used', () => {
    expect(getAxisRange(items(100), undefined, 1).increment).toBe(1);
});

test('an axisIncrement that would divide the axis into more than 100 steps is ignored', () => {
    expect(getAxisRange(items(1_000_000), undefined, 1)).toEqual({
        minValue: 0,
        maxValue: 1_000_000,
        totalRange: 1_000_000,
        increment: 100_000,
    });
});

test('maxValue on an axis is rounded up to the next step', () => {
    expect(getAxisRange(items(25, 75), 230)).toEqual({
        minValue: 0,
        maxValue: 240,
        totalRange: 240,
        increment: 30,
    });
});

test('the axis step divides an axis up to maxValue into about ten steps', () => {
    expect(getAxisRange(items(0, 0), 1_000_000)).toEqual({
        minValue: 0,
        maxValue: 1_000_000,
        totalRange: 1_000_000,
        increment: 100_000,
    });
});

test('an axis without items reaches up to maxValue in about ten steps', () => {
    expect(getAxisRange([], 50)).toEqual({
        minValue: 0,
        maxValue: 50,
        totalRange: 50,
        increment: 5,
    });
});

test.each([
    [undefined, 1],
    [10, 10],
])(
    'an axis without items or maxValue ends at zero, with an axisIncrement of %s',
    (axisIncrement, increment) => {
        expect(getAxisRange([], undefined, axisIncrement)).toEqual({
            minValue: 0,
            maxValue: 0,
            totalRange: 0,
            increment: increment,
        });
    }
);

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
        minValue: -18,
        maxValue: 42,
        totalRange: 60,
        increment: 6,
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

test.each(['proportion-bar', 'pie', 'doughnut', 'ring'] as const)(
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

const day = (month: number, date: number, hours = 0) =>
    new Date(2026, month, date, hours).getTime();

test('an axis of dates runs from the start of the first day to the end of the last', () => {
    expect(getDateRange([day(0, 15, 10), day(2, 3, 14)])).toMatchObject({
        minValue: day(0, 15),
        maxValue: day(2, 4),
    });
});

test('an axis of dates that end at midnight ends there', () => {
    expect(getDateRange([day(0, 15), day(2, 4)]).maxValue).toBe(day(2, 4));
});

test('an axis of a single date spans that day', () => {
    expect(getDateRange([day(0, 15)])).toMatchObject({
        minValue: day(0, 15),
        maxValue: day(0, 16),
    });
});

const inYear = (year: number, month = 0, date = 1) => {
    const start = new Date(0);
    start.setFullYear(year, month, date);

    return start.setHours(0, 0, 0, 0);
};

test('an axis of a single date in the year 50 spans that day', () => {
    expect(getDateRange([inYear(50, 0, 15)])).toMatchObject({
        minValue: inYear(50, 0, 15),
        maxValue: inYear(50, 0, 16),
    });
});

test('an axis of years in the first century marks years in that century', () => {
    const ticks = getDateTicks({ minValue: inYear(20), maxValue: inYear(50) });

    expect(ticks.values).toEqual([20, 30, 40, 50].map((year) => inYear(year)));
});

test('maxValue extends an axis of dates', () => {
    expect(getDateRange([day(0, 15)], day(5, 1)).maxValue).toBe(day(5, 1));
});

const range = (start: number, end: number) => ({
    minValue: start,
    maxValue: end,
});

test.each([
    ['days', day(0, 12), day(0, 16), [12, 13, 14, 15, 16]],
    ['every other day', day(0, 12), day(0, 20), [12, 14, 16, 18, 20]],
    ['Mondays', day(0, 7), day(1, 1), [12, 19, 26]],
])('an axis of dates in January marks %s', (_, start, end, expected) => {
    expect(getDateTicks(range(start, end)).values).toEqual(
        expected.map((date) => day(0, date))
    );
});

test.each([
    ['the first days of months', day(0, 12), day(3, 20), [1, 2, 3]],
    ['the first days of quarters', day(0, 12), day(11, 20), [3, 6, 9]],
])('an axis of dates in 2026 marks %s', (_, start, end, expected) => {
    expect(getDateTicks(range(start, end)).values).toEqual(
        expected.map((month) => day(month, 1))
    );
});

test('an axis of many years marks the first days of every fifth year', () => {
    const ticks = getDateTicks(
        range(new Date(2020, 5, 1).getTime(), new Date(2041, 0, 1).getTime())
    );

    expect(ticks.values.map((tick) => new Date(tick).getFullYear())).toEqual([
        2025, 2030, 2035, 2040,
    ]);
});

test('an axis of centuries marks the first days of whole decades', () => {
    const ticks = getDateTicks(
        range(new Date(1900, 0, 1).getTime(), new Date(2026, 0, 1).getTime())
    );

    expect(ticks.values.map((tick) => new Date(tick).getFullYear())).toEqual([
        1920, 1950, 1980, 2010,
    ]);
});

test.each([
    ['days', day(0, 12), day(0, 16), 'day'],
    ['Mondays', day(0, 7), day(1, 1), 'day'],
    ['months', day(0, 12), day(3, 20), 'month'],
    ['quarters', day(0, 12), day(11, 20), 'month'],
    ['years', day(0, 1), new Date(2031, 0, 1).getTime(), 'year'],
])('an axis of dates that marks %s steps by %s', (_, start, end, unit) => {
    expect(getDateTicks(range(start, end)).unit).toBe(unit);
});

test('an axis of dates before 1970 ends at its last date', () => {
    const dates = [
        new Date(1955, 3, 1).getTime(),
        new Date(1962, 8, 30).getTime(),
    ];

    expect(getDateRange(dates).maxValue).toBe(new Date(1962, 8, 30).getTime());
});

test('maxValue ends an axis of dates before its last date', () => {
    expect(getDateRange([day(0, 15), day(5, 1)], day(2, 31)).maxValue).toBe(
        day(2, 31)
    );
});

test('maxValue during a day ends an axis of dates at the end of that day', () => {
    expect(getDateRange([day(0, 15)], day(2, 3, 12)).maxValue).toBe(day(2, 4));
});

test('maxValue before the first date gives an axis of dates one day', () => {
    expect(getDateRange([day(5, 1)], day(0, 1)).maxValue).toBe(day(5, 2));
});

test('values that are not dates are left out of an axis of dates', () => {
    expect(getDateRange([day(0, 15), 1e20, NaN, day(2, 3)])).toMatchObject({
        minValue: day(0, 15),
        maxValue: day(2, 3),
    });
});

test('a maxValue that is not a date is left out of an axis of dates', () => {
    expect(getDateRange([day(0, 15), day(2, 3)], 1e20).maxValue).toBe(
        day(2, 3)
    );
});

test.each([
    ['a date in milliseconds', day(0, 15), true],
    ['a date in nanoseconds', 1.7e18, false],
    ['NaN', NaN, false],
    ['a date as text', '2026-01-15', false],
])('%s is a date: %s', (_, value, expected) => {
    expect(isDate(value)).toBe(expected);
});
