import { Component, h, Host, State } from '@stencil/core';
import { FillDefaultsFormData, schema } from './fill-defaults-schema';

/**
 * Leaving out the defaults
 * By default, the form fills in the `default` of every field the value leaves
 * out, as soon as it is given the value, and emits a `change` with them.
 *
 * Set `fillDefaults` to `false` when something else owns the defaults, such as
 * a server that fills them in before it sends the value. The form then shows
 * the value as it is, and only changes it when the user does. Here, the value
 * stays empty until a field is changed, and "Number of columns" and
 * "Dense layout" show nothing until they are set.
 *
 * @sourceFile fill-defaults-schema.ts
 */
@Component({
    tag: 'limel-example-form-fill-defaults',
    shadow: true,
})
export class FormFillDefaultsExample {
    @State()
    private formData: FillDefaultsFormData = {};

    public render() {
        return (
            <Host>
                <limel-form
                    fillDefaults={false}
                    onChange={this.handleFormChange}
                    value={this.formData}
                    schema={schema}
                />
                <limel-example-value value={this.formData} />
            </Host>
        );
    }

    private readonly handleFormChange = (
        event: CustomEvent<FillDefaultsFormData>
    ) => {
        this.formData = event.detail;
    };
}
