import { Component, h, State } from '@stencil/core';
import { ActionBarItem, ListSeparator } from '@limetech/lime-elements';

/**
 * Basic example
 */
@Component({
    tag: 'limel-example-text-editor-action-bar-basic',
    shadow: true,
    styleUrl: 'text-editor-action-bar-basic.scss',
})
export class TextEditorActionBarExample {
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
        {
            text: 'Mention',
            icon: 'email_sign',
            iconOnly: true,
        },
        {
            text: 'Tag',
            icon: 'hashtag',
            iconOnly: true,
        },
        {
            text: 'Shortcut',
            icon: 'line',
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
            text: 'Add media',
            icon: 'picture',
            iconOnly: true,
        },
        {
            text: 'Emojis',
            icon: 'happy',
            iconOnly: true,
        },
        {
            text: 'Dictate',
            icon: 'microphone',
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
