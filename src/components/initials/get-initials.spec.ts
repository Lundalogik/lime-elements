import { test, expect, vi } from 'vitest';
import {
    getCompanyInitials,
    getDefaultInitials,
    getInitials,
} from './get-initials';

test.each([
    // The agreed rule: first letter of the first two words, legal form removed.
    ['Vara Metallindustri HB', 'VM'],
    ['Webbresurs AB', 'W'],
    ['Lime Technologies AB', 'LT'],
    ['Ericsson', 'E'],
    ['Salesforce', 'S'],
    // Legal form is stripped wherever it sits, not only at the end.
    ['AB Volvo', 'V'],
    ['Volvo AB', 'V'],
    // Punctuation around a legal-form token still identifies it.
    ['Acme Ltd.', 'A'],
    ['Acme (AB)', 'A'],
    // Only the first two usable words contribute.
    ['Stora Enso Oyj Sverige', 'SE'],
    // Leading punctuation inside a word is skipped, the word still counts.
    ['-Test AB', 'T'],
    // A digit identifies a company as much as a letter does, so numbers are
    // read rather than skipped over. Skipping them would turn `3M Company`
    // into `MC`, `1st Avenue Capital` into `SA`, and `24 Housing Oy` into `H`.
    ['3M Company', '3M'],
    ['3D Render Oy', '3D'],
    ['3A consulting Oy', '3A'],
    ['3 Suisses', '3S'],
    ['1st Avenue Capital', '1A'],
    // A number alone rarely identifies anyone, so a digits-only first word
    // keeps reading into the next one — where a word with letters stops.
    ['24 Housing Oy', '24H'],
    ['10 Barrel Brewing', '10B'],
    // Until the three characters the tile holds are used up.
    ['5.11 International', '511'],
    // A number too long to keep whole contributes its first digit only.
    ['2026 Ventures', '2V'],
    // Words with neither a letter nor a digit are skipped entirely.
    // Only decimal digits count. A superscript or a fraction is punctuation
    // here — counting it cost `²Foo Bar` the `F` of its own name.
    ['²Foo Bar', 'FB'],
    ['½ Bakery', 'B'],
    ['Ⅳ Company', 'C'],
    ['🎉 Party AB', 'P'],
    // A short all-capitals first word is the company, not an initial to reduce.
    // Reducing these to the first letter of each word would give `TT`, `EM`,
    // `PG` and `NE`.
    ['TNK Teknik & Maskiner A/S (DEMO)', 'TNK'],
    ['EG MTC', 'EG'],
    ['PH Glas (DEMO)', 'PH'],
    ['NTA Ejendomme (DEMO)', 'NTA'],
    ['HBA Fordonsteknik AB (DEMO)1', 'HBA'],
    // Legal forms are stripped before the acronym rule, so this reads from
    // `Culinar` rather than returning the stripped `AB`.
    ['AB Culinar', 'C'],
    // Four capitals is a name shouted in capitals, not an acronym.
    ['LEGO', 'L'],
    // Spelled-out company words are name material and are not stripped.
    ['Acme Corp', 'AC'],
    ['Acme Co', 'AC'],
    ['Acme Limited', 'AL'],
    // Non-Latin scripts read by grapheme, not code unit.
    ['北京小米科技', '北'],
    // Caseless scripts equal their own upper- and lower-case forms; they must
    // not all qualify as acronyms and be rendered whole.
    ['小米', '小'],
    // Astral-plane letters are surrogate pairs. Trimming by UTF-16 code unit
    // would see a lone surrogate, match neither \p{L} nor \p{N}, and strip the
    // letter off the edge of the word.
    ['𝔘nicorn AB', '𝔘'],
    ['Acme 𝔘', 'A𝔘'],
    ['Ελληνική Εταιρεία', 'ΕΕ'],
    ['Тинькофф Банк', 'ТБ'],
    // Accepted collisions, recorded rather than fixed: these tokens are a legal
    // form in one country and an ordinary word or surname in another, and no
    // positional rule spares them while `AB Volvo` still has to read `V`.
    // Dropping a token is not the answer either — each one abbreviates a real
    // legal form, `ou` included, which is how `OÜ` arrives in ASCII-only data.
    ['SAS Institute', 'I'],
    ['KG Knutsson', 'K'],
    ['Spa Hotel AB', 'H'],
    ['Nordic Spa', 'N'],
    ['Ou Chen', 'C'],
    ['Ag Chemicals', 'C'],
    ['As Seen On TV', 'SO'],
    // A leading legal form the set does not know is worse than one it does: the
    // acronym rule keeps it whole, so it becomes the tile and every company
    // sharing the form renders the same letters. These are the forms common
    // enough in European data to be worth listing.
    ['ООО Ромашка', 'Р'],
    ['ЗАО Газпром', 'Г'],
    ['UAB Vilniaus Bankas', 'VB'],
    ['SIA Rimi Latvia', 'RL'],
    ['KFT Budapest', 'B'],
    // Still accepted, for the same reason as `Nordic Spa`: a form that is also
    // an ordinary word costs the name that uses it as one.
    ['Sia Consulting', 'C'],
    // Not listed, and deliberately: `PT` is Indonesian, but it is also the whole
    // identity of companies that start with it in Latin data.
    ['PT Telkom Indonesia', 'PT'],
])('company name "%s" yields initials "%s"', (name, expected) => {
    expect(getCompanyInitials(name)).toBe(expected);
});

test.each([
    { name: '', reason: 'empty string' },
    { name: ' '.repeat(3), reason: 'whitespace only' },
    { name: 'AB', reason: 'nothing but a legal form' },
    { name: 'GmbH', reason: 'nothing but a legal form' },
    { name: 'SAS', reason: 'nothing but a legal form' },
    { name: '....', reason: 'no letters or digits at all' },
    { name: '🎉', reason: 'no letters or digits at all' },
    { name: undefined, reason: 'undefined' },
    { name: null, reason: 'null' },
])('company name yields no initials — $reason', ({ name }) => {
    expect(getCompanyInitials(name)).toBeUndefined();
});

test.each([
    // A kept-whole acronym contributes its letters, not the punctuation and
    // digits between them: the tile has room for three characters.
    ['A.B.C Consulting', 'ABC'],
    ['I.B.M.', 'IBM'],
    ['H&M Fashion', 'HM'],
    ['C/O Hotel', 'CO'],
])('reads an acronym as letters only: %s', (name, expected) => {
    expect(getCompanyInitials(name)).toBe(expected);
});

test('reads only the start of an absurdly long name', () => {
    // A name can be of any length, and a long one would otherwise be read in
    // full, for every tile, on every render.
    const monster = `A${'.'.repeat(60_000)}B`;

    expect(getCompanyInitials(monster)).toBe('A');
});

test.each([
    // An uppercase mapping can expand — one letter must still render as one
    // character, or the tile is asked to fit more than it was built for.
    ['\u{FB01}rma AB', 'F'],
    ['\u{DF}eta Corp', 'SC'],
    // Composing first keeps the accent attached to the letter.
    ['E\u{301}cole Normale', '\u{C9}N'],
    ['\u{C9}cole Normale', '\u{C9}N'],
])('reads %s as a single character per letter', (name, expected) => {
    expect(getCompanyInitials(name)).toBe(expected);
});

test('keeps a vowel sign together with the letter it belongs to', () => {
    // `की` is one letter in Devanagari, written as two code points that no
    // normalization form joins into one.
    expect(getInitials('की', 'initials')).toBe('की');
    expect(getDefaultInitials('कीर्ति शर्मा')).toBe('कीश');
    expect(getCompanyInitials('24 कीर्ति')).toBe('24की');
});

test('a hyphenated number keeps only its digit', () => {
    // `7-Eleven` is one word, and its letters and digits together are too long
    // to keep whole, so it falls back to the first character. Splitting on the
    // hyphen would fix it — and would also turn `Jean-Pierre Dupont` into `JP`
    // rather than `JD`, so the weak answer is the accepted one.
    expect(getCompanyInitials('7-Eleven Oy')).toBe('7');
});

test('a name of nothing but digits is read as those digits', () => {
    // When a name has nothing but digits, they are still better than no tile.
    expect(getCompanyInitials('123 ??')).toBe('123');
});

test('a word beginning past the length limit is not read', () => {
    // The limit bounds the walk, so it also decides which words exist: a second
    // word starting beyond it is dropped rather than truncated.
    const long = 'A'.repeat(130);

    expect(getCompanyInitials(`${long} Bar`)).toBe('A');
    expect(getCompanyInitials(`${'A'.repeat(120)} Bar`)).toBe('AB');
});

test('the default rule does not skip legal forms', () => {
    // `ab` and `as` are legal forms for a company and given names for a person.
    expect(getDefaultInitials('Ab Rahman')).toBe('AR');
    expect(getDefaultInitials('As Byatt')).toBe('AB');
    expect(getCompanyInitials('Ab Rahman')).toBe('R');
});

test.each([
    ['Maja Lindqvist', 'ML'],
    ['Anna Maria Svensson', 'AMS'],
    ['Jan Erik Karl Berg', 'JEB'],
    ['Maja-Lena Lindqvist', 'ML'],
    ['Madonna', 'M'],
    ['Ελένη Παπαδοπούλου', 'ΕΠ'],
    ['  maja   lindqvist ', 'ML'],
])('by the default rule, "%s" yields initials "%s"', (name, expected) => {
    expect(getDefaultInitials(name)).toBe(expected);
});

test.each([
    { name: '', reason: 'empty string' },
    { name: ' '.repeat(3), reason: 'whitespace only' },
    { name: '🎉 ...', reason: 'no letters or digits at all' },
    { name: undefined, reason: 'undefined' },
])('by the default rule, a name yields no initials — $reason', ({ name }) => {
    expect(getDefaultInitials(name)).toBeUndefined();
});

test('the default rule reads digits like the company rule does', () => {
    expect(getDefaultInitials('123 ??')).toBe('1');
    expect(getDefaultInitials('24 Housing')).toBe('2H');
});

test('reads a name by code point where no grapheme segmenter exists', async () => {
    // Without ICU data the accent is dropped rather than the letter being cut in
    // half. Both inputs carry a combining mark, so both reach the fallback — a
    // name that needs no segmenter would pass this test with ICU present too.
    const { Segmenter } = Intl;
    const unavailable = vi.fn(function () {
        throw new Error('no ICU data');
    });
    (Intl as any).Segmenter = unavailable;
    vi.resetModules();

    try {
        const { getCompanyInitials: withoutSegmenter } =
            await import('./get-initials');

        expect(withoutSegmenter('E\u{301}cole Normale')).toBe('EN');
        expect(withoutSegmenter('A\u{301}lpha Be\u{301}ta')).toBe('AB');
        expect(unavailable).toHaveBeenCalledTimes(1);
    } finally {
        // Reset again, so a test added below this one cannot silently run
        // against the second copy of the module and its own memo caches.
        vi.resetModules();
        (Intl as any).Segmenter = Segmenter;
    }
});

test('a name written in decomposed Hangul is read by cluster, not by jamo', () => {
    // Conjoining jamo are letters (`Lo`), so walking code points would give a
    // lone initial jamo instead of the syllable.
    expect(getCompanyInitials('한글 AB')).toBe('한');
    expect(getCompanyInitials('한글 AB'.normalize('NFD'))).toBe('한');
});

test('reads a half-width katakana letter with its sound mark as one letter', () => {
    // `ﾞ` is a letter modifier, not a combining mark, yet `ｶﾞ` is one letter.
    expect(getDefaultInitials('ｶﾞｽ ﾀﾞｲ')).toBe('ｶﾞﾀﾞ');
    expect(getInitials('ｶﾞｽ', 'initials')).toBe('ｶﾞｽ');
});

test('reads a Thai letter with the vowel sara am as one letter', () => {
    // `ำ` is a letter, not a combining mark, yet it belongs to the letter
    // before it.
    expect(getDefaultInitials('กำแพง')).toBe('กำ');
});

test('a legal form is recognised however its accents are encoded', () => {
    // The token set spells `oü` precomposed, so a decomposed `OÜ` would survive
    // as a word and be kept whole, reading `OÜ` instead of the name beside it.
    expect(getCompanyInitials('OÜ Tallinn')).toBe('T');
    expect(getCompanyInitials('OÜ Tallinn'.normalize('NFD'))).toBe('T');
});

test.each([
    ['KM', 'KM'],
    ['k m', 'KM'],
    ['k.m.', 'KM'],
    ['ÅÄÖ', 'ÅÄÖ'],
    ['ABCD', 'ABC'],
    ['3M', '3M'],
])('given initials "%s" are shown as "%s"', (name, expected) => {
    expect(getInitials(name, 'initials')).toBe(expected);
});

test.each([
    { name: '', reason: 'empty string' },
    { name: ' . ', reason: 'no letters or digits' },
    { name: undefined, reason: 'undefined' },
])('given initials yield nothing — $reason', ({ name }) => {
    expect(getInitials(name, 'initials')).toBeUndefined();
});

test('reads an unknown name type by the default rule, and warns about it once', async () => {
    vi.resetModules();
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    try {
        const { getInitials: fresh } = await import('./get-initials');

        expect(fresh('AB Volvo', 'organisation' as any)).toBe('AV');
        expect(fresh('AB Volvo', 'organisation' as any)).toBe('AV');
        expect(warn).toHaveBeenCalledTimes(1);
        expect(warn).toHaveBeenCalledWith(
            'limel-initials: unknown nameType "organisation"; using the default rule'
        );
    } finally {
        warn.mockRestore();
        vi.resetModules();
    }
});

test('reads a name by the default rule, without a warning, when no name type is given', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    try {
        expect(getInitials('AB Volvo')).toBe('AV');
        expect(getInitials('AB Volvo', undefined)).toBe('AV');
        expect(warn).not.toHaveBeenCalled();
    } finally {
        warn.mockRestore();
    }
});

test('reads each name type by its own rule', () => {
    expect(getInitials('AB Volvo', 'company')).toBe('V');
    expect(getInitials('AB Volvo', 'default')).toBe('AV');
    expect(getInitials('AB Volvo', 'initials')).toBe('ABV');
});
