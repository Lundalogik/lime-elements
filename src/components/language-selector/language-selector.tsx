import { Component, Prop } from '@stencil/core';
import { LanguageService } from './language.service';

@Component({
    tag: 'limel-language-selector',
})
export class LanguageSelector {
    @Prop()
    public lang: string;
    private languageService: LanguageService;

    public componentWillLoad() {
        this.languageService = new LanguageService();
        this.languageService.setLanguage(this.lang);
    }

    public render() {
        return '';
    }
}
