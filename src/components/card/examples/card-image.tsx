import { Component, h } from '@stencil/core';
/**
 * Featuring a hero image
 * The content of the cards should be organized to allow users to
 * easily scan and quickly find relevant and actionable information.
 * This is especially important because cards are often used in a grid layout,
 * in which many cards are usually present.
 *
 * Elements like text and images should clearly indicate information hierarchy.
 *
 * :::note
 * - The height and aspect ratio of the image affects the layout of the card.
 * - Remember to provide a meaningful alt text, to improve accessibility
 * :::
 */
@Component({
    shadow: true,
    tag: 'limel-example-card-image',
    styleUrl: 'card-basic.scss',
})
export class CardImageExample {
    public render() {
        const image = {
            src: 'https://unsplash.it/800/800/?random',
            alt: 'Remember to provide a meaningful alt text, to improve accessibility',
            loading: 'lazy' as 'lazy',
        };

        return (
            <limel-card
                image={image}
                heading="Heading"
                subheading="Subheading"
                value="This is the body of the card. It can contain a lot of text, or just a little. It can also contain markdown, like **bold** or *italic* text."
            />
        );
    }
}
