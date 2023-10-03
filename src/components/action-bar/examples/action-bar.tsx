import { Component, h, State } from '@stencil/core';
import { ActionBarItem, ListSeparator } from '@limetech/lime-elements';

/**
 * Basic Example
 *
 * An action bar is typically placed on top of a page or section,
 * displaying multiple buttons in a row.
 * Separators can be added to visually group related actions.
 *
 * :::tip
 * By default, when `layout="fullWidth"`, all actions will be placed on
 * the left side of the action bar,
 * but you can override this default behavior by
 * adding `justify-content: flex-end;`.
 * :::
 *
 */
@Component({
    tag: 'limel-example-action-bar',
    shadow: true,
    styleUrl: 'action-bar.scss',
})
export class ActionBarBasicExample {
    @State()
    private actionBarItems: Array<ActionBarItem | ListSeparator> = [
        {
            text: 'Find',
            icon: 'search',
            iconOnly: true,
        },
        { separator: true },
        {
            text: 'Undo',
            icon: 'undo',
            iconOnly: true,
        },
        {
            text: 'Redo',
            icon: 'redo',
            iconOnly: true,
            disabled: true,
        },
        { separator: true },
        {
            text: 'Edit',
            icon: 'pencil_tip',
            iconOnly: true,
        },
        {
            text: 'Bookmark',
            icon: 'hearts',
            iconOnly: true,
        },
        {
            text: 'Share',
            icon: 'share_3',
            iconOnly: true,
        },
        { separator: true },
        {
            text: 'Discard',
            commandText: 'Cmd + esc',
            icon: 'cancel',
        },
        {
            text: 'Save',
            commandText: 'Cmd + S',
            icon: 'ok',
        },
    ];

    public render() {
        return (
            <div class="application">
                <limel-action-bar
                    accessibleLabel="Action bar"
                    actions={this.actionBarItems}
                    onItemSelected={this.handleSelected}
                    layout="fullWidth"
                />
            </div>
        );
    }

    private handleSelected = (event: CustomEvent<ActionBarItem>) => {
        event.stopPropagation();
        const setSelection = (item: ActionBarItem) => {
            return {
                ...item,
                selected: item.text === event.detail.text,
            };
        };

        console.log(event.detail);

        this.actionBarItems = this.actionBarItems.map(setSelection);
    };
}
