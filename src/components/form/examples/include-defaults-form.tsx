import { Component, h, Host, State } from '@stencil/core';
import { IncludeDefaultsFormData, schema } from './include-defaults-schema';

/**
 * Leaving out the defaults
 * By default, the form fills in the `default` of every field the value leaves
 * out, as soon as it is given the value, and emits a `change` with them.
 *
 * Set `includeDefaults` to `false` to keep the value as it was given until the
 * user changes something, for instance to tell a saved value from one the
 * user has edited. The form still shows the defaults. Here, "Number of
 * columns" and "Dense layout" show their defaults, but the value stays empty
 * until a field is changed. The host passes the value the form emits back in.
 *
 * @sourceFile include-defaults-schema.ts
 */
@Component({
    tag: 'limel-example-form-include-defaults',
    shadow: true,
})
export class FormIncludeDefaultsExample {
    @State()
    private formData: IncludeDefaultsFormData = {};

    public render() {
        return (
            <Host>
                <limel-form
                    includeDefaults={false}
                    onChange={this.handleFormChange}
                    value={this.formData}
                    schema={schema}
                />
                <limel-example-value value={this.formData} />
            </Host>
        );
    }

    private readonly handleFormChange = (
        event: CustomEvent<IncludeDefaultsFormData>
    ) => {
        this.formData = event.detail;
    };
}
