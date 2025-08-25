import { Component, h } from '@stencil/core';

/**
 * Basic list item
 *
 * This example demonstrates the basic usage of the `limel-list-item`
 * component with text and secondary text.
 *
 * :::important
 * The list items are not focusable by default.
 * The consumer should handle the focusability of the list items
 * by dynamically setting and altering the `tabindex` attribute.
 *
 * Also, it's the consumer component that needs to implement the
 * `is-flat-clickable` and `visualize-keyboard-focus` mixins appropriately.
 * **Note** this is because of how these mixins are written by us,
 * and as a result they cannot be applied to the `:host` element
 * directly in the SCSS,
 * not because the component cannot take care of such interactive
 * styles by its own.
 *
 * The style implementation on the consumer side could include
 * setting the background color, isolating the parent's stacking context,
 * and handling border-radius for the first and last items.
 *
 * Check the example styles file for further info.
 * :::
 */
@Component({
    tag: 'limel-example-list-item-basic',
    shadow: true,
    styleUrl: 'list-item-basic.scss',
})
export class ListItemBasicExample {
    public render() {
        return (
            <ul>
                <limel-list-item
                    value={1}
                    tabindex="0"
                    text="Basic List Item"
                />
                <limel-list-item
                    value={2}
                    tabindex="0"
                    text="This is the `text`"
                    secondaryText="This is the `secondaryText`"
                />
            </ul>
        );
    }
}
