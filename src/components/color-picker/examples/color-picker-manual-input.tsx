import { Component, h, Host, State } from '@stencil/core';
/**
 * Disallowing manual input
 * By default, users can not only pick a color from the palette,
 * but also type in any valid color name or color value.
 *
 * By setting the `manualInput` to `false` you can easily prevent users from
 * typing a custom color value into the input field.
 *
 * Naturally, setting this prop to `false` does not completely disable the color picker.
 * It will only allow users to pick from the provided color palette.
 */

@Component({
    tag: 'limel-example-color-picker-manual-input',
    shadow: true,
})
export class ColorPickerManualInputExample {
    @State()
    private value = 'rgb(var(--color-cyan-default))';

    @State()
    private manualInput = false;

    private customPalette = [
        { name: 'red', value: 'rgb(var(--color-red-default))' },
        { name: 'pink', value: 'rgb(var(--color-pink-default))' },
        { name: 'magenta', value: 'rgb(var(--color-magenta-default))' },
        { name: 'purple', value: 'rgb(var(--color-purple-default))' },
        { name: 'violet', value: 'rgb(var(--color-violet-default))' },
        { name: 'indigo', value: 'rgb(var(--color-indigo-default))' },
        { name: 'blue', value: 'rgb(var(--color-blue-default))' },
        { name: 'sky', value: 'rgb(var(--color-sky-default))' },
        { name: 'cyan', value: 'rgb(var(--color-cyan-default))' },
        { name: 'teal', value: 'rgb(var(--color-teal-default))' },
        { name: 'green', value: 'rgb(var(--color-green-default))' },
        { name: 'lime', value: 'rgb(var(--color-lime-default))' },
        { name: 'grass', value: 'rgb(var(--color-grass-default))' },
        { name: 'yellow', value: 'rgb(var(--color-yellow-default))' },
        { name: 'amber', value: 'rgb(var(--color-amber-default))' },
        { name: 'orange', value: 'rgb(var(--color-orange-default))' },
        { name: 'coral', value: 'rgb(var(--color-coral-default))' },
        { name: 'brown', value: 'rgb(var(--color-brown-default))' },
        { name: 'gray', value: 'rgb(var(--color-gray-default))' },
        { name: 'glaucous', value: 'rgb(var(--color-glaucous-default))' },
    ];

    public render() {
        return (
            <Host>
                <limel-color-picker
                    value={this.value}
                    palette={this.customPalette}
                    placeholder="Typing custom colors is not allowed"
                    manualInput={this.manualInput}
                    onChange={this.onChange}
                />
                <limel-example-controls>
                    <limel-checkbox
                        checked={this.manualInput}
                        label="manualInput"
                        onChange={this.setManualInput}
                    />
                </limel-example-controls>
            </Host>
        );
    }

    private onChange = (event: CustomEvent<string>) => {
        this.value = event.detail;
    };

    private setManualInput = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.manualInput = event.detail;
    };
}
