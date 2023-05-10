import { Component, h } from '@stencil/core';

const markdown = `
Emphasis, aka italics, with *asterisks* or _underscores_.

Strong emphasis, aka bold, with **asterisks** or __underscores__.

Combined emphasis with **asterisks and _underscores_**.

Strikethrough uses two tildes. ~~Scratch this.~~
`;

/**
 * Emphasis
 */
@Component({
    tag: 'limel-example-markdown-emphasis',
    shadow: true,
})
export class MarkdownEmphasisExample {
    public render() {
        return <limel-markdown value={markdown} />;
    }
}
