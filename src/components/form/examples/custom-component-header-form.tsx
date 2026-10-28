import { Component, h, Host, State } from '@stencil/core';
import {
    CustomComponentHeaderFormData,
    schema,
} from './custom-component-header-schema';

/**
 * Header of a custom component
 * A custom component usually draws its own title, from its `label`, and its
 * own description, from its `helperText`. Set `showHeader` to `true` in the
 * `component` options and the form draws the title, the description and the
 * help above the component. The title is a heading with the right level for
 * how deep the field is, the description is shown as markdown, and the help
 * sits beside the title.
 *
 * The form still gives the component its `label` and `helperText`, as it
 * does without this option. So turn `showHeader` on only for a component
 * that draws no title of its own, like the card list in the "Widgets" field.
 * The "Hero" field shows what happens otherwise: the picker draws its own
 * label as well, below the heading of the form. A component that draws its
 * own title can read `showHeader` in `formInfo.schema`, to leave it out.
 *
 * The form does not draw the header of a field in a row layout, because
 * the row draws it.
 *
 * @sourceFile custom-component-header-schema.ts
 * @sourceFile custom-component-card-list.tsx
 * @sourceFile custom-component-picker.tsx
 */
@Component({
    tag: 'limel-example-custom-component-header-form',
    shadow: true,
})
export class CustomComponentHeaderFormExample {
    @State()
    private formData: CustomComponentHeaderFormData = {
        widgets: [
            { name: 'Chart' },
            { name: 'Info tile' },
            { name: 'To-do list' },
        ],
        hero: 1001,
    };

    public render() {
        return (
            <Host>
                <limel-form
                    onChange={this.handleFormChange}
                    value={this.formData}
                    schema={schema}
                />
                <limel-example-value value={this.formData} />
            </Host>
        );
    }

    private readonly handleFormChange = (
        event: CustomEvent<CustomComponentHeaderFormData>
    ) => {
        this.formData = event.detail;
    };
}
