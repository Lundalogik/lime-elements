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
