import { Component, h, Host, State } from '@stencil/core';
import { HeadingLevelFormData, schema } from './heading-level-form-schema';

/**
 * Heading level
 * A form is usually one part of a page that has headings of its own.
 * By default, the topmost heading in a form is an `h1`. Set `headingLevel`
 * so that the headings of the form continue below the heading of the page.
 *
 * Here, the page has an `h2`, so the form starts at level `3`. The headings
 * of the sections inside it get one level more for each level of nesting:
 * "Customer" is an `h3`, "Address" is an `h4`, and "Delivery" is an `h5`.
 *
 * The form looks the same at every `headingLevel`. What changes is how
 * assistive technologies, such as screen readers, announce the headings.
 *
 * @sourceFile heading-level-form-schema.ts
 */
@Component({
    tag: 'limel-example-form-heading-level',
    shadow: true,
})
export class FormHeadingLevelExample {
    @State()
    private formData: HeadingLevelFormData = {};

    public render() {
        return (
            <Host>
                <h2>Order</h2>
                <limel-form
                    headingLevel={3}
                    onChange={this.handleFormChange}
                    value={this.formData}
                    schema={schema}
                />
                <limel-example-value value={this.formData} />
            </Host>
        );
    }

    private handleFormChange = (event: CustomEvent<HeadingLevelFormData>) => {
        this.formData = event.detail;
    };
}
