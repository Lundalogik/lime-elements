import { Component, State, h } from '@stencil/core';

/**
 * Removable chips
 * Chips can display a remove button,
 * when their `removable` prop is set to `true`.
 *
 * This is typically used when the chip is used in a chip-set,
 * where each chip visualizes a chosen option.
 *
 * :::tip
 * When the chip is focused using the keyboard, the user can press
 * the <kbd>Delete</kbd> or <kbd>Backspace</kbd> keys to
 * trigger the same remove `event`.
 * :::
 */
@Component({
    tag: 'limel-example-chip-removable',
    shadow: true,
})
export class ChipRemoveExample {
    @State()
    private removeButtonClicked: boolean = false;

    public render() {
        return [
            <limel-chip
                text="My filter"
                badge={123}
                removable={true}
                onRemove={this.handleRemove}
            />,
            <limel-example-value
                label="Remove"
                value={this.removeButtonClicked}
            />,
        ];
    }

    private handleRemove = () => {
        this.removeButtonClicked = true;
    };
}
