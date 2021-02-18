import { Component, h, State } from '@stencil/core';

@Component({
    tag: 'limel-example-popover',
    shadow: true,
})
export class PopoverExample {
    @State()
    private isOpen = false;

    constructor() {
        this.openPopover = this.openPopover.bind(this);
        this.onPopoverClose = this.onPopoverClose.bind(this);
    }

    public render() {
        return [
            <limel-popover open={this.isOpen} onClose={this.onPopoverClose}>
                <limel-button
                    slot="trigger"
                    primary={true}
                    label="Click me!"
                    onClick={this.openPopover}
                />
                <p style={{ margin: '0.5rem 1rem' }}>Content</p>
            </limel-popover>,
        ];
    }

    private openPopover(event: MouseEvent) {
        event.stopPropagation();
        console.log('opening');
        this.isOpen = true;
    }

    private onPopoverClose(event: CustomEvent) {
        event.stopPropagation();
        console.log('closing');
        this.isOpen = false;
    }
}
