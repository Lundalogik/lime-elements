import { formatValue } from './format';

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
