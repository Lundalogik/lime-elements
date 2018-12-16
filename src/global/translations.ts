import da from '../translations/da';
import en from '../translations/en';
import fi from '../translations/fi';
import no from '../translations/no';
import sv from '../translations/sv';

const allTranslations = { da: da, en: en, fi: fi, no: no, sv: sv };

export class Translations {
    public get(key, language = 'en') {
        return allTranslations[language][key];
    }
}

const translations = new Translations();
export default (() => {
    return translations;
})();
