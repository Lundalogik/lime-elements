import { Languages, Option } from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';

const LABELS: Record<string, string> = {
    en: 'Customer details',
    sv: 'Kunddetaljer',
    de: 'Kundendetails',
    fr: 'Détails du client',
};

/**
 * Accessibility
 *
 * Screen readers announce `label` as the name of the panel. The resize handle
 * is named after it: a panel with the label "Customer details" has a handle
 * named "Resize Customer details panel". A panel without a label has a handle
 * named "Resize side panel".
 *
 * `language` sets the language of the name of the handle. Write `label` in the
 * same language.
 *
 * In this example, open the panel, then change the language or switch off the
 * label. A screen reader announces the new name of the handle.
 */
@Component({
    tag: 'limel-example-side-panel-accessibility',
    shadow: true,
    styleUrl: 'side-panel-example.scss',
})
export class SidePanelAccessibilityExample {
    @State()
    private open = false;

    @State()
    private language: Option = { text: 'English', value: 'en' };

    @State()
    private hasLabel = true;

    private languages: Option[] = [
        { text: 'English', value: 'en' },
        { text: 'Svenska', value: 'sv' },
        { text: 'Deutsch', value: 'de' },
        { text: 'Français', value: 'fr' },
    ];

    public render() {
        return (
            <Host>
                <div class="page">
                    <limel-button
                        primary
                        label="Open the panel"
                        onClick={this.openPanel}
                    />
                    {this.renderPanel()}
                </div>
                <limel-example-controls>
                    <limel-select
                        label="Language"
                        options={this.languages}
                        value={this.language}
                        onChange={this.setLanguage}
                    />
                    <limel-switch
                        label="Set label"
                        value={this.hasLabel}
                        onChange={this.setHasLabel}
                    />
                </limel-example-controls>
            </Host>
        );
    }

    private renderPanel() {
        if (!this.open) {
            return;
        }

        const language = this.language.value as Languages;

        return (
            <limel-side-panel
                label={this.hasLabel ? LABELS[language] : undefined}
                language={language}
                onClose={this.closePanel}
            />
        );
    }

    private openPanel = () => {
        this.open = true;
    };

    private closePanel = () => {
        this.open = false;
    };

    private setLanguage = (event: CustomEvent<Option | Option[]>) => {
        event.stopPropagation();
        this.language = event.detail as Option;
    };

    private setHasLabel = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.hasLabel = event.detail;
    };
}
