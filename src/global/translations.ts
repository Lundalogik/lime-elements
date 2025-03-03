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
    nl: nl,
    sv: sv,
};

const REGEX = /\{\s*(\w+)\s*\}/g;

export class Translations {
    public get(key: string, language = 'en', params?: object): string {
        const translation = allTranslations[language][key];
        if (!translation) {
            return key;
        }

        return translation.replace(
            REGEX,
            (match: string, mergeCodeKey: string) => {
                return params[mergeCodeKey] || match;
            },
        );
    }
}

const translations = new Translations();
export default (() => {
    return translations;
})();
