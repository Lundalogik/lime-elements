import { Component, h, Host, State } from '@stencil/core';
import {
    GoToPageEvent,
    Languages,
    LimelPaginationCustomEvent,
    LimelSelectCustomEvent,
    Option,
} from '@limetech/lime-elements';

/**
 * Language
 *
 * `language` translates the labels a screen reader reads out, and the text in
 * the tooltips.
 *
 * It also changes how numbers are written, because not everyone writes them the
 * same way. `9 840` in Swedish is `9,840` in English and `9.840` in German.
 *
 * In this example, you can try picking a language and hovering a page to see
 * its tooltip.
 */
@Component({
    tag: 'limel-example-pagination-language',
    shadow: true,
})
export class PaginationLanguageExample {
    @State()
    private language: Languages = 'en';

    @State()
    private page = 247;

    private readonly languages: Option[] = [
        { text: 'English', value: 'en' },
        { text: 'Svenska', value: 'sv' },
        { text: 'Dansk', value: 'da' },
        { text: 'Norsk', value: 'no' },
        { text: 'Suomi', value: 'fi' },
        { text: 'Deutsch', value: 'de' },
        { text: 'Français', value: 'fr' },
        { text: 'Nederlands', value: 'nl' },
    ];

    render() {
        return (
            <Host>
                <limel-pagination
                    page={this.page}
                    pageSize={20}
                    totalItems={9840}
                    language={this.language}
                    onGoToPage={this.handleGoToPage}
                />
                <limel-example-value label="Page" value={this.page} />
                <limel-example-controls>
                    <limel-select
                        label="Language"
                        value={this.languages.find(
                            (option) => option.value === this.language
                        )}
                        options={this.languages}
                        onChange={this.handleLanguageChange}
                    />
                </limel-example-controls>
            </Host>
        );
    }

    private readonly handleGoToPage = (
        event: LimelPaginationCustomEvent<GoToPageEvent>
    ) => {
        this.page = event.detail.page;
    };

    private readonly handleLanguageChange = (
        event: LimelSelectCustomEvent<Option>
    ) => {
        this.language = event.detail.value as Languages;
    };
}
