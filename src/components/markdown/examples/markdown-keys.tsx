import { Component, h } from '@stencil/core';

const markdown = `
To render physical keyboard keys within your text, you can use the \`<kbd>\` HTML element. This represents a span of inline text denoting textual user input from a keyboard, voice input, or any other text entry device.

For example: <kbd>⌘ cmd</kbd> + <kbd>⌥ alt</kbd> + <kbd>R</kbd>
`;

/**
 * Keys
 */
@Component({
    tag: 'limel-example-markdown-keys',
    shadow: true,
})
export class MarkdownFootnotesExample {
    public render() {
        return <limel-markdown value={markdown} />;
    }
}
