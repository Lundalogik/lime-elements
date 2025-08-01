import { Component, h } from '@stencil/core';

/**
 * Basic list item
 *
 * This example demonstrates the basic usage of the `limel-list-item` component
 * with text and secondary text.
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
                <limel-list-item value={1} text="Basic List Item" />
                <limel-list-item
                    value={2}
                    text="This is the `text`"
                    secondaryText="This is the `secondaryText`"
                />
            </ul>
        );
    }
}
