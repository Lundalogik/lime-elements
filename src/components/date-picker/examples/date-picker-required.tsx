import { Component, h, Host, State } from '@stencil/core';

/**
 * Required validation
 *
 * When a date picker has the `required` prop set, it will automatically
 * validate and show an invalid state after the user has interacted with
 * the component and left it empty.
 *
 * This happens only after the first interaction (when the calendar closes),
 * so the field won't appear invalid before the user has had a chance to
 * enter a value.
 *
 * :::tip
 * Try opening the date picker, then closing it without selecting a date.
 * The field will become invalid because it's required but empty.
 * :::
 */
@Component({
    tag: 'limel-example-date-picker-required',
    shadow: true,
})
export class DatePickerRequiredExample {
    @State()
    private value: Date;

    @State()
    private disabled = false;

    @State()
    private readonly = false;

    @State()
    private required = true;

    public render() {
        return (
            <Host>
                <limel-date-picker
                    type="date"
                    label="Birthday"
                    helperText="This field is required"
                    value={this.value}
                    disabled={this.disabled}
                    readonly={this.readonly}
                    required={this.required}
                    onChange={this.handleChange}
                />
                <limel-example-controls>
                    <limel-switch
                        value={this.disabled}
                        label="Disabled"
                        onChange={this.setDisabled}
                    />
                    <limel-switch
                        value={this.readonly}
                        label="Readonly"
                        onChange={this.setReadonly}
                    />
                    <limel-switch
                        value={this.required}
                        label="Required"
                        onChange={this.setRequired}
                    />
                </limel-example-controls>
                <limel-example-value value={this.value} />
            </Host>
        );
    }

    private handleChange = (event: CustomEvent<Date>) => {
        this.value = event.detail;
    };

    private setDisabled = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.disabled = event.detail;
    };

    private setReadonly = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.readonly = event.detail;
    };

    private setRequired = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.required = event.detail;
    };
}
