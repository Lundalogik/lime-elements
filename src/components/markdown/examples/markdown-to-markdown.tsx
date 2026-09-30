import { Component, h, State } from '@stencil/core';
import { CustomElementDefinition } from '@limetech/lime-elements';

const markdown = `Talk to <limel-example-markdown-person-chip name="Ada Lovelace" email="ada@example.com"></limel-example-markdown-person-chip> about **the engine**[^1].

The <limel-chip text="GitHub"></limel-chip> chip does not describe itself, so it is left out[^note].

[^1]: The Analytical Engine.
[^note]: Footnotes are exported as footnotes, too.`;

const whitelist: CustomElementDefinition[] = [
    {
        tagName: 'limel-example-markdown-person-chip',
        attributes: ['name', 'email'],
    },
];

/**
 * Exporting the content as markdown
 *
 * `toMarkdown` returns the content as markdown, for targets that cannot
 * render custom elements, such as the clipboard. Each whitelisted element
 * that implements `MarkdownDescribable` is replaced by the markdown it
 * returns from its own `toMarkdown` method.
 *
 * Here, the person chip describes itself as a `mailto:` link, and the
 * footnotes come back as footnotes.
 */
@Component({
    tag: 'limel-example-markdown-to-markdown',
    shadow: true,
})
export class MarkdownToMarkdownExample {
    @State()
    private exported: string;

    private markdownElement: HTMLLimelMarkdownElement;

    public render() {
        return [
            <limel-markdown
                value={markdown}
                whitelist={whitelist}
                ref={(el) => (this.markdownElement = el)}
            />,
            <limel-button label="Export as markdown" onClick={this.export} />,
            <limel-example-value label="Markdown" value={this.exported} />,
        ];
    }

    private export = async () => {
        this.exported = await this.markdownElement.toMarkdown();
    };
}
