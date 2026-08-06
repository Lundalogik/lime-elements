import { Component, h, State } from '@stencil/core';
import { DEFAULT_HIGHLIGHT_COLOR } from '../../prosemirror-adapter/plugins/highlight/highlight-mark';

/**
 * The highlight color menu lets the user pick a color. Picking a color
 * applies it immediately: the menu emits `colorChange` followed by `save`,
 * and the text editor applies the picked color as a highlight mark on the
 * current selection and closes the menu. Pressing Escape emits `cancel`,
 * which just closes the menu.
 *
 * This example shows the open, pick-to-apply and close flow, and previews
 * the applied color the way the editor renders a highlight.
 */
@Component({
    tag: 'limel-example-highlight-color-menu',
    shadow: true,
})
export class HighlightColorMenuExample {
    @State()
    private color: string = DEFAULT_HIGHLIGHT_COLOR;

    @State()
    private appliedColor: string = DEFAULT_HIGHLIGHT_COLOR;

    @State()
    private isOpen: boolean = false;

    public render() {
        return [
            <limel-button
                label="Pick highlight color"
                onClick={this.openMenu}
            />,
            <p>
                This is{' '}
                <span style={{ 'background-color': this.appliedColor }}>
                    highlighted text
                </span>{' '}
                using the applied color <code>{this.appliedColor}</code>.
            </p>,
            <limel-text-editor-highlight-color-menu
                color={this.color}
                isOpen={this.isOpen}
                onColorChange={this.handleColorChange}
                onCancel={this.handleCancel}
                onSave={this.handleSave}
            />,
        ];
    }

    private openMenu = () => {
        this.isOpen = true;
    };

    private handleColorChange = (event: CustomEvent<string>) => {
        this.color = event.detail;
    };

    private handleCancel = () => {
        this.isOpen = false;
    };

    private handleSave = () => {
        this.isOpen = false;
        this.appliedColor = this.color;
    };
}
