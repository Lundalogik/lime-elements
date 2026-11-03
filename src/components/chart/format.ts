import { getPrimarySubtag } from '../../util/language';
import { ChartItem, ChartValueFormat } from './chart.types';
import { AxisRange, DrawnChartType } from './scale';

const FALLBACK_LOCALE = 'en';
const PERCENT = 100;

/**
 * The largest value on an axis from which its values are shortened,
 * such as `1.2M` for 1 200 000.
 */
const SHORTEN_FROM = 10_000;

/**
 * The most decimals `Intl` writes in every browser.
 */
const MAX_DECIMALS = 20;

/**
 * The most significant digits `Intl` writes.
 */
const MAX_SIGNIFICANT_DIGITS = 21;

/**
 * `Intl` options that the `lib` of this project does not know yet.
 */
type NumberOptions = Intl.NumberFormatOptions & {
    trailingZeroDisplay?: 'auto' | 'stripIfInteger';
};

/**
 * How to write numbers: `options` for those from `smallBelow` up, and
 * `small` for those closer to zero, so they keep their first digits.
 */
interface NumberStyle {
    options: NumberOptions;
    small: NumberOptions;
    smallBelow: number;
}

/**
 * Up to three decimals, and six significant digits below one, so `0.0004`
 * is not written as `0`.
 */
const NUMBERS: NumberStyle = {
    options: { maximumFractionDigits: 3 },
    small: { maximumSignificantDigits: 6 },
    smallBelow: 1,
};

/**
 * Up to one decimal, and two significant digits below 1 %, so `0.0004` is
 * written as `0.04%` rather than `0%`.
 */
const PERCENTAGES: NumberStyle = {
    options: { style: 'percent', maximumFractionDigits: 1 },
    small: { style: 'percent', maximumSignificantDigits: 2 },
    smallBelow: 0.01,
};

const SHARE_OPTIONS: NumberOptions = {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
};

const locales = new Map<string, string>();
const numberFormats = new Map<string, Intl.NumberFormat>();
const currencyCodes = new Map<string, boolean>();

/**
 * What decides how the values of a chart are written.
 */
export interface ValueStyle {
    type: DrawnChartType;
    /** The language of the chart, which values are written in. */
    language: string;
    valueFormat: ChartValueFormat;
    /** The currency of the values, for the `currency` format. */
    currency?: string;
}

/**
 * The item's value as text: its `formattedValue` when set, otherwise its
 * value, range, or scatter point, written in the chart's language and
 * value format.
 * @param item - the item
 * @param style - how the chart writes values
 */
export function formatValue(item: ChartItem, style: ValueStyle): string {
    const { value, formattedValue } = item;

    if (formattedValue) {
        return formattedValue;
    }

    const numbers = getValueFormat(style);
    if (!Array.isArray(value)) {
        return numbers.format(value);
    }

    const [first, second] = value.map((part) => numbers.format(part));
    if (style.type === 'scatter') {
        return writePoint(first, second);
    }

    return `${first} — ${second}`;
}

/**
 * Writes the values of an axis in the chart's language and value format,
 * with as many decimals as the step between them has. Amounts leave out
 * their currency, which the item values and tooltips show. On an axis
 * that reaches 10 000 or more, every number is shortened, such as `1.2M`,
 * so the values stay short and alike.
 * @param range - the range of the axis
 * @param style - how the chart writes values
 */
export function getAxisValueFormatter(
    range: Pick<AxisRange, 'minValue' | 'maxValue' | 'increment'>,
    style: ValueStyle
): (value: number) => string {
    const locale = getLocale(style.language);
    if (style.valueFormat === 'percent') {
        const percentages = getNumberFormat(locale, {
            style: 'percent',
            maximumFractionDigits: countDecimals(range.increment * PERCENT),
        });

        return (value) => percentages.format(value);
    }

    const largest = Math.max(
        Math.abs(range.minValue),
        Math.abs(range.maxValue)
    );
    const numbers = getNumberFormat(
        locale,
        largest >= SHORTEN_FROM
            ? {
                  notation: 'compact',
                  maximumSignificantDigits: countSignificantDigits(
                      largest,
                      range.increment
                  ),
              }
            : { maximumFractionDigits: countDecimals(range.increment) }
    );

    return (value) => numbers.format(value);
}

/**
 * An item's share of the whole as a percentage with two decimals, such as
 * `25.00%`, written in the chart's language.
 * @param share - the share, in percent
 * @param language - the language of the chart
 */
export function formatShare(share: number, language: string): string {
    return getNumberFormat(getLocale(language), SHARE_OPTIONS).format(
        share / PERCENT
    );
}

/**
 * Whether `currency` can be written as one: a three-letter code such as
 * `SEK`.
 * @param currency - the currency of the chart
 */
export function isCurrencyCode(currency: string): boolean {
    let valid = currencyCodes.get(currency);
    if (valid === undefined) {
        valid = canWriteAmountsIn(currency);
        currencyCodes.set(currency, valid);
    }

    return valid;
}

function canWriteAmountsIn(currency: string): boolean {
    try {
        getNumberFormat(FALLBACK_LOCALE, { style: 'currency', currency });

        return true;
    } catch {
        return false;
    }
}

/**
 * Whether values can be written in `language`. When they cannot, they are
 * written in English.
 * @param language - the language of the chart
 */
export function canWriteIn(language: string): boolean {
    return (
        getLocale(language) !== FALLBACK_LOCALE ||
        getPrimarySubtag(language) === FALLBACK_LOCALE
    );
}

function getValueFormat(style: ValueStyle): Pick<Intl.NumberFormat, 'format'> {
    const locale = getLocale(style.language);
    if (style.valueFormat === 'percent') {
        return getNumberWriter(locale, PERCENTAGES);
    }

    if (style.valueFormat === 'currency' && isCurrencyCode(style.currency)) {
        return getNumberFormat(locale, {
            style: 'currency',
            currency: style.currency,
            trailingZeroDisplay: 'stripIfInteger',
        });
    }

    return getNumberWriter(locale, NUMBERS);
}

/**
 * The two values of a scatter point, separated by a semicolon when either
 * of them has a comma in it, such as `(1,5; 2,5)` in Swedish.
 * @param first - the first value, as text
 * @param second - the second value, as text
 */
function writePoint(first: string, second: string): string {
    const separator = `${first}${second}`.includes(',') ? '; ' : ', ';

    return `(${first}${separator}${second})`;
}

function countDecimals(value: number): number {
    if (!Number.isFinite(value)) {
        return 0;
    }

    return Math.min(MAX_DECIMALS, Math.max(0, -getLowestDigit(value)));
}

/**
 * How many significant digits the values of an axis need for every step
 * between them to show, such as four for `1.025M` on an axis that steps
 * by 25 000 up to 2 000 000.
 * @param largest - the largest value on the axis, ignoring its sign
 * @param increment - the step between the values
 */
function countSignificantDigits(largest: number, increment: number): number {
    if (!Number.isFinite(increment)) {
        return MAX_SIGNIFICANT_DIGITS;
    }

    const digits = Math.floor(Math.log10(largest)) - getLowestDigit(increment);

    return Math.min(MAX_SIGNIFICANT_DIGITS, Math.max(1, digits + 1));
}

/**
 * The power of ten of the last digit of `value` that is not zero, such as
 * 3 for 25 000 and -2 for 0.25.
 * @param value - a finite number
 */
function getLowestDigit(value: number): number {
    const [digits, exponent] = Number(value.toPrecision(12))
        .toExponential()
        .split('e', 2);
    const decimals = digits.split('.', 2)[1]?.length ?? 0;

    return Number(exponent) - decimals;
}

function getNumberWriter(
    locale: string,
    style: NumberStyle
): Pick<Intl.NumberFormat, 'format'> {
    const numbers = getNumberFormat(locale, style.options);
    const small = getNumberFormat(locale, style.small);

    return {
        format: (value) =>
            value !== 0 && Math.abs(value) < style.smallBelow
                ? small.format(value)
                : numbers.format(value),
    };
}

/**
 * Making an `Intl.NumberFormat` costs far more than using one, and values
 * are written on every render, so each one is made once.
 * @param locale - the locale to write in
 * @param options - how to write the numbers
 */
function getNumberFormat(
    locale: string,
    options: NumberOptions
): Intl.NumberFormat {
    const key = `${locale} ${JSON.stringify(options)}`;
    let format = numberFormats.get(key);
    if (!format) {
        format = new Intl.NumberFormat(locale, options);
        numberFormats.set(key, format);
    }

    return format;
}

/**
 * `Intl` throws on a language it cannot read, and quietly uses the
 * viewer's own locale for one it does not know, such as `zz`. Values are
 * written while the chart renders, so both fall back to English.
 * @param language - the language of the chart
 */
function getLocale(language: string): string {
    let locale = locales.get(language);
    if (locale === undefined) {
        locale = findLocale(language);
        locales.set(language, locale);
    }

    return locale;
}

function findLocale(language: string): string {
    try {
        const [locale] = Intl.getCanonicalLocales(language);
        const [known] = Intl.NumberFormat.supportedLocalesOf(locale ?? []);

        return known ?? FALLBACK_LOCALE;
    } catch {
        return FALLBACK_LOCALE;
    }
}
