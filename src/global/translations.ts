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
    // English UI text doesn't differ between regions — only the date
    // format itself does — so this shares the "en" bundle rather than
    // needing its own translated copy.
    'en-gb': en,
    fi: fi,
    fr: fr,
    no: no,
    nl: nl,
    sv: sv,
};

const REGEX = /\{\s*(\w+)\s*\}/g;

export class Translations {
    public get(key: string, language = 'en', params?: object): string {
        // Falls back to the key itself for an unrecognized `language` too
        // (matching the existing "no translation found" fallback right
        // below), rather than letting a typo'd or newly-added-elsewhere
        // language code throw here. A supported `Languages` value with no
        // corresponding entry above previously threw synchronously inside
        // Flatpickr's `onReady` callback — which, left uncaught, aborted
        // `MonthPicker`/`QuarterPicker`/`YearPicker`'s calendar bootstrap
        // partway through, and (since the failure was inside `init()`,
        // before `flatPickrCreated` got set) caused every subsequent
        // re-render to retry the whole init from scratch, stacking a
        // fresh, still-partially-broken calendar header on top of the
        // last one instead of ever finishing or cleaning up.
        const translation: string = allTranslations[language]?.[key];
        if (!translation) {
            return key;
        }

        return translation.replaceAll(
            REGEX,
            (match: string, mergeCodeKey: string) => {
                return params[mergeCodeKey] || match;
            }
        );
    }
}

const translations = new Translations();
export default (() => {
    return translations;
})();
