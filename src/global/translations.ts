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

export class Translations {
    public get(key, language = 'en') {
        return allTranslations[language][key];
    }
}

const translations = new Translations();
export default (() => {
    return translations;
})();
