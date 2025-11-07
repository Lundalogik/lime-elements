import { Component, h, Host } from '@stencil/core';

const zeroWidthHexCodes = ['200B', '200C', '200D', 'FEFF'];
const zeroWidthSequence = zeroWidthHexCodes
    .map((hexCode) => String.fromCodePoint(Number.parseInt(hexCode, 16)))
    .join('');
const zeroWidthCharacter = zeroWidthSequence.charAt(0);

const markdownWithEmptyParagraphs = `
<p>In some use cases, empty paragraphs may be desired to keep certain spacing
in the content, while in other cases they may be unwanted and just add
unnecessary vertical space.</p>
<p></p>
<p><p></p></p>
<p>Having an empty paragraph like the above, or like the one below this paragraph</p>
<p>&nbsp;</p>
<p>can easily happen when the <code>value</code> is simply some HTML output
that comes for instance from an email.</p>
<p class="something"><br></p>
<p>Many email editors do not have standard typographic margins between paragraphs,
which force users to manually add empty spaces between their lines,
by pressing the <kbd>Enter</kbd> key multiple times, while typing an email.</p>
<p><span style="font-size:10.5pt; color:#333333">&nbsp;</span></p>
<p><span></span></p>
<p> </p>
<p>${zeroWidthSequence}</p>
<p><span>${zeroWidthCharacter}</span></p>
<p>Rendering all the empty paragraphs that you see in this example would just add lots
of vertical scrolling to large content.</p>
`;

/**
 * Removing empty paragraphs
 *
 * Sometimes, when a `value` in HTML format is imported from an external source, it
 * may contain undesired data. This could be for instance malicious scripts,
 * or styles that may be used to visually hide unwanted content from the reader.
 *
 * This component does its best to sanitize the input HTML, and clean it up
 * before rendering the content.
 *
 * However, one of the things that the component cannot fully decide by its own is
 * rendering empty paragraphs. Empty paragraphs are paragraphs that do not contain
 * any meaningful content (text, images, etc.), or only contain whitespace
 * (`<br />` or `&nbsp;`).
 *
 * By setting the `removeEmptyParagraphs` property to `false`, all empty paragraphs
 * will be preserved before rendering the content.
 */
@Component({
    tag: 'limel-example-markdown-remove-empty-paragraphs',
    shadow: true,
    styleUrl: 'markdown-remove-empty-paragraphs.scss',
})
export class MarkdownRemoveEmptyParagraphsExample {
    public render() {
        return (
            <Host>
                <section>
                    <limel-header
                        icon="multiline_text"
                        heading="Default rendering"
                        subheading="Empty paragraphs removed"
                    />
                    <limel-markdown value={markdownWithEmptyParagraphs} />
                </section>
                <section>
                    <limel-header
                        icon="space_after_paragraph"
                        heading="Empty paragraphs preserved"
                        subheading="`removeEmptyParagraphs={false}`"
                    />
                    <limel-markdown
                        value={markdownWithEmptyParagraphs}
                        removeEmptyParagraphs={false}
                    />
                </section>
            </Host>
        );
    }
}
