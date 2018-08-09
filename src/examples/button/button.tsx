import { Component } from '@stencil/core';
import { LanguageService } from '../../components/language-selector/language.service';

@Component({
    shadow: true,
    tag: 'limel-example-button',
})
export class ButtonExample {
    private labelSave: string;
    private labelCancel: string;
    private labelDisabled: string;
    private languageService: LanguageService;

    public componentWillLoad() {
        this.languageService = new LanguageService();
        this.labelSave = this.languageService.getTranslation(
            'limel.button.save'
        );
        this.labelCancel = this.languageService.getTranslation(
            'limel.button.cancel'
        );
        this.labelDisabled = this.languageService.getTranslation(
            'limel.button.disabled'
        );
    }

    public render() {
        return (
            <limel-button-group reverse-order={true}>
                <limel-button label={this.labelSave} primary={true} />
                <limel-button label={this.labelCancel} />
                <limel-button label={this.labelDisabled} disabled={true} />
            </limel-button-group>
        );
    }
}
