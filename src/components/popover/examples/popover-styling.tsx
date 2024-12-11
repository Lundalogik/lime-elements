import { Component, h, State } from '@stencil/core';

/**
 * Styling
 * There are a few custom CSS properties that you can use to style the popover.
 */

@Component({
    tag: 'limel-example-popover-styling',
    shadow: true,
    styleUrl: 'popover-styling.scss',
})
export class PopoverStylingExample {
    @State()
    private isOpen = false;

    public render() {
        const image = {
            src: 'https://unsplash.it/800/800/?random',
            alt: 'Some random image',
        };

        return [
            <limel-popover open={this.isOpen} onClose={this.onPopoverClose}>
                <limel-button
                    slot="trigger"
                    label="Click me!"
                    onClick={this.openPopover}
                />
                <limel-card
                    style={{ 'max-width': '20rem' }}
                    orientation="landscape"
                    image={image}
                    heading="Heading"
                    subheading="Subheading"
                    value="This is the body of the card."
                />
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
