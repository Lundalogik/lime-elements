import 'moment/locale/da';
import 'moment/locale/de';
import 'moment/locale/fi';
import 'moment/locale/fr';
import 'moment/locale/nb';
import 'moment/locale/nl';
import 'moment/locale/sv';
import moment from 'moment/moment';
import { getPrimarySubtag } from '../../util/language';
import { DateType } from './date.types';

// Literals first, so an `l` inside `[...]` is not expanded. Then longest
// first, since alternation takes the first match, not the longest.
const LONG_DATE_FORMAT_TOKENS =
    /\[[^\][]*\]|LTS|LLLL|LLL|LL|LT|L|lts|llll|lll|ll|lt|l/g;

// Literals, tokens (runs of one repeated letter) and separators.
const FORMAT_PARTS = /\[[^\][]*\]|([a-zA-Z])\1*|[^a-zA-Z[]+/g;

// Tokens moment parses leniently as one or two digits.
const ONE_OR_TWO_DIGIT_TOKENS = /^([MDHhkmsWw])\1?$/;

// Includes the narrow no-break space `Intl` puts before AM/PM.
const WHITESPACE = /\s+/g;

// ` - ` or `, ` between a date and a time. Separators inside a date, such
// as `-` in `YYYY-MM-DD`, must still be typed as in the format.
const DATE_TIME_JOINER = / ?, ?| - /g;

const TIME_SEPARATOR = /([Hhk]{1,2}|m{1,2})([:.])(?=m{1,2}|s{1,2})/g;

// Such as `[w]` in `[w] W GGGG`.
const WEEK_PREFIX = /^\[[^\][]*\]\s*(?=[Ww])/;

/**
 * Expands localized tokens, e.g. `L` to `MM/DD/YYYY` for `en`.
 * @param format - the moment format to expand, e.g. `L` or `L - LT`
 * @param locale - the moment locale to expand it for
 */
function expandLongDateFormatTokens(format: string, locale: string): string {
    if (!format) {
        return format;
    }

    const localeData = moment.localeData(locale);

    return format.replaceAll(LONG_DATE_FORMAT_TOKENS, (token: string) => {
        if (token.startsWith('[')) {
            return token;
        }

        return (
            localeData.longDateFormat(token as moment.LongDateFormatKey) ||
            token
        );
    });
}

interface YearInText {
    token: string;
    start: number;
    end: number;
}

/**
 * Accepts fewer digits than the format has, e.g. `1/24/20` for
 * `MM/DD/YYYY`, but rejects text that leaves part of the format unmatched.
 * Moment's lenient mode alone accepts "01" as a complete date.
 *
 * Times and weeks are accepted in more forms than their format, e.g.
 * `15.30` for `HH:mm` and `v. 4 26` for `[w] W GGGG`.
 * @param date - the raw text to parse
 * @param format - the moment format to parse it against
 * @param locale - the moment locale to parse it in
 */
export function parseComplete(
    date: string,
    format: string,
    locale: string
): Date | null {
    const text = normalizeSeparators(date);
    const expandedFormat = normalizeSeparators(
        expandLongDateFormatTokens(format, locale)
    );

    for (const candidate of getTimeSeparatorVariants(expandedFormat)) {
        const parsed = parseLeniently(text, candidate, locale);
        if (parsed) {
            return parsed;
        }
    }

    return null;
}

function parseLeniently(
    date: string,
    format: string,
    locale: string
): Date | null {
    const [weekText, weekFormat] = dropWeekPrefix(date, format);
    const text = pivotWeekYears(weekText, weekFormat);
    const parsed = moment(text, weekFormat, locale, false);

    if (!parsed.isValid()) {
        return null;
    }

    const flags = parsed.parsingFlags();
    if (
        flags.charsLeftOver > 0 ||
        flags.unusedTokens.length > 0 ||
        hasAmbiguousYear(text, weekFormat)
    ) {
        return null;
    }

    return parsed.toDate();
}

// Applied to both the text and the format, so they stay aligned.
function normalizeSeparators(text: string): string {
    return text
        .trim()
        .replaceAll(WHITESPACE, ' ')
        .replaceAll(DATE_TIME_JOINER, ' ');
}

function getTimeSeparatorVariants(format: string): string[] {
    const swapped = format.replaceAll(
        TIME_SEPARATOR,
        (_, part: string, separator: string) =>
            part + (separator === ':' ? '.' : ':')
    );

    return swapped === format ? [format] : [format, swapped];
}

// Accepts any prefix, e.g. `v.`, `w` or none, for `[w] W GGGG`.
function dropWeekPrefix(date: string, format: string): [string, string] {
    if (!WEEK_PREFIX.test(format)) {
        return [date, format];
    }

    return [date.replace(/^\D*/, ''), format.replace(WEEK_PREFIX, '')];
}

// Moment pivots a 2-digit `YYYY`, e.g. `26` to 2026, but not `GGGG`.
function pivotWeekYears(date: string, format: string): string {
    const twoDigitWeekYears = findYears(date, format).filter(
        ({ token, start, end }) => token === 'GGGG' && end - start === 2
    );

    return twoDigitWeekYears.reduceRight(
        (text, { start, end }) =>
            text.slice(0, start) +
            moment.parseTwoDigitYear(text.slice(start, end)) +
            text.slice(end),
        date
    );
}

// Lenient parsing reads a half-typed year such as "1/24/2" as year 2.
function hasAmbiguousYear(date: string, format: string): boolean {
    return findYears(date, format).some(({ start, end }) => {
        const digitCount = end - start;

        return digitCount !== 2 && digitCount !== 4;
    });
}

function findYears(date: string, format: string): YearInText[] {
    const formatParts = format.match(FORMAT_PARTS) || [];
    const inputPattern = formatParts.map(formatPartToPattern).join('');
    const match = new RegExp(`^${inputPattern}$`, 'd').exec(date);

    if (!match) {
        return [];
    }

    return formatParts.filter(isYearToken).map((token, index) => {
        const [start, end] = match.indices[index + 1];

        return { token: token, start: start, end: end };
    });
}

function isYearToken(part: string): boolean {
    return part === 'YYYY' || part === 'GGGG';
}

/**
 * Literals and separators are optional, since lenient parsing skips them
 * when they are not typed, e.g. `01242026` for `MM/DD/YYYY`.
 * @param part - a literal, token or separator of the format
 */
function formatPartToPattern(part: string): string {
    if (part.startsWith('[')) {
        return optional(part.slice(1, -1));
    }

    if (isYearToken(part)) {
        return String.raw`(\d{1,4})`;
    }

    if (ONE_OR_TWO_DIGIT_TOKENS.test(part)) {
        return String.raw`\d{1,2}`;
    }

    if (/^[a-zA-Z]+$/.test(part)) {
        return '.+?';
    }

    // Moment matches each separator character on its own.
    return [...part].map(optional).join('');
}

function optional(text: string): string {
    return `(?:${escapeRegExp(text)})?`;
}

function escapeRegExp(text: string): string {
    return text.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
}

export class DateFormatter {
    private language: string;

    public constructor(language: string = 'en') {
        this.language = language;
    }

    public formatDate(date: Date, dateFormat: string) {
        if (date) {
            return moment(date).locale(this.getLanguage()).format(dateFormat);
        }

        return '';
    }

    public parseDate(date: string, dateFormat: string) {
        if (date) {
            // Importing the moment locales changes moment's global default
            // locale, so tokens like `L` must be parsed with ours.
            return parseComplete(date, dateFormat, this.getLanguage());
        }

        return null;
    }

    public getLanguage() {
        const language = getPrimarySubtag(this.language);
        if (language === 'no') {
            return 'nb';
        }

        return language;
    }

    public getDateFormat(type: DateType) {
        return (
            {
                date: 'L',
                time: 'LT',
                week: '[w] W GGGG',
                month: 'MM/YYYY',
                quarter: '[Q]Q YYYY',
                year: 'YYYY',
                datetime: 'L - LT',
            }[type] || 'L - LT'
        );
    }
}
