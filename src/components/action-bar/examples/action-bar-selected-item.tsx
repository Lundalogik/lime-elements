import { Component, h, State } from '@stencil/core';
import { ActionBarItem, ListSeparator } from '@limetech/lime-elements';

/**
 * Selected item
 * For some use cases, one or more items in the action bar could
 * get a `selected` state. This is useful for example when you want to
 * highlight a currently active item in a list of items.
 */
@Component({
    tag: 'limel-example-action-bar-selected-item',
    shadow: true,
    styleUrl: 'action-bar-selected-item.scss',
})
export class ActionBarSelectedItemExample {
    @State()
    private actionBarItems: Array<ActionBarItem | ListSeparator> = [
        {
            text: 'Bold',
            commandText: '⌘ B',
            icon: '-lime-text-bold',
            iconOnly: true,
        },
        {
            text: 'Italic',
            commandText: '⌘ I',
            icon: '-lime-text-italic',
            iconOnly: true,
        },
        {
            text: 'Strikethrough',
            commandText: '⌘ ⇧ X',
            icon: '-lime-text-strikethrough',
            iconOnly: true,
        },
        { separator: true },
        {
            text: 'Bulleted list',
            icon: '-lime-text-bulleted-list',
            iconOnly: true,
        },
        {
            text: 'Ordered list',
            icon: '-lime-text-ordered-list',
            iconOnly: true,
        },
        {
            text: 'Blockquote',
            icon: '-lime-text-blockquote',
            iconOnly: true,
        },
    ];

    public render() {
        return (
            <div class="application is-resizable">
                <limel-action-bar
                    accessibleLabel="Toolbar"
                    actions={this.actionBarItems}
                    layout="fullWidth"
                    onItemSelected={this.handleSelected}
                />
            </div>
        );
    }

    private handleSelected = (event: CustomEvent<ActionBarItem>) => {
        event.stopPropagation();
        const toggleSelection = (item: ActionBarItem) => {
            if (item.text === event.detail.text) {
                return {
                    ...item,
                    selected: !item.selected,
                };
            }

            return item;
        };

        console.log(event.detail);

        this.actionBarItems = this.actionBarItems.map(toggleSelection);
    };
}
