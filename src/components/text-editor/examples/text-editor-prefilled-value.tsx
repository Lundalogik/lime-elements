import { LimelTextEditorCustomEvent } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';
/**
 * With prefilled value
 */
@Component({
    tag: 'limel-example-text-editor-prefilled-value',
    shadow: true,
})
export class BasicTextEditorExample {
    @State()
    private text: { html: string } = { html: '' };

    //     @State()
    //     private value = `
    // 1. First ordered list item
    // 2. Another item
    //     * Unordered sub-list
    // 1. Actual numbers don't matter, just that it's a number
    //     1. Ordered sub-list
    // 4. And another item.

    //     You can have properly indented paragraphs within list items. Notice the blank line above, and the leading spaces (at least one, but we'll use three here to also align the raw Markdown).

    //     To have a line break without a paragraph, you will need to use two trailing spaces.
    //     Note that this line is separate, but within the same paragraph.
    //     (This is contrary to the typical GFM line break behaviour, where trailing spaces are not required.)

    // * Unordered list can use asterisks
    // - Or minuses
    // + Or pluses
    // `;

    public render() {
        return [
            <limel-text-editor
                onChange={this.handleChange}
                // value={this.value}
            />,
            <hr />,
            <h2>Preview using limel-markdown:</h2>,
            <limel-markdown value={this.text.html} />,
            <hr />,
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
