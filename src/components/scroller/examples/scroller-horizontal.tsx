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
 * Horizontal scroller
 * Content that is wider than the scroller scrolls sideways. An edge that has
 * more to reveal fades out, and an arrow appears on it. Clicking the arrow
 * scrolls almost a page. Resize the container, to see how the scroller follows
 * its width.
 *
 * Try it with the keyboard too. Press the Tab key to move between the buttons,
 * and the scroller keeps the focused one in view, together with a glimpse of
 * the one next to it.
 *
 * :::note Why the arrows cannot be reached with the keyboard
 * The arrows are only a shortcut for people who use a mouse or a touch screen.
 * They are not real buttons. Screen readers do not announce them, the Tab key
 * skips them, and clicking one does not move the focus away from the item that
 * has it.
 *
 * This is on purpose, because people who use a keyboard or a screen reader do
 * not need the arrows. They move between the items, and the scroller keeps
 * whatever has focus in view. Screen readers also read the items that are
 * scrolled out of sight. If the arrows could be focused, every scroller would
 * get two extra stops that these people have no use for, and screen readers
 * would announce controls that only repeat what they can already do.
 *
 * It also means that the content of a scroller must contain something that can
 * receive focus, such as a button, a link or a tab. Without it, there is no way
 * to scroll with a keyboard.
 * :::
 */
@Component({
    tag: 'limel-example-scroller-horizontal',
    shadow: true,
    styleUrl: 'scroller-horizontal.scss',
})
export class ScrollerHorizontalExample {
    public render() {
        return (
            <Host>
                <limel-scroller>
                    {FILMS.map((film) => (
                        <limel-button key={film} label={film} />
                    ))}
                </limel-scroller>
            </Host>
        );
    }
}
