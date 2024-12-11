import { Component, h, State } from '@stencil/core';

/**
 * Basic example
 * This example shows a simple trigger element that opens a popover when clicked.
 *
 * :::note
 * Due accessibility concerns, the trigger element should be something that can be
 * interacted with, using both mouse click and the <kbd>  spacebar  </kbd>
 * or the <kbd>↩ return</kbd> key on the keyboard.
 *
 * This is why we are using a `limel-button` element as the trigger in this example,
 * which is both accessible with mouse and keyboard.
 * :::
 *
 * :::warning
 * The component is emitting a close event when you click outside its container
 * or press the <kbd>Esc</kbd> key. However, it’s up to you as consumer to react
 * properly on this event and hide the component (preferably by setting the
 * property `open` to `false`).
 * :::
 */

@Component({
    tag: 'limel-example-popover-basic',
    shadow: true,
})
export class PopoverBasicExample {
    @State()
    private isOpen = false;

    public render() {
        return [
            <limel-popover open={this.isOpen} onClose={this.onPopoverClose}>
                <limel-button
                    slot="trigger"
                    primary={true}
                    label="Click me!"
                    onClick={this.openPopover}
                />
                <p style={{ margin: '0.5rem 1rem' }} tabindex="0">
                    Content
                </p>
            </limel-popover>,
        ];
    }

    private openPopover = (event: MouseEvent) => {
        event.stopPropagation();
        console.log('opening');
        this.isOpen = true;
    };

    private onPopoverClose = (event: CustomEvent) => {
        event.stopPropagation();
        console.log('closing');
        this.isOpen = false;
    };
}
