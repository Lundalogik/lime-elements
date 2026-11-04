import { getSupportedLocale } from './language';

test.each([
    ['sv', 'sv'],
    ['SV-se', 'sv-SE'],
    ['nb-NO', 'nb-NO'],
])('the locale of %s is %s', (language, locale) => {
    expect(getSupportedLocale(language)).toBe(locale);
});

test.each([
    ['a tag Intl cannot read', 'sv_SE'],
    ['a language Intl does not know', 'zz'],
    ['an empty language', ''],
    ['a language that is not text', undefined],
])('%s has no locale', (_, language) => {
    expect(getSupportedLocale(language)).toBeUndefined();
});
