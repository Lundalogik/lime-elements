import {
    canWriteIn,
    formatValue,
    getAxisValueFormatter,
    isCurrencyCode,
} from './format';
import { DateTicks } from './scale';

const english = { type: 'bar', language: 'en', valueFormat: 'number' } as const;
const swedish = { ...english, language: 'sv' } as const;

test('formattedValue is shown instead of the value', () => {
    const item = { text: 'Photos', value: 18, formattedValue: '18 GB' };

    expect(formatValue(item, english)).toBe('18 GB');
});

test('a small value is shown as it is', () => {
    expect(formatValue({ text: 'Photos', value: 18 }, english)).toBe('18');
});

test('a value of zero is shown', () => {
    expect(formatValue({ text: 'Photos', value: 0 }, english)).toBe('0');
});

test('a range is shown with its two ends', () => {
    expect(formatValue({ text: 'Week 2', value: [4, 32] }, english)).toBe(
        '4 — 32'
    );
});

test('a scatter point is shown as coordinates', () => {
    expect(
        formatValue(
            { text: 'Deal', value: [4, 32] },
            { ...english, type: 'scatter' }
        )
    ).toBe('(4, 32)');
});

test('a value is written the way its language writes numbers', () => {
    const item = { text: 'Photos', value: 1234.5 };

    expect(formatValue(item, swedish)).toBe('1\u{A0}234,5');
});

test('a range is written the way its language writes numbers', () => {
    const item = { text: 'Week 2', value: [1500, 32_000] as [number, number] };

    expect(formatValue(item, english)).toBe('1,500 — 32,000');
});

test('a language that cannot be read writes values as in English', () => {
    const item = { text: 'Photos', value: 1234.5 };

    expect(formatValue(item, { ...english, language: 'not a language!' })).toBe(
        '1,234.5'
    );
});

test('the values of an axis below 10 000 are written in full', () => {
    const write = getAxisValueFormatter(
        { minValue: 0, maxValue: 5000, increment: 500 },
        english
    );

    expect(write(2500)).toBe('2,500');
});

test('every value of an axis that reaches 10 000 is shortened', () => {
    const write = getAxisValueFormatter(
        { minValue: 0, maxValue: 1_200_000, increment: 250_000 },
        english
    );

    expect([write(250_000), write(1_200_000)]).toEqual(['250K', '1.2M']);
});

test.each([
    [2_000_000, 25_000, 1_025_000, '1.025M'],
    [10_000, 125, 1125, '1.125K'],
])(
    'a shortened axis up to %d that steps by %d keeps the digits of the step',
    (maxValue, increment, value, expected) => {
        const write = getAxisValueFormatter(
            { minValue: 0, maxValue, increment },
            english
        );

        expect(write(value)).toBe(expected);
    }
);

test('an axis that reaches -10 000 is shortened too', () => {
    const write = getAxisValueFormatter(
        { minValue: -20_000, maxValue: 0, increment: 5000 },
        english
    );

    expect(write(-20_000)).toBe('-20K');
});

test('shortened axis values are written the way their language writes them', () => {
    const write = getAxisValueFormatter(
        { minValue: 0, maxValue: 1_200_000, increment: 250_000 },
        swedish
    );

    expect(write(1_200_000)).toBe('1,2\u{A0}mn');
});

test('a percentage is written as one, where 0.25 is 25 %', () => {
    const item = { text: 'Won', value: 0.255 };

    expect(formatValue(item, { ...swedish, valueFormat: 'percent' })).toBe(
        '25,5\u{A0}%'
    );
});

test('an amount is written in its currency', () => {
    const item = { text: 'Revenue', value: 1200 };

    expect(
        formatValue(item, {
            ...swedish,
            valueFormat: 'currency',
            currency: 'SEK',
        })
    ).toBe('1\u{A0}200\u{A0}kr');
});

test('an amount with a fraction keeps its decimals', () => {
    const item = { text: 'Fee', value: 12.5 };

    expect(
        formatValue(item, {
            ...swedish,
            valueFormat: 'currency',
            currency: 'SEK',
        })
    ).toBe('12,50\u{A0}kr');
});

test('a range of amounts writes both ends in their currency', () => {
    const item = { text: 'Deal', value: [1200, 3400] as [number, number] };

    expect(
        formatValue(item, {
            ...english,
            valueFormat: 'currency',
            currency: 'USD',
        })
    ).toBe('$1,200 — $3,400');
});

test.each([undefined, 'kronor'])(
    'an amount with the currency %s is written as a number',
    (currency) => {
        const item = { text: 'Revenue', value: 1200 };

        expect(
            formatValue(item, { ...english, valueFormat: 'currency', currency })
        ).toBe('1,200');
    }
);

test('a formattedValue is shown instead of the value format', () => {
    const item = { text: 'Won', value: 0.25, formattedValue: 'A quarter' };

    expect(formatValue(item, { ...english, valueFormat: 'percent' })).toBe(
        'A quarter'
    );
});

test('the values of a percentage axis are written as percentages', () => {
    const write = getAxisValueFormatter(
        { minValue: 0, maxValue: 1, increment: 0.1 },
        { ...english, valueFormat: 'percent' }
    );

    expect(write(0.25)).toBe('25%');
});

test('the values of an amount axis leave out the currency', () => {
    const write = getAxisValueFormatter(
        { minValue: 0, maxValue: 1_200_000, increment: 250_000 },
        { ...english, valueFormat: 'currency', currency: 'USD' }
    );

    expect(write(1_200_000)).toBe('1.2M');
});

test.each([
    ['SEK', true],
    ['kronor', false],
    [undefined, false],
])('%s is a currency code: %s', (currency, expected) => {
    expect(isCurrencyCode(currency)).toBe(expected);
});

test('a small value keeps its first digits', () => {
    expect(formatValue({ text: 'Churn', value: 0.0004 }, english)).toBe(
        '0.0004'
    );
});

test('a value keeps up to three decimals', () => {
    expect(formatValue({ text: 'Revenue', value: 1234.56789 }, english)).toBe(
        '1,234.568'
    );
});

test('a language this browser does not know writes values as in English', () => {
    const item = { text: 'Photos', value: 1234.5 };

    expect(formatValue(item, { ...english, language: 'zz' })).toBe('1,234.5');
});

test('a scatter point of numbers with commas separates them with a semicolon', () => {
    const item = { text: 'Deal', value: [1.5, 2.5] as [number, number] };

    expect(formatValue(item, { ...swedish, type: 'scatter' })).toBe(
        '(1,5; 2,5)'
    );
});

test('the values of an axis have as many decimals as its step', () => {
    const write = getAxisValueFormatter(
        { minValue: 0, maxValue: 0.004, increment: 0.0004 },
        english
    );

    expect([write(0.0004), write(0.0012)]).toEqual(['0.0004', '0.0012']);
});

test('the values of an axis with a step of 0.25 have two decimals', () => {
    const write = getAxisValueFormatter(
        { minValue: 0, maxValue: 1, increment: 0.25 },
        english
    );

    expect(write(0.75)).toBe('0.75');
});

test('the values of an axis with a step that adds up to a long fraction keep its decimals', () => {
    const write = getAxisValueFormatter(
        { minValue: 0, maxValue: 3, increment: 0.1 + 0.2 },
        english
    );

    expect(write(0.6)).toBe('0.6');
});

test.each([
    ['sv', true],
    ['en', true],
    ['nb-NO', true],
    ['sv_SE', false],
    ['zz', false],
])('values can be written in %s: %s', (language, expected) => {
    expect(canWriteIn(language)).toBe(expected);
});

test('a large value keeps all its digits', () => {
    expect(formatValue({ text: 'Revenue', value: 1_234_567 }, english)).toBe(
        '1,234,567'
    );
});

test('a small percentage keeps its first digits', () => {
    const item = { text: 'Churn', value: 0.0004 };

    expect(formatValue(item, { ...english, valueFormat: 'percent' })).toBe(
        '0.04%'
    );
});

test('the values of a percentage axis have as many decimals as its step', () => {
    const write = getAxisValueFormatter(
        { minValue: 0, maxValue: 0.02, increment: 0.005 },
        { ...english, valueFormat: 'percent' }
    );

    expect(write(0.015)).toBe('1.5%');
});

const dates = { ...swedish, valueFormat: 'date' } as const;
const day = (month: number, date: number) =>
    new Date(2026, month, date).getTime();

test('a date is written as one, in the language of the chart', () => {
    const item = { text: 'Signed', value: day(0, 15) };

    expect(formatValue(item, dates)).toBe('15 jan. 2026');
});

test('a range of dates is written as one range', () => {
    const item = {
        text: 'Phase 1',
        value: [day(0, 1), day(1, 1)] as [number, number],
    };

    expect(formatValue(item, dates)).toBe('1 jan.\u{2013}1 feb. 2026');
});

test('a range of dates that ends before it starts is written in order', () => {
    const item = {
        text: 'Phase 1',
        value: [day(1, 1), day(0, 1)] as [number, number],
    };

    expect(formatValue(item, dates)).toBe('1 jan.\u{2013}1 feb. 2026');
});

test('a scatter point of dates writes both dates', () => {
    const item = {
        text: 'Deal',
        value: [day(0, 1), day(1, 1)] as [number, number],
    };

    expect(formatValue(item, { ...dates, type: 'scatter' })).toBe(
        '(1 jan. 2026, 1 feb. 2026)'
    );
});

test('a scatter point of dates with commas separates them with a semicolon', () => {
    const item = {
        text: 'Deal',
        value: [day(0, 1), day(1, 1)] as [number, number],
    };

    expect(
        formatValue(item, { ...dates, language: 'en', type: 'scatter' })
    ).toBe('(Jan 1, 2026; Feb 1, 2026)');
});

test.each([NaN, 1e20])('a date of %s is shown as it is', (value) => {
    expect(formatValue({ text: 'Signed', value: value }, dates)).toBe(
        `${value}`
    );
});

test('a range with a date of NaN shows both ends as they are', () => {
    const item = {
        text: 'Phase 1',
        value: [NaN, day(1, 1)] as [number, number],
    };

    expect(formatValue(item, dates)).toBe('NaN — 1 feb. 2026');
});

const writeDateAxis = (ticks: DateTicks) => {
    const write = getAxisValueFormatter(
        { minValue: 0, maxValue: 0, increment: 0 },
        dates,
        ticks
    );

    return ticks.values.map((value) => write(value));
};

test('a date axis of days writes the year on its first date and on each new year', () => {
    const values = [
        new Date(2025, 11, 22).getTime(),
        new Date(2025, 11, 29).getTime(),
        day(0, 5),
    ];

    expect(writeDateAxis({ values, unit: 'day' })).toEqual([
        '22 dec. 2025',
        '29 dec.',
        '5 jan. 2026',
    ]);
});

test('a date axis of months writes the year on its first month', () => {
    const values = [day(2, 1), day(3, 1), day(4, 1)];

    expect(writeDateAxis({ values, unit: 'month' })).toEqual([
        'mars 2026',
        'apr.',
        'maj',
    ]);
});

test('a date axis of months writes January as its year', () => {
    const values = [new Date(2025, 11, 1).getTime(), day(0, 1), day(1, 1)];

    expect(writeDateAxis({ values, unit: 'month' })).toEqual([
        'dec. 2025',
        '2026',
        'feb.',
    ]);
});

test('a date axis of years writes the years', () => {
    const values = [day(0, 1), new Date(2027, 0, 1).getTime()];

    expect(writeDateAxis({ values, unit: 'year' })).toEqual(['2026', '2027']);
});

test('a date given as text is shown as it is', () => {
    const item = { text: 'Signed', value: '2026-01-15' as unknown as number };

    expect(formatValue(item, dates)).toBe('2026-01-15');
});
