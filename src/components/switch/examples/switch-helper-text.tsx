import { Component, h, State } from '@stencil/core';

/**
 * With `helperText`
 *
 * Switch can have a helper text, which is useful when providing additional information and
 * can clarify functionality of the switch for the user.
 *
 * The helper text is displayed when the user puts focus on the switch, and works with keyboard
 * navigation as well. However, on touchscreen devices, the helper text is always displayed.
 */

@Component({
    shadow: true,
    tag: 'limel-example-switch-helper-text',
})
export class SwitchExampleHelperText {
    @State()
    private value = true;

    @State()
    private disabled = false;

    @State()
    private readonly = false;

    public render() {
        return [
            <limel-switch
                label={`Ask Siri: ${this.value.toString()}`}
                value={this.value}
                disabled={this.disabled}
                readonly={this.readonly}
                onChange={this.changeHandler}
                helperText={'Siri helps you get things done, just by asking.'}
            />,
            <limel-example-controls>
                <limel-checkbox
                    checked={this.disabled}
                    label="Disabled"
                    onChange={this.setDisabled}
                />
                <limel-checkbox
                    checked={this.readonly}
                    label="Readonly"
                    onChange={this.setReadonly}
                />
                <limel-checkbox
                    checked={this.value}
                    label="Selected"
                    onChange={this.setChecked}
                />
            </limel-example-controls>,
            <limel-example-value value={this.value} />,
        ];
    }

    private changeHandler = (event: CustomEvent<boolean>) => {
        this.value = event.detail;
    };

    private setDisabled = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.disabled = event.detail;
    };

    private setChecked = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.value = event.detail;
    };

    private setReadonly = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.readonly = event.detail;
    };
}
