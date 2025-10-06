import { Component, h, Host, State } from '@stencil/core';
/**
 * Composite example
 */

@Component({
    tag: 'limel-example-color-picker-readonly',
    shadow: true,
})
export class ColorPickerReadonlyExample {
    @State()
    private value = 'rgba(var(--color-red-default), 0.4)';

    @State()
    private required = false;

    @State()
    private disabled = false;

    @State()
    private invalid = false;

    @State()
    private readonly = false;

    @State()
    private manualInput = true;

    @State()
    private placeholder = 'Any valid CSS color format is accepted';

    public render() {
        return (
            <Host>
                <limel-color-picker
                    label="Select a beautiful color"
                    value={this.value}
                    placeholder={this.placeholder}
                    readonly={this.readonly}
                    required={this.required}
                    disabled={this.disabled}
                    invalid={this.invalid}
                    manualInput={this.manualInput}
                    onChange={this.onChange}
                />
                <limel-example-controls>
                    <limel-checkbox
                        checked={this.required}
                        label="Required"
                        onChange={this.setRequired}
                    />
                    <limel-checkbox
                        checked={this.disabled}
                        label="Disabled"
                        onChange={this.setDisabled}
                    />
                    <limel-checkbox
                        checked={this.invalid}
                        label="Invalid"
                        onChange={this.setInvalid}
                    />
                    <limel-checkbox
                        checked={this.readonly}
                        label="Readonly"
                        onChange={this.setReadonly}
                    />
                    <limel-checkbox
                        checked={this.manualInput}
                        label="manualInput"
                        onChange={this.setManualInput}
                    />
                    <limel-input-field
                        label="Placeholder"
                        value={this.placeholder}
                        onChange={this.setPlaceholder}
                        style={{
                            gridColumn: '1/-1',
                            marginTop: '1rem',
                        }}
                    />
                </limel-example-controls>
            </Host>
        );
    }

    private onChange = (event: CustomEvent<string>) => {
        this.value = event.detail;
    };

    private setRequired = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.required = event.detail;
    };

    private setDisabled = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.disabled = event.detail;
    };

    private setInvalid = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.invalid = event.detail;
    };

    private setReadonly = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.readonly = event.detail;
    };

    private setManualInput = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.manualInput = event.detail;
    };

    private setPlaceholder = (event: CustomEvent<string>) => {
        event.stopPropagation();
        this.placeholder = event.detail;
    };
}
