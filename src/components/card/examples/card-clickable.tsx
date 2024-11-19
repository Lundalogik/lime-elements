import { Component, h } from '@stencil/core';
/**
 * Clickable example
 * Sometimes you want to make the entire surface of the card to be clickable,
 * for example to navigate the user to another page or show more information.
 *
 * For such scenarios, make sure to set the `clickable` property to `true`.
 * This will alter the visual style to properly communicate hover effects and cursor styles to the card.
 *
 * :::important
 * It might not be a good idea to combine clickable cards with actions, as it can confuse the user.
 * :::
 */
@Component({
    shadow: true,
    tag: 'limel-example-card-clickable',
    styleUrl: 'card-basic.scss',
})
export class CardClickableExample {
    public render() {
        const image = {
            src: 'https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            alt: 'A picture of an old cassette tape',
            loading: 'lazy' as 'lazy',
        };

        return (
            <limel-card
                clickable={true}
                image={image}
                heading="Unleashing the Power of Lime Elements"
                subheading="Lime Design Podcast"
                value="Listen now…"
                onClick={this.handleClick}
            />
        );
    }

    private handleClick = () => {
        console.log('Card clicked');
    };
}
