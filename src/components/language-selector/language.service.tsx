import { default as i18n } from 'roddeh-i18n';
import { default as enTranslations } from '../../locale/en/messages';
import { default as svTranslations } from '../../locale/sv/messages';

let instance = null;
export class LanguageService {
    private translations;

    constructor() {
        if (!instance) {
            instance = this;
            this.translations = {
                en: {
                    values: enTranslations,
                },
                sv: {
                    values: svTranslations,
                },
            };
        }
        return instance;
    }

    public setLanguage(langKey: string) {
        if (this.translations[langKey]) {
            i18n.translator.add(this.translations[langKey]);
        } else if (this.translations.en) {
            i18n.translator.add(this.translations.en);
        }
    }

    public getTranslation(translationKey: string): string {
        return i18n(translationKey);
    }
}
