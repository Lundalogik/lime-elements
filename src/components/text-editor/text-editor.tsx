import { Component, h, Prop, Watch } from '@stencil/core';

/**
 * Some docs
 *
 * @private
 * @exampleComponent limel-example-text-editor
 */

@Component({
    tag: 'limel-text-editor',
    styleUrl: 'text-editor.scss',
    shadow: true,
})
export class TextEditor {
    /**
     * The input text.
     */
    @Prop()
    public value: string;

    public render() {
        return [
            // toast UI
        ];
    }
}
