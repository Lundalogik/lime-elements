import { ValidationStatus } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';
import { schema } from './span-fields-schema';

/**
 * Stretching fields in a form
 *
 * Sometimes, you need a field in the form to occupy several columns or the
 * entire row, and stretch itself as wide as the form's width,
 * disregarding the form's layout and placement of the item in the list.
 *
 * This could be nice for fields that require more space to provide better
 * usability.
 *
 * :::tip
 * For example, a larger `textarea` is easier for the user to type in and
 * a `slider` that has many steps is easier to interact with when it is rendered wider.
 * :::
 *
 * To do so, in your schema you need to specify a `layout` for the field itself.
 * `span` specifies the number of columns that the field should span.
 *
 * Thus, `span` can be set to `2`, `3`, `4`, `5`, or `all`.
 * Since we do not offer a *form layout* that has more than five columns,
 * values higher than 5 (or higher than the maximum number of columns in the form)
 * will only force the field to be full-width, just like `all` does.
 *
 * ```ts
 * export const schema = {
 *     …
 *     properties: {
 *         name: {
 *             type: 'string',
 *             title: 'Comment',
 *             lime: {
 *                 layout: {
 *                       colSpan: 'all',
 *                   },
 *               },
 *         },
 *         …
 *     },
 *     …
 * };
 * ```
 *
 * ###### Dense layout (Auto reorder fields to avoid empty cells)
 * The order of fields and the number of columns that a field must span, can
 * affect the layout of your responsive form when the container width changes.
 *
 * Let's say you have a form with a 4 column layout, and you specify that its
 * second field must span 3 columns.
 * If the container's width decreases, it will force the form to render its
 * layout in 3 columns instead. Therefore, the second field has to jump
 * to the next line to still be able to span 3 columns.
 * This will leave 2 empty cells in the first row, right after the first field.
 *
 * To avoid these empty cells in the UI, limel-form will place the next available
 * field in this hole, provided it fits. So the hole may be filled by a single 2 column
 * wide field, by two 1 column wide fields, or only partially filled by a single 1 column
 * wide field. If none of the remaining fields fit, the hole will be left as it is.
 *
 * However, you can disable this functionality by setting `dense` to `false` in the
 * options for the grid layout.
 *
 * ```ts
 * export const schema = {
 *     type: 'object',
 *     lime: {
 *         layout: {
 *             type: 'grid',
 *             dense: false,
 *         },
 *     },
 * };
 * ```
 *
 * :::note
 * Sometimes, the order of fields are important for the way users perceive the form.
 * If you choose to use the default auto-reordering behavior, make sure to test your
 * form's layout in different screen sizes to see whether you can mitigate unwanted
 * layout changes.
 *
 * Some unwanted results can be avoided by changing the order of the fields,
 * so that they render appropriately on different screens, or by dividing
 * the form into more sections.
 * :::
 *
 * ###### Stretching a field vertically
 * Most standard elements that can be used in forms, such as `limel-input`,
 * `limel-select`, `limel-slider`, etc, have a fixed height, and therefore
 * it does not really make sense to stretch them vertically, and we strongly
 * recommend you not to!
 *
 * But there are some exceptions. One of them is `limel-input-field` with
 * `type='textarea'`.
 *
 * Also, if you create a custom component for your form—let's say a map—you
 * can use `rowSpan` to increase the height of your custom component.
 * ```ts
 * export const schema = {
 *     type: 'object',
 *     properties: {
 *         comment: {
 *             type: 'string',
 *             title: 'Comment',
 *             lime: {
 *                 component: {
 *                     props: {
 *                         type: 'textarea',
 *                     },
 *                 },
 *                 layout: {
 *                       colSpan: 3,
 *                       rowSpan: 2,
 *                 },
 *             },
 *         },
 *     },
 * };
 * ```
 *
 * :::note
 * If you do *not* set the `rowSpan` for a component, it can stretch vertically
 * within its row, and the row will simply expand with the component.
 *
 * If you *do* set a `rowSpan`, even if you set it to `1`, the component is
 * fixed to that height. What happens to any potential overflow depends on the
 * component.
 * :::
 *
 * :::warning
 * Custom web-components that you include in the forms should not have hard-coded
 * `width` or `height` values! Otherwise they will stretch out of their cell and break
 * the UI. Make sure that such components are internally designed to be responsive,
 * and that their `:host` and any potential wrapping container has the following styles:
 * ```scss
 * :host {
 *     display: block; // or another suitable property
 *     width: 100%;
 *     height: 100%;
 * }
 * :host([hidden]) {
 *     display: none;
 * }
 * .my-component {
 *     width: 100%;
 *     height: 100%;
 * }
 * ```
 * :::
 *
 * @link span-fields-schema.ts
 */
@Component({
    tag: 'limel-example-form-span-fields',
    shadow: true,
})
export class FormLayoutExample {
    @State()
    private formData: object = {};

    @State()
    private valid = true;

    @State()
    private dense = true;

    @State()
    private schema = schema;

    constructor() {
        this.handleFormChange = this.handleFormChange.bind(this);
        this.handleFormValidate = this.handleFormValidate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    }

    public render() {
        return [
            <limel-flex-container justify="end">
                <limel-switch
                    label="Dense layout"
                    value={this.dense}
                    onChange={this.handleCheckboxChange}
                />
            </limel-flex-container>,
            <limel-form
                onChange={this.handleFormChange}
                onValidate={this.handleFormValidate}
                value={this.formData}
                schema={this.schema}
            />,
            <limel-flex-container justify="end">
                <limel-button
                    label="Submit"
                    primary={true}
                    disabled={!this.valid}
                    onClick={this.handleSubmit}
                />
            </limel-flex-container>,
        ];
    }

    private handleFormChange(event) {
        this.formData = event.detail;
    }

    private handleFormValidate(event: CustomEvent<ValidationStatus>) {
        this.valid = event.detail.valid;
        console.log(event.detail);
    }

    private handleSubmit() {
        const json = JSON.stringify(this.formData, null, '    ');
        alert(`Sending information to villains...\n\n${json}`);
    }

    private handleCheckboxChange(event: CustomEvent<boolean>) {
        this.dense = event.detail;
        this.schema = { ...this.schema };
        this.schema.lime.layout.dense = this.dense;
    }
}
