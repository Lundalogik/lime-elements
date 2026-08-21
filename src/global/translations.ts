import da from '../translations/da';
import de from '../translations/de';
import en from '../translations/en';
import fi from '../translations/fi';
import fr from '../translations/fr';
import nl from '../translations/nl';
import no from '../translations/no';
import sv from '../translations/sv';

const allTranslations = {
    da: da,
    de: de,
    en: en,
    fi: fi,
    fr: fr,
    no: no,
    nb: no, // Norwegian Bokmål shares the Norwegian (`no`) translations
    nl: nl,
    sv: sv,
};

const REGEX = /\{\s*(\w+)\s*\}/g;

export class Translations {
    public get(key: string, language = 'en', params?: object): string {
        // Fall back to English when the requested language has no translations.
        // The `language` props are typed, but a custom element takes whatever
        // string an attribute carries, so an unknown language must never make a
        // component throw.
        const languageTranslations =
            allTranslations[language] ?? allTranslations.en;

        // Fall back per key as well: a mapped language whose file is missing
        // this one key would otherwise render the key itself as UI text.
        const translation: string =
            languageTranslations[key] ?? allTranslations.en[key];
        if (!translation) {
            return key;
        }

        return translation.replaceAll(
            REGEX,
            (match: string, mergeCodeKey: string) => {
                // Nullish, not falsy: `0` and `false` are values a caller can
                // legitimately merge in, and `||` would leave the merge code
                // itself in the string instead.
                return String(params?.[mergeCodeKey] ?? match);
            }
        );
    }
}

const translations = new Translations();
export default (() => {
    return translations;
})();
