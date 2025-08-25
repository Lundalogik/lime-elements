import { Component, h } from '@stencil/core';

/**
 * Menu specific features
 *
 * The list items in `limel-menu` have a series of specific features.
 * They can display command text, badge, and a chevron, which are the
 * features of menu list items.
 *
 * To handle visualizing those features, `limel-list-item` can use an internal
 * and private sub-component as its `primaryComponent` when it is used
 * in the menu list.
 */
@Component({
    tag: 'limel-example-list-item-command-text',
    shadow: true,
    styleUrl: 'list-item-basic.scss',
})
export class ListItemCommandTextExample {
    public render() {
        const primaryMeta1 = {
            name: 'limel-menu-item-meta',
            props: { commandText: '⌘ + S' },
        };

        const primaryMeta2 = {
            name: 'limel-menu-item-meta',
            props: { badge: 3, showChevron: true },
        };

        const primaryMeta3 = {
            name: 'limel-menu-item-meta',
            props: {
                badge: 'a few words',
                showChevron: true,
                commandText: 'a very long command text',
            },
        };

        return (
            <ul class="is-resizable">
                <limel-list-item
                    text="Save"
                    icon="fast_download"
                    primaryComponent={primaryMeta1}
                />
                <limel-list-item
                    text="More options"
                    icon="verified_badge"
                    primaryComponent={primaryMeta2}
                />
                <limel-list-item
                    text="Long command"
                    icon="keyboard"
                    primaryComponent={primaryMeta3}
                />
            </ul>
        );
    }
}
