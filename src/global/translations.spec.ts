import translate from './translations';
import sv from '../translations/sv';

describe('translations', () => {
    describe('get', () => {
        it('returns the English translation by default', () => {
            expect(translate.get('clear-value')).toBe('Clear value');
        });

        it('returns the translation for the requested language', () => {
            expect(translate.get('value-not-set', 'sv')).toBe(
                'Värde inte angivet'
            );
        });

        it('resolves Norwegian Bokmål to the Norwegian translations', () => {
            // `nb` is part of the `Languages` type but has no translation file
            // of its own, so it is aliased to `no`. Before it was mapped, this
            // threw a `TypeError` for every component rendered with it.
            expect(translate.get('value-not-set', 'nb')).toBe(
                'Verdi ikke angitt'
            );
            expect(translate.get('value-not-set', 'nb')).toBe(
                translate.get('value-not-set', 'no')
            );
        });

        it('falls back to English for a language it does not know', () => {
            expect(translate.get('clear-value', 'xx')).toBe('Clear value');
        });

        it('returns the key itself when the key is unknown', () => {
            expect(translate.get('no-such-key', 'sv')).toBe('no-such-key');
        });

        it('falls back to English for a key a known language is missing', () => {
            // Guards against a new key landing in `en.ts` but not in every
            // other file, which would otherwise render the key as UI text.
            // `translations.ts` maps this very object, so removing a key
            // here is what a translation file missing one looks like.
            const table: Record<string, string> = sv;
            const key = 'clear-value';
            const original = table[key];
            delete table[key];

            try {
                expect(translate.get(key, 'sv')).toBe('Clear value');
            } finally {
                table[key] = original;
            }
        });

        it('substitutes merge codes with the given params', () => {
            expect(
                translate.get('clear-value-of', 'en', { label: 'Priority' })
            ).toBe('Clear value of Priority');
        });

        it('substitutes falsy merge-code values rather than dropping them', () => {
            expect(
                translate.get('code-diff.hidden-lines', 'en', { count: 0 })
            ).toBe('\u00B7\u00B7\u00B7 0 hidden lines \u00B7\u00B7\u00B7');
            expect(
                translate.get('clear-value-of', 'en', { label: false })
            ).toBe('Clear value of false');
            expect(translate.get('clear-value-of', 'en', { label: '' })).toBe(
                'Clear value of '
            );
        });

        it('leaves a merge code intact when its param is missing', () => {
            expect(translate.get('clear-value-of', 'en', {})).toBe(
                'Clear value of { label }'
            );
            expect(translate.get('clear-value-of', 'en')).toBe(
                'Clear value of { label }'
            );
        });
    });
});
