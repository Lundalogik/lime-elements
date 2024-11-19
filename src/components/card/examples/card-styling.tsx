import { Component, h } from '@stencil/core';
/**
 * Styling
 * The component offers a few styling options in form of custom CSS variables,
 * to make it fit better in different contexts.
 */
@Component({
    shadow: true,
    tag: 'limel-example-card-styling',
    styleUrl: 'card-styling.scss',
})
export class CardStylingExample {
    public render() {
        const image = {
            src: 'https://images.unsplash.com/photo-1484755560615-a4c64e778a6c?q=80&w=2778&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            alt: 'A picture of a girl, listening to music with headphones',
            loading: 'lazy' as 'lazy',
        };

        return (
            <limel-card
                orientation="landscape"
                image={image}
                heading="Your Daily Mix"
                subheading="7 / 16"
                value="Playing: **Walk the Lime**"
            >
                <limel-example-card-nested-component
                    slot="component"
                    class="on-pink-background"
                />
            </limel-card>
        );
    }
}
