import 'moment/locale/da';
import 'moment/locale/de';
import 'moment/locale/en-gb';
import 'moment/locale/fi';
import 'moment/locale/fr';
import 'moment/locale/nb';
import 'moment/locale/nl';
import 'moment/locale/sv';
import moment from 'moment/moment';
import { DateType } from './date.types';

// Longest-first, so e.g. `LTS` and `LT` aren't cut short by `L` matching
// first — regex alternation takes the first alternative that matches at a
// position, not the longest one.
const LONG_DATE_FORMAT_TOKENS = /LTS|LLLL|LLL|LL|LT|L|lts|llll|lll|ll|lt|l/g;

/**
 * Turns a moment format into the literal pattern it expands to for a given
 * locale — e.g. `L` becomes `MM/DD/YYYY` for `en`, `DD/MM/YYYY` for many
 * others. `internalFormat` is normally left as this kind of shorthand
 * token (it's what moment itself parses/formats against directly), but
 * anything that needs to reason about the *literal* token structure — a
 * placeholder shown to the user, or `hasAmbiguousYear` checking digit
 * counts per token below — needs it expanded first.
 * @param format - the moment format to expand, e.g. `L` or `L - LT`
 * @param locale - the moment locale to expand it for
 */
function expandLongDateFormatTokens(format: string, locale: string): string {
    if (!format) {
        return format;
    }

    const localeData = moment.localeData(locale);

    return format.replaceAll(
        LONG_DATE_FORMAT_TOKENS,
        (token: moment.LongDateFormatKey) =>
            localeData.longDateFormat(token) || token
    );
}

/**
 * Parses `date` against `format`, accepting shorthand digit counts (e.g.
 * `1/24/20` for `MM/DD/YYYY`) while still rejecting a genuinely incomplete
 * or invalid date.
 *
 * Moment's *strict* mode was tried first, but it demands an exact digit
 * count per token — `YYYY` refuses a 2-digit year, `MM`/`DD` refuse a
 * single digit — rejecting plenty of dates a person would naturally type
 * and consider complete. Moment's *lenient* mode goes too far the other
 * way: it treats almost any partial prefix of a format as already valid,
 * silently defaulting the missing pieces (e.g. "01" against "MM/DD/YYYY"
 * parses as today's date with the month forced to January) — which made
 * every debounced keystroke while typing look like a complete,
 * committable date.
 *
 * The middle ground: parse leniently, then use moment's own parsing flags
 * to demand that every token in `format` actually matched something and
 * that no trailing text was left over — i.e. lenient about *how many
 * digits*, strict about *nothing being missing*.
 * @param date - the raw text to parse
 * @param format - the moment format to parse it against
 * @param locale - the moment locale to parse it in
 */
export function parseComplete(
    date: string,
    format: string,
    locale: string
): Date | null {
    const parsed = moment(date, format, locale, false);

    if (!parsed.isValid()) {
        return null;
    }

    const flags = parsed.parsingFlags();
    if (flags.charsLeftOver > 0 || flags.unusedTokens.length > 0) {
        return null;
    }

    if (hasAmbiguousYear(date, format, locale)) {
        return null;
    }

    return parsed.toDate();
}

/**
 * `YYYY`/`GGGG` are the only tokens where lenient parsing's tolerance for
 * "however many digits were typed" creates real ambiguity: moment accepts
 * any* digit count there, applying its 2-digit-year pivot (e.g. "20" →
 * 2020) — which also means a single leftover digit mid-keystroke (e.g.
 * "1/24/2") silently parses as a "complete" date in year 2 AD, exactly the
 * kind of not-yet-finished input `parseComplete` exists to reject. `MM`/
 * `DD` don't have this problem: 1 or 2 digits are both unambiguous there
 * (no pivoting), so they're intentionally left alone.
 *
 * A 2-digit year is kept as valid shorthand (moment's pivot handles it);
 * `GGGG` gets no such allowance, since moment's pivot doesn't apply to it
 * at all — a 2-digit input there parses as literally the year 20, not
 * 2020.
 *
 * `format` has to be expanded first: `internalFormat` is normally a
 * shorthand token like `L`, which this function's own tokenizer would
 * otherwise see as one opaque letter-run rather than the `DD`/`MM`/`YYYY`
 * it actually stands for — silently never matching, and never rejecting
 * anything.
 * @param date - the raw text that was parsed
 * @param format - the moment format it was parsed against
 * @param locale - the moment locale `format` expands against
 */
function hasAmbiguousYear(
    date: string,
    format: string,
    locale: string
): boolean {
    const expandedFormat = expandLongDateFormatTokens(format, locale);
    const formatParts = expandedFormat.match(/[a-zA-Z]+|[^a-zA-Z]+/g) || [];
    const inputPattern = formatParts
        .map((part) =>
            /^[a-zA-Z]+$/.test(part)
                ? String.raw`(\d{1,4})`
                : part.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`)
        )
        .join('');
    const match = date.match(new RegExp(`^${inputPattern}$`));

    if (!match) {
        // Doesn't even line up with the format's token/separator
        // structure — `parseComplete`'s other checks handle rejecting it.
        return false;
    }

    const tokens = formatParts.filter((part) => /^[a-zA-Z]+$/.test(part));

    return tokens.some((token, index) => {
        const digitCount = match[index + 1].length;

        if (token === 'YYYY') {
            return digitCount !== 2 && digitCount !== 4;
        }

        if (token === 'GGGG') {
            return digitCount !== 4;
        }

        return false;
    });
}

/**
 * Derives a month-and-year-only format from a full day-inclusive one (e.g.
 * `DD.MM.YYYY` → `MM.YYYY`, `YYYY-MM-DD` → `YYYY-MM`) by dropping the day
 * token and one of its adjacent separators.
 *
 * There's no moment long-date-format token for "month and year, in this
 * locale's own order and separator" the way `L` covers a full date — so
 * without this, a month-type field has no locale-aware format to fall
 * back on. Deriving it from the locale's own `L` keeps the month/year
 * order and separator consistent with how this locale writes a full date,
 * rather than hardcoding one locale's convention (e.g. `MM/YYYY`) for
 * everyone.
 * @param format - a day-inclusive format, e.g. this locale's own `L`
 */
function stripDay(format: string): string {
    const parts = format.match(/[a-zA-Z]+|[^a-zA-Z]+/g) || [];
    const dayIndex = parts.findIndex((part) => /^D+$/.test(part));

    if (dayIndex === -1) {
        return format;
    }

    const withoutDay = [...parts];
    withoutDay.splice(dayIndex, 1);

    const isSeparator = (part: string | undefined) =>
        part !== undefined && /^[^a-zA-Z]+$/.test(part);

    if (isSeparator(withoutDay[dayIndex])) {
        withoutDay.splice(dayIndex, 1);
    } else if (isSeparator(withoutDay[dayIndex - 1])) {
        withoutDay.splice(dayIndex - 1, 1);
    }

    return withoutDay.join('');
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
            // The locale must be passed to the parse call itself, not
            // chained on afterwards: `dateFormat` can be a localized token
            // like `L`, and which literal pattern that expands to (e.g.
            // `MM/DD/YYYY` for `en` vs `DD/MM/YYYY` for many others) is
            // decided at parse time. Importing every `moment/locale/*` file
            // (for the calendar UI) has the side effect of switching
            // moment's global default locale to whichever was imported
            // last, so parsing without pinning a locale here silently used
            // the wrong one instead of `this.language`.
            return parseComplete(date, dateFormat, this.getLanguage());
        }

        return null;
    }

    public getLanguage() {
        if (this.language === 'no') {
            return 'nb';
        }

        return this.language;
    }

    /**
     * Turns a moment format into the literal pattern it expands to for
     * this instance's language — e.g. `L` becomes `MM/DD/YYYY` for `en`,
     * `DD/MM/YYYY` for many others. Shown to the user (in a placeholder or
     * an error message), the shorthand token itself means nothing; only
     * the expanded pattern tells them what to type.
     * @param format - the moment format to expand, e.g. `L` or `L - LT`
     */
    public expandFormat(format: string): string {
        return expandLongDateFormatTokens(format, this.getLanguage());
    }

    public getDateFormat(type: DateType) {
        if (type === 'month') {
            return stripDay(
                moment.localeData(this.getLanguage()).longDateFormat('L')
            );
        }

        return (
            {
                date: 'L',
                time: 'LT',
                week: '[w] W GGGG',
                quarter: '[Q]Q YYYY',
                year: 'YYYY',
                datetime: 'L - LT',
            }[type] || 'L - LT'
        );
    }
}
