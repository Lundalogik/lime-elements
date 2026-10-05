import { DateFormatter } from './date-formatter';

const asLocalDateString = (date: Date): string =>
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

describe('getLanguage', () => {
    it('maps Norwegian to the moment locale that exists', () => {
        expect(new DateFormatter('no').getLanguage()).toBe('nb');
    });

    it('resolves a regional tag to its primary subtag', () => {
        expect(new DateFormatter('nb-NO').getLanguage()).toBe('nb');
        expect(new DateFormatter('no-NO').getLanguage()).toBe('nb');
        expect(new DateFormatter('SV-SE').getLanguage()).toBe('sv');
    });
});

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

    it('ignores surrounding whitespace', () => {
        const formatter = new DateFormatter('en');

        const date = formatter.parseDate(' 01/24/2020 ', 'MM/DD/YYYY');

        expect(asLocalDateString(date)).toBe('2020-1-24');
    });

    it('accepts a 2-digit year', () => {
        const formatter = new DateFormatter('en');

        const date = formatter.parseDate('1/24/20', 'MM/DD/YYYY');

        expect(asLocalDateString(date)).toBe('2020-1-24');
    });

    it('accepts a 2-digit year typed in a locale using dots', () => {
        const formatter = new DateFormatter('de');

        const date = formatter.parseDate('31.01.20', 'L');

        expect(asLocalDateString(date)).toBe('2020-1-31');
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
        const formatter = new DateFormatter('en');

        expect(formatter.parseDate('1/24/2', 'MM/DD/YYYY')).toBeNull();
    });

    it('rejects a single leftover digit typed into the year, against the raw "L" token', () => {
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

    it('rejects a truncated year in a datetime with an am/pm marker', () => {
        const formatter = new DateFormatter('en');

        expect(formatter.parseDate('01/24/2 - 3:45 PM', 'L - LT')).toBeNull();
        expect(formatter.parseDate('01/24/202 - 3:45 PM', 'L - LT')).toBeNull();
    });

    it('accepts a 2-digit year in a datetime with an am/pm marker', () => {
        const formatter = new DateFormatter('en');

        const date = formatter.parseDate('01/24/20 - 3:45 PM', 'L - LT');

        expect(asLocalDateString(date)).toBe('2020-1-24');
    });

    it('rejects a truncated week-year behind an escaped literal', () => {
        const formatter = new DateFormatter('en');

        expect(formatter.parseDate('w 5 2', '[w] W GGGG')).toBeNull();
        expect(formatter.parseDate('w 5 20', '[w] W GGGG')).toBeNull();
    });

    it('accepts a complete week behind an escaped literal', () => {
        const formatter = new DateFormatter('en');

        const date = formatter.parseDate('w 5 2020', '[w] W GGGG');

        expect(asLocalDateString(date)).toBe('2020-1-27');
    });

    it('rejects a truncated year in a quarter', () => {
        const formatter = new DateFormatter('en');

        expect(formatter.parseDate('Q1 2', '[Q]Q YYYY')).toBeNull();
    });

    it('rejects a truncated year after a spelled-out month', () => {
        const formatter = new DateFormatter('sv');

        expect(formatter.parseDate('24 januari 2', 'LL')).toBeNull();
    });

    it('accepts a full date with a spelled-out month', () => {
        const formatter = new DateFormatter('sv');

        const date = formatter.parseDate('24 januari 2020', 'LL');

        expect(asLocalDateString(date)).toBe('2020-1-24');
    });

    it('rejects a truncated year in a format without separators', () => {
        const formatter = new DateFormatter('en');

        expect(formatter.parseDate('01012', 'DDMMYYYY')).toBeNull();
        expect(formatter.parseDate('0101202', 'DDMMYYYY')).toBeNull();
    });

    it('accepts a complete date in a format without separators', () => {
        const formatter = new DateFormatter('en');

        const date = formatter.parseDate('01012020', 'DDMMYYYY');

        expect(asLocalDateString(date)).toBe('2020-1-1');
    });

    it('rejects a truncated year typed without the separators of the format', () => {
        const formatter = new DateFormatter('en');

        expect(formatter.parseDate('01242', 'L')).toBeNull();
        expect(formatter.parseDate('0124202', 'L')).toBeNull();
    });

    it('accepts a complete date typed without the separators of the format', () => {
        const formatter = new DateFormatter('en');

        const date = formatter.parseDate('01242020', 'L');

        expect(asLocalDateString(date)).toBe('2020-1-24');
    });

    it('rejects a truncated year typed without the literal of the format', () => {
        const formatter = new DateFormatter('en');

        expect(formatter.parseDate('5 2', '[w] W GGGG')).toBeNull();
        expect(formatter.parseDate('1 2', '[Q]Q YYYY')).toBeNull();
    });

    it('rejects a truncated year behind a literal containing an "l"', () => {
        const formatter = new DateFormatter('en');

        expect(
            formatter.parseDate('Deadline 01/24/2', '[Deadline] L')
        ).toBeNull();
    });

    it('accepts a complete date behind a literal containing an "l"', () => {
        const formatter = new DateFormatter('en');

        const date = formatter.parseDate('Deadline 01/24/2020', '[Deadline] L');

        expect(asLocalDateString(date)).toBe('2020-1-24');
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

    it('keeps the text of a literal as is, without its brackets', () => {
        const formatter = new DateFormatter('en');

        expect(formatter.expandFormat('[Deadline] L')).toBe(
            'Deadline MM/DD/YYYY'
        );
    });

    it('does not expand an "l" inside a literal', () => {
        const formatter = new DateFormatter('sv');

        expect(formatter.expandFormat('L [kl.] LT')).toBe(
            'YYYY-MM-DD kl. HH:mm'
        );
    });

    it('shows the default week format without brackets', () => {
        const formatter = new DateFormatter('en');

        expect(formatter.expandFormat(formatter.getDateFormat('week'))).toBe(
            'w W GGGG'
        );
    });
});

describe('getDateFormat', () => {
    it('uses the same month format whatever the locale', () => {
        expect(new DateFormatter('en').getDateFormat('month')).toBe('MM/YYYY');
        expect(new DateFormatter('sv').getDateFormat('month')).toBe('MM/YYYY');
    });
});
