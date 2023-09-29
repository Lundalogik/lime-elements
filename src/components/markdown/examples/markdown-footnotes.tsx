import { Component, h } from '@stencil/core';

const markdown = `
Here is a simple footnote[^1].

A footnote can also have multiple lines[^2].

You can also use words, to fit your writing style more closely[^note].

[^1]: My reference.
[^2]: Every new line should be prefixed with 2 spaces.
  This allows you to have a footnote with multiple lines.
[^note]:
    Named footnotes will still render with numbers instead of the text but allow easier identification and linking.
    This footnote also has been made with a different syntax using 4 spaces for new lines.
`;

/**
 * Footnote
 */
@Component({
    tag: 'limel-example-markdown-footnotes',
    shadow: true,
})
export class MarkdownFootnotesExample {
    public render() {
        return <limel-markdown value={markdown} />;
    }
}
