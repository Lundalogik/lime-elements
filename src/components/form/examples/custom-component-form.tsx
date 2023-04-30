import { Component, h, State } from '@stencil/core';
import { schema } from './custom-component-schema';

/**
 * Custom form component
 *
 * You can specify a custom component to use for any property in your form. This
 * is done under the `lime` key in the schema, following the
 * [LimeSchemaOptions](#/type/LimeSchemaOptions/) specification, for example:
 *
 * ```ts
 * const schema = {
 *     type: 'object',
 *     properties: {
 *         hero: {
 *             type: 'integer',
 *             title: 'Hero',
 *             lime: {
 *                 component: {
 *                     name: 'my-useful-hero-picker',
 *                 },
 *             },
 *         },
 *     },
 * };
 * ```
 *
 * While you can, in principle, use any component in a form, your custom form
 * components should implement the [FormComponent](#/type/FormComponent/)
 * interface.
 *
 * @link custom-component-schema.ts
 * @link custom-component-picker.tsx
 */
@Component({
    tag: 'limel-example-custom-component-form',
    shadow: true,
})
export class CustomComponentFormExample {
    @State()
    private formData: object = {
        name: 'My superhero deal',
        value: 1000000,
        hero: 1001,
    };

    public render() {
        return [
            <limel-form
                onChange={this.handleFormChange}
                value={this.formData}
                schema={schema}
            >
                <limel-example-custom-picker
                    slot="hero"
                    helperText="Pick your superhero!"
                />
            </limel-form>,
            <limel-example-value value={this.formData} />,
        ];
    }

    private handleFormChange = (event) => {
        this.formData = event.detail;
    };
}
