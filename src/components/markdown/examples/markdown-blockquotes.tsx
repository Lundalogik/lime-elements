import { Component, h } from '@stencil/core';

const markdown = `
> Blockquotes are very handy in email to emulate reply text.
> This line is part of the same quote.

Quote break.

> This is a very long line that will still be quoted properly when it wraps. Oh boy let's keep writing to make sure this is long enough to actually wrap for everyone. Oh, you can *put* **Markdown** into a blockquote.
`;

/**
 * Blockquotes
 */
@Component({
    tag: 'limel-example-markdown-blockquotes',
    shadow: true,
})
export class MarkdownBlockquotesExample {
    public render() {
        return <limel-markdown value={markdown} />;
    }
}
