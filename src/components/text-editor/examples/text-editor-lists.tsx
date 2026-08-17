import { Component, h, Host, State } from '@stencil/core';

const initialValue = `1. Ordered top level
2. With a nested unordered list
    * unordered item
    * with a nested ordered list
        1. numbered sub-sub-item
        2. another numbered sub-sub-item
    * back to unordered
3. Ordered again

> Lists work inside blockquotes too
>
> * unordered item
>     1. numbered sub-item
`;

/**
 * Lists
 *
 * Ordered and unordered lists can be toggled from the toolbar or with
 * `Mod-Shift-7` and `Mod-Shift-8`. Toggling an existing list converts
 * it in place, and `Tab` / `Shift+Tab` indent and outdent list items.
 * Lists can be nested, also inside blockquotes.
 */
@Component({
    tag: 'limel-example-text-editor-lists',
    shadow: true,
})
export class TextEditorListsExample {
    @State()
    private value: string = initialValue;

    public render() {
        return (
            <Host>
                <limel-text-editor
                    value={this.value}
                    onChange={this.handleChange}
                />
                <limel-example-value value={this.value} />
            </Host>
        );
    }

    private handleChange = (event: CustomEvent<string>) => {
        this.value = event.detail;
    };
}
