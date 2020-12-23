import { ValidationStatus } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';
import { schema } from './layout-schema';

/**
 * Layout
 * By default, each item in a limel-form will be rendered in a single row, and
 * each row occupies the entire available width of the form's container.
 *
 * This default layout may work fine on small screens or narrow containers,
 * but on larger screens it usually won't produce a nice layout. Thus we
 * recommend that you choose an appropriate responsive layout for your form.
 *
 * ###### Enabling responsive layouts
 *
 * By specifying `'grid'` as the layout `type` in your schema, as well as your desired
 * number of `columns`, you can leave the job of responsively handling the form
 * layout to Lime Elements.
 * ```ts
 * export const schema = {
 *     type: 'object',
 *     lime: {
 *         layout: {
 *             type: 'grid',
 *             columns: 3,
 *         },
 *     },
 *     …
 * };
 * ```
 * :::note
 * Value for `columns` can only be `5`, `4`, `3`, `2`, or `1`. If you do not
 * specify a value, `limel-form` will choose `5` by default.
 * :::
 *
 * So if you have chosen `4` for instance, the form will do its best to fit
 * four columns in a row. But for smaller containers in which placement of four
 * items per row is not possible, the form will automatically change the layout
 * and fit 3 items per row. As the container's width decreases, the number of
 * columns will also decrease.
 *
 * :::tip
 * You can divide a form into sections,
 * and specify a different layout for each section.
 * :::
 *
 * In this example, each collapsible section has its own `colSpan`.
 * However, since the layout is responsive, make sure to change the browser
 * window size to see how their responsive layout changes.
 *
 * @link layout-schema.ts
 */
@Component({
    tag: 'limel-example-form-layout',
    shadow: true,
})
export class FormLayoutExample {
    @State()
    private formData: object = {};

    @State()
    private valid = true;

    constructor() {
        this.handleFormChange = this.handleFormChange.bind(this);
        this.handleFormValidate = this.handleFormValidate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    public render() {
        return [
            <limel-form
                onChange={this.handleFormChange}
                onValidate={this.handleFormValidate}
                value={this.formData}
                schema={schema}
            />,
            <br />,
            <limel-button
                label="Submit"
                primary={true}
                disabled={!this.valid}
                onClick={this.handleSubmit}
            />,
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
}
