import { Component, h } from '@stencil/core';
/**
 * Using the `orientation` prop
 * The `orientation` prop can be used to change the layout of the card,
 * and is specially useful when the card is displaying images.
 *
 * By default, the card has a `portrait` orientation, which will render the
 * image on top of the content, filling the entire width of the card.
 * However, when it is changed to `landscape`, the image will be displayed
 * to the left of the content, filling the entire height of the card,
 * and maximum width of 40% of the card.
 */
@Component({
    shadow: true,
    tag: 'limel-example-card-orientation',
    styleUrl: 'card-basic.scss',
})
export class CardOrientationExample {
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
                subheading="16 TRACKS"
                value="Listen now…"
            />
        );
    }
}
