import { Component, h, State } from '@stencil/core';
import { CustomComponentFormData, schema } from './custom-component-schema';

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
 * A custom component that takes over a list or an object, and shows
 * its own title, can give the title the same style as the headings of
 * the form. Use the `form-heading` mixin on the title. The size, the
 * weight and the colored bar then depend on how deep the component is
 * in the form, as they do for the headings of the form.
 *
 * ```scss
 * @use '@limetech/lime-elements' as lime-elements;
 *
 * .title {
 *     @include lime-elements.form-heading;
 * }
 * ```
 *
 * @sourceFile custom-component-schema.ts
 * @sourceFile custom-component-picker.tsx
 */
@Component({
    tag: 'limel-example-custom-component-form',
    shadow: true,
})
export class CustomComponentFormExample {
    @State()
    private formData: CustomComponentFormData = {
        name: 'My superhero deal',
        value: 1_000_000,
        hero: 1001,
    };

    public render() {
        return [
            <limel-form
                onChange={this.handleFormChange}
                value={this.formData}
                schema={schema}
            />,
            <limel-example-value value={this.formData} />,
        ];
    }

    private handleFormChange = (event) => {
        this.formData = event.detail;
    };
}
