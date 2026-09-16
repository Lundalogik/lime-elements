import { Component, h, State } from '@stencil/core';

const markdown = `Hi **there**! <limel-example-markdown-record-chip
    name="Pelle Persson"
    href="https://example.com/person/1234"
    ></limel-example-markdown-record-chip> seems to be your guy.
The deal is <limel-badge label="hot"></limel-badge>.`;

/**
 * Getting the content as markdown
 *
 * Custom elements in the markdown are rendered as components, but a
 * target that cannot render them — the clipboard, for one — needs plain
 * markdown. `toMarkdown()` returns the component's content with every
 * whitelisted element replaced by the markdown it stands for.
 *
 * An element takes part by implementing `MarkdownRepresentable`: one
 * method, `toMarkdown()`, returning the markdown for that instance. The
 * chip below returns a link with the record's name. An element that does
 * not implement it contributes its text when written with a closing tag,
 * and nothing otherwise — the badge here becomes nothing.
 *
 * :::note
 * Only whitelisted elements are asked, since they are the only custom
 * elements that render. Where each one was written comes from the
 * parser, so a tag inside a code span is text and is left as it is, and
 * an element written inside another one is covered by its parent.
 * :::
 */
@Component({
    tag: 'limel-example-markdown-to-markdown',
    shadow: true,
})
export class MarkdownToMarkdownExample {
    @State()
    private result = '';

    private viewer: HTMLLimelMarkdownElement;

    public render() {
        return (
            <div>
                <limel-markdown
                    ref={(element) => (this.viewer = element)}
                    value={markdown}
                    whitelist={[
                        {
                            tagName: 'limel-example-markdown-record-chip',
                            attributes: ['name', 'href'],
                        },
                    ]}
                />
                <limel-button
                    label="Get markdown"
                    primary={true}
                    onClick={this.getMarkdown}
                />
                <limel-markdown
                    value={this.result ? `\`\`\`\n${this.result}\n\`\`\`` : ''}
                />
            </div>
        );
    }

    private getMarkdown = async () => {
        this.result = await this.viewer.toMarkdown();
    };
}
