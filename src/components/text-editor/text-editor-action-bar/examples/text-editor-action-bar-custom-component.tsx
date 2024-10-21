import { Component, h, State } from '@stencil/core';
import { ActionBarItem, ListSeparator } from '@limetech/lime-elements';

/**
 * Using the toolbar actions
 *
 * When a user clicks a toolbar action, you can respond to the event
 * in various ways. For example, you can open a popover that contains
 * a custom component for supporting the user in the action they want to perform.
 */
@Component({
    tag: 'limel-example-text-editor-action-bar-custom-component',
    shadow: true,
    styleUrl: 'text-editor-action-bar-basic.scss',
})
export class TextEditorActionBarCustomComponentExample {
    @State()
    private selectedToolbarAction: ActionBarItem | null = null;

    private toolbarActions: Array<ActionBarItem | ListSeparator> = [
        {
            text: 'Add',
            icon: {
                name: 'add',
                color: 'rgb(var(--color-blue-default))',
            },
            iconOnly: true,
        },
    ];

    public render() {
        return [
            <div>
                <limel-text-editor-action-bar
                    toolbarActions={this.toolbarActions}
                    onToolbarItemSelect={this.handleToolbarItemSelect}
                />
            </div>,
            <limel-example-value value={this.selectedToolbarAction} />,
        ];
    }

    private handleToolbarItemSelect = (event: CustomEvent<ActionBarItem>) => {
        event.stopPropagation();
        this.selectedToolbarAction = event.detail;
    };
}
