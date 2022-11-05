import { Component, h, State } from '@stencil/core';

/**
 * Password show button
 */
@Component({
    tag: 'limel-example-password-field-with-button',
    shadow: true,
})
export class PasswordFieldWithButtonExample {

    @State()
    private required = false;

    @State()
    private disabled = false;

    @State()
    private showButton = true;

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

    private setShowButton = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.showButton = event.detail;
    };

    public render() {
        return [
            <limel-password-field
                label='Password'
                showHiddenButton={this.showButton}
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
                    <limel-checkbox
                        checked={this.showButton}
                        label="Show button"
                        onChange={this.setShowButton}
                    />
                </limel-flex-container>
            </div>,
            <limel-example-value value={this.value} label={'Password'} />,
        ];
    }
}
