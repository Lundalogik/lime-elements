import { Component, h } from '@stencil/core';
/**
 * Height of the editor
 *
 * The text editor automatically adjusts its own height to fit the content inside.
 * So as the user types, the editor will grow taller, potentially resizing its own
 * container element.
 */
@Component({
    tag: 'limel-example-text-editor-height',
    shadow: true,
    styleUrl: 'text-editor-height.scss',
})
export class TextEditorHeightExample {
    public render() {
        return <limel-text-editor />;
    }
}
