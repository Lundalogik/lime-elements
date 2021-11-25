import { Component, h } from '@stencil/core';
/**
 * Using the component in `readonly` mode
 * It is possible to use the component to visualize a color of your choice.
 * In this case, users cannot pick any colors, but they can view what you have picked.
 */

@Component({
    tag: 'limel-example-color-picker-readonly',
    shadow: true,
})
export class ColorPickerReadonlyExample {
    public render() {
        return (
            <limel-color-picker
                label="Look at this beautiful color!"
                readonly={true}
                value="rgba(var(--color-red-default), 0.4)"
            />
        );
    }
}
