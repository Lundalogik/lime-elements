import { LimelTextEditorCustomEvent } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';
// import { EditorPluginButton } from '../menu/types';
/**
 * Example with custom menu
 *
 * New items, such as "undo" and "redo", can be added to the
 * default menu using the menuItems prop
 *
 * @private
 *
 * TODO Add a reference to this component at a later time, or delete it
 */
@Component({
    tag: 'limel-example-text-editor-with-custom-menu',
    shadow: true,
})
export class TextEditorWithCustomMenuExample {
    @State()
    private text: { html: string } = { html: '' };

    public render() {
        // const menuItems: EditorPluginButton[] = ['undo', 'redo'];

        return [
            <limel-text-editor
                onChange={this.handleChange}
                // additionalMenuItems={menuItems}
            />,
            <limel-example-value value={this.text} />,
        ];
    }

    private handleChange = (
        event: LimelTextEditorCustomEvent<{ html: string }>,
    ): void => {
        event.stopPropagation();
        this.text = event.detail;
    };
}
