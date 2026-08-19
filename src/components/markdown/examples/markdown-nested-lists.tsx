import { Component, h } from '@stencil/core';

const markdown = `
1. Ordered top level
2. With a nested unordered list
    * unordered item
    * with a nested ordered list
        1. numbered sub-sub-item
        2. another numbered sub-sub-item
    * back to unordered
3. Ordered again
    1. ordered sub-item
        * unordered sub-sub-item
        * another unordered sub-sub-item

> Lists work inside blockquotes too
>
> * unordered item
>     1. numbered sub-item
>     2. another numbered sub-item
> * back to unordered
`;

/**
 * Nested lists
 *
 * Ordered and unordered lists can be nested inside each other, also
 * inside blockquotes.
 */
@Component({
    tag: 'limel-example-markdown-nested-lists',
    shadow: true,
})
export class MarkdownNestedListsExample {
    public render() {
        return <limel-markdown value={markdown} />;
    }
}
