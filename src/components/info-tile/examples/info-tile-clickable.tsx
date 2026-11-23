import { Component, h, Host, State } from '@stencil/core';

/**
 * Acting on a click without a link
 *
 * Not every tile leads to a URL. A click might open a dialog, start an
 * action, or mark something as done. Set `clickable` on such a tile and
 * listen for the `click` event on it.
 *
 * The tile gets the same interactive styling as one with a `link`. It can
 * also be reached with the keyboard, where it is announced as a button, and
 * pressing `Enter` or `Space` on it counts as a click. Try it: click the
 * tile, or focus it and press a key, to mark the messages as read.
 *
 * Prefer a `link` whenever there is somewhere to go. It lets the user open
 * the destination in a new tab, which a `clickable` tile cannot offer.
 */
@Component({
    tag: 'limel-example-info-tile-clickable',
    shadow: true,
    styleUrl: 'info-tile-clickable.scss',
})
export class InfoTileClickableExample {
    @State()
    private unread = '3';

    public render() {
        return (
            <Host>
                <limel-info-tile
                    icon="new_message"
                    label="Unread messages"
                    value={this.unread}
                    clickable={true}
                    onClick={this.markAsRead}
                />
                <limel-example-controls>
                    <limel-button label="Reset" onClick={this.reset} />
                </limel-example-controls>
            </Host>
        );
    }

    private readonly markAsRead = () => {
        this.unread = '0';
    };

    private readonly reset = () => {
        this.unread = '3';
    };
}
