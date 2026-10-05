import { Component, h, Host } from '@stencil/core';

const FILMS = [
    'Joker',
    'Parasite',
    'Harriet',
    'Bombshell',
    'Judy',
    'Friends',
    'Little Women',
    'Inception',
    'Ad Astra',
    'Marriage Story',
    '1917',
    'Knives Out',
    'Midsommar',
    'Hustlers',
    'Booksmart',
    'The Irishman',
];

/**
 * Vertical scroller
 * With `orientation` set to `vertical`, the content scrolls up and down, and
 * the arrows scroll almost a page of the available height at a time.
 * The scroller needs a height to scroll within. Resize the container, to see
 * how the scroller follows its height.
 *
 * Press the Tab key to move between the buttons, and the scroller keeps the
 * focused one in view. As in the horizontal scroller, the arrows are only for
 * the mouse and touch. The Tab key skips them, and screen readers do not
 * announce them. The horizontal example explains why.
 */
@Component({
    tag: 'limel-example-scroller-vertical',
    shadow: true,
    styleUrl: 'scroller-vertical.scss',
})
export class ScrollerVerticalExample {
    public render() {
        return (
            <Host>
                <limel-scroller orientation="vertical">
                    {FILMS.map((film) => (
                        <limel-button key={film} label={film} />
                    ))}
                </limel-scroller>
            </Host>
        );
    }
}
