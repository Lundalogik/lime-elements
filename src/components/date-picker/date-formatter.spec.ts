import { DateFormatter } from './date-formatter';

const asLocalDateString = (date: Date): string =>
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

describe('parseDate', () => {
    it('parses a fully zero-padded date', () => {
        const formatter = new DateFormatter('en');

        const date = formatter.parseDate('01/24/2020', 'MM/DD/YYYY');

        expect(asLocalDateString(date)).toBe('2020-1-24');
    });

    it('accepts a single-digit month and day', () => {
        const formatter = new DateFormatter('en');

        const date = formatter.parseDate('1/24/2020', 'MM/DD/YYYY');

        expect(asLocalDateString(date)).toBe('2020-1-24');
    });

    it('accepts a 2-digit year', () => {
        const formatter = new DateFormatter('en');

        const date = formatter.parseDate('1/24/20', 'MM/DD/YYYY');

        expect(asLocalDateString(date)).toBe('2020-1-24');
    });

    it('accepts a 2-digit year typed in a locale using dots', () => {
        // Regression test: German expects "DD.MM.YYYY", and a 2-digit
        // year like this used to be rejected by strict-mode parsing even
        // though it unambiguously names a complete date.
        const formatter = new DateFormatter('de');

        const date = formatter.parseDate('31.01.20', 'L');

        expect(asLocalDateString(date)).toBe('2020-1-31');
    });

    it('parses British English as day-first, unlike plain English', () => {
        const formatter = new DateFormatter('en-gb');

        const date = formatter.parseDate('24/01/2020', 'L');

        expect(asLocalDateString(date)).toBe('2020-1-24');
    });

    it('rejects text with a piece of the format still missing', () => {
        const formatter = new DateFormatter('en');

        expect(formatter.parseDate('01', 'MM/DD/YYYY')).toBeNull();
    });

    it('rejects a date with an out-of-range day for its month', () => {
        const formatter = new DateFormatter('en');

        expect(formatter.parseDate('02/30/2020', 'MM/DD/YYYY')).toBeNull();
    });

    it('rejects text that does not match the format at all', () => {
        const formatter = new DateFormatter('en');

        expect(formatter.parseDate('not a date', 'MM/DD/YYYY')).toBeNull();
    });

    it('returns null for an empty string', () => {
        const formatter = new DateFormatter('en');

        expect(formatter.parseDate('', 'MM/DD/YYYY')).toBeNull();
    });

    it('rejects a single leftover digit typed into the year', () => {
        // Regression test: moment's lenient parsing (needed to accept a
        // 2-digit year as shorthand) also happily accepts *any* digit
        // count for "YYYY", applying its 2-digit-year pivot even to a
        // single stray digit — so "1/24/2" mid-keystroke was silently
        // parsed as a "complete" date in the year 2 AD.
        const formatter = new DateFormatter('en');

        expect(formatter.parseDate('1/24/2', 'MM/DD/YYYY')).toBeNull();
    });

    it('rejects a single leftover digit typed into the year, against the raw "L" token', () => {
        // Regression test: `internalFormat` is normally the unexpanded
        // shorthand token itself (e.g. "L"), not the literal pattern it
        // expands to — and the ambiguous-year check above used to
        // tokenize that raw "L" as one opaque letter-run instead of
        // "DD"/"MM"/"YYYY", silently never matching and never rejecting
        // anything. Reproduces deleting a digit from a real "17.01.20"
        // down to "17.01.2".
        const formatter = new DateFormatter('de');

        expect(formatter.parseDate('17.01.2', 'L')).toBeNull();
    });

    it('rejects a 3-digit year', () => {
        const formatter = new DateFormatter('en');

        expect(formatter.parseDate('1/24/202', 'MM/DD/YYYY')).toBeNull();
    });

    it('accepts a 2-digit year on its own, with no other tokens', () => {
        const formatter = new DateFormatter('en');

        const date = formatter.parseDate('20', 'YYYY');

        expect(asLocalDateString(date)).toBe('2020-1-1');
    });

    it('rejects a single leftover digit typed into a year-only field', () => {
        const formatter = new DateFormatter('en');

        expect(formatter.parseDate('2', 'YYYY')).toBeNull();
    });
});

describe('formatDate', () => {
    it('formats a date according to the given format', () => {
        const formatter = new DateFormatter('en');

        const text = formatter.formatDate(new Date(2020, 0, 24), 'MM/DD/YYYY');

        expect(text).toBe('01/24/2020');
    });

    it('returns an empty string when there is no date', () => {
        const formatter = new DateFormatter('en');

        expect(formatter.formatDate(undefined, 'MM/DD/YYYY')).toBe('');
    });
});

describe('expandFormat', () => {
    it('expands the localized "L" token for English', () => {
        const formatter = new DateFormatter('en');

        expect(formatter.expandFormat('L')).toBe('MM/DD/YYYY');
    });

    it('expands the localized "L" token for German', () => {
        const formatter = new DateFormatter('de');

        expect(formatter.expandFormat('L')).toBe('DD.MM.YYYY');
    });

    it('treats "no" as Norwegian Bokmål', () => {
        const formatter = new DateFormatter('no');

        expect(formatter.expandFormat('L')).toBe('DD.MM.YYYY');
    });

    it('expands British English day-first, unlike plain English', () => {
        // Regression test: "en" and "en-gb" used to collapse to the same
        // value, always validating against the US month-first pattern
        // even for a user who picked British English formatting.
        const formatter = new DateFormatter('en-gb');

        expect(formatter.expandFormat('L')).toBe('DD/MM/YYYY');
    });
});

describe('getDateFormat', () => {
    it('derives the month format from the day-inclusive one, for a locale using slashes', () => {
        const formatter = new DateFormatter('en');

        expect(formatter.getDateFormat('month')).toBe('MM/YYYY');
    });

    it('derives the month format from the day-inclusive one, for a locale using dots', () => {
        // Regression test: this used to be hardcoded to the English
        // "MM/YYYY" regardless of language, so a Danish user's typed
        // "01.2020" was rejected for not matching a slash-separated
        // pattern they were never shown.
        const formatter = new DateFormatter('da');

        expect(formatter.getDateFormat('month')).toBe('MM.YYYY');
    });

    it('derives the month format from the day-inclusive one, for a locale with the year first', () => {
        const formatter = new DateFormatter('sv');

        expect(formatter.getDateFormat('month')).toBe('YYYY-MM');
    });

    it('keeps the fixed format for a type with no locale-specific order', () => {
        const formatter = new DateFormatter('sv');

        expect(formatter.getDateFormat('year')).toBe('YYYY');
    });

    it('derives the month format for British English', () => {
        // Coincidentally the same as plain English's "MM/YYYY": dropping
        // the day from "DD/MM/YYYY" and from "MM/DD/YYYY" both leave
        // month before year, since day was the only thing distinguishing
        // their order.
        const formatter = new DateFormatter('en-gb');

        expect(formatter.getDateFormat('month')).toBe('MM/YYYY');
    });
});
