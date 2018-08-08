import { Component } from '@stencil/core';
import { LanguageService } from '../../components/language-selector/language.service';

@Component({
    shadow: true,
    tag: 'limel-example-button',
})
export class ButtonExample {
    private labelSave: string;
    private labelCancel: string;
    private languageService: LanguageService;

    public componentWillLoad() {
        this.languageService = new LanguageService();
        this.labelSave = this.languageService.getTranslation(
            'limel.button.save'
        );
        this.labelCancel = this.languageService.getTranslation(
            'limel.button.cancel'
        );
    }

    public render() {
        return (
            <limel-button-group reverse-order={true}>
                <limel-button label={this.labelSave} primary={true} />
                <limel-button label={this.labelCancel} />
                <limel-button label="disabled" disabled={true} />
            </limel-button-group>
        );
    }
}
