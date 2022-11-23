import { Component, h, State } from '@stencil/core';

/**
 * Password Field basic
 */
@Component({
    tag: 'limel-example-password-field-default',
    shadow: true,
})
export class PasswordFieldDefaultExample {
    @State()
    private required = false;

    @State()
    private disabled = false;

    @State()
    private value: string;

    private handleChange = (event: CustomEvent<string>) => {
        this.value = event.detail;
    };

    private setDisabled = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.disabled = event.detail;
    };

    private setRequired = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.required = event.detail;
    };

    public render() {
        return [
            <limel-password-field
                label="Password"
                required={this.required}
                disabled={this.disabled}
                onChange={this.handleChange}
            />,
            <div>
                <limel-flex-container justify="end">
                    <limel-checkbox
                        checked={this.disabled}
                        label="Disabled"
                        onChange={this.setDisabled}
                    />
                    <limel-checkbox
                        checked={this.required}
                        label="Required"
                        onChange={this.setRequired}
                    />
                </limel-flex-container>
            </div>,
            <limel-example-value value={this.value} label={'Password'} />,
        ];
    }
}
