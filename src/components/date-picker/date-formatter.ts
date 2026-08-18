import 'moment/locale/da';
import 'moment/locale/de';
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
            //
            // Strict mode matters too: moment's default lenient parsing
            // treats almost any partial prefix of a format as already
            // "valid", silently defaulting the missing pieces (e.g. "01"
            // against "MM/DD/YYYY" parses as today's date with the month
            // forced to January) — which made every debounced keystroke
            // while typing look like a complete, committable date.
            return moment(date, dateFormat, this.getLanguage(), true).toDate();
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
        if (!format) {
            return format;
        }

        const localeData = moment.localeData(this.getLanguage());

        return format.replaceAll(
            LONG_DATE_FORMAT_TOKENS,
            (token: moment.LongDateFormatKey) =>
                localeData.longDateFormat(token) || token
        );
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
