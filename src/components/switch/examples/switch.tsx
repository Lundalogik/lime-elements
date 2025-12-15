import { Component, h, State } from '@stencil/core';

@Component({
    shadow: true,
    tag: 'limel-example-switch',
})
export class SwitchExample {
    @State()
    private value = true;

    @State()
    private disabled = false;

    @State()
    private readonly = false;

    @State()
    private invalid = false;

    public render() {
        return [
            <limel-switch
                label="Bluetooth"
                value={this.value}
                disabled={this.disabled}
                readonly={this.readonly}
                onChange={this.changeHandler}
                invalid={this.invalid}
            />,
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
                    value={this.invalid}
                    label="Invalid"
                    onChange={this.setInvalid}
                />
                <limel-switch
                    value={this.value}
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

    private setInvalid = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.invalid = event.detail;
    };
}
