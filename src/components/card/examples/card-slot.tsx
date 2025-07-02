import { Component, h } from '@stencil/core';
/**
 * Nesting a component in the card
 * You can nest any component inside the card, to provide a more complex
 * and interactive experience to the user.
 */
@Component({
    shadow: true,
    tag: 'limel-example-card-slot',
    styleUrl: 'card-basic.scss',
})
export class CardSlotExample {
    public render() {
        const image = {
            src: 'https://images.unsplash.com/photo-1484755560615-a4c64e778a6c?q=80&w=2778&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            alt: 'A picture of a girl, listening to music with headphones',
            loading: 'lazy' as const,
        };

        return (
            <limel-card
                orientation="landscape"
                image={image}
                heading="Your Daily Mix"
                subheading="7 / 16"
                value="Playing: **Walk the Lime**"
            >
                <limel-example-card-nested-component slot="component" />
            </limel-card>
        );
    }
}
