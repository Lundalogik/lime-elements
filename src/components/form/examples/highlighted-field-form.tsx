import { Component, h, Host, State } from '@stencil/core';
import { ListFormData, schema } from './list-schema';

/**
 * Take the user to a field
 *
 * Set `highlightedField` to the path of a field, and the form opens the list
 * item or section it is in, scrolls it into view, focuses it and highlights
 * it. Useful for going to a field that has an error, or one the user searched
 * for.
 *
 * @sourceFile list-schema.ts
 */
@Component({
    tag: 'limel-example-form-highlighted-field',
    shadow: true,
})
export class HighlightedFieldFormExample {
    @State()
    private formData: ListFormData = {
        villains: ['Joker', 'Thanos'],
        squad: [
            { name: 'Doctor Strange', powers: ['flight'] },
            { name: 'Thor', powers: ['strength', 'flight'] },
        ],
    };

    @State()
    private highlightedField?: Array<string | number>;

    public render() {
        return (
            <Host>
                <limel-button
                    label="Go to Doctor Strange's name"
                    onClick={this.showDoctorStrange}
                />
                <limel-button
                    label="Go to Thor's name"
                    onClick={this.showThor}
                />
                <limel-form
                    onChange={this.handleFormChange}
                    value={this.formData}
                    schema={schema}
                    highlightedField={this.highlightedField}
                />
            </Host>
        );
    }

    private readonly showDoctorStrange = () => {
        this.highlightedField = ['squad', 0, 'name'];
    };

    private readonly showThor = () => {
        this.highlightedField = ['squad', 1, 'name'];
    };

    private readonly handleFormChange = (event: CustomEvent<ListFormData>) => {
        this.formData = event.detail;
    };
}
