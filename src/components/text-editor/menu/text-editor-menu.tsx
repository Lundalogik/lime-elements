import { Component, Event, EventEmitter, Prop, h } from '@stencil/core';
import { TextEditorMenuButton, TextEditorMenuItems } from './types';
import { EditorView } from 'prosemirror-view';
import { Button } from 'src/interface';

/*
 * @private
 */
@Component({
    tag: 'limel-text-editor-menu',
    shadow: true,
    styleUrl: 'text-editor-menu.scss',
})
export class TextEditorMenu {
    @Prop()
    public menu: TextEditorMenuItems;

    @Prop()
    public disabled: boolean;

    @Prop()
    public editorView: EditorView;

    @Event()
    private change: EventEmitter<TextEditorMenuButton>;

    // TODO: Create custom component because limel-button-group
    // is based on radio buttons, which don't allow deselecting
    // the selected button. Highlighting and hiding are also not
    // easily achieved in this case.
    // Would prefer to use a custom component that uses buttons
    // Seen behaviour is now that the marking role is not removed when you move around the buttons

    public render() {
        if (!this.editorView) {
            return;
        }

        return (
            <limel-button-group
                disabled={this.disabled}
                onChange={this.handleChange}
                value={this.menu
                    .filter(this.canExecuteCommand)
                    .map(this.buttonFromMenuButton)}
            />
        );
    }

    private canExecuteCommand = (button: TextEditorMenuButton) => {
        return button.command(this.editorView.state, null, this.editorView);
    };

    private buttonFromMenuButton = (button: TextEditorMenuButton) => {
        return {
            id: button.id,
            title: button.title,
            icon: button.icon,
            badge: button.badge,
            selected: button.selected,
        };
    };

    handleChange = (event: CustomEvent<Button>) => {
        event.stopPropagation();
        event.preventDefault();

        const button: TextEditorMenuButton = this.menu.find(
            (item) => item.id === event.detail.id,
        );

        this.editorView.focus();
        button.command(
            this.editorView.state,
            this.editorView.dispatch,
            this.editorView,
        );

        this.change.emit(button);
    };
}
