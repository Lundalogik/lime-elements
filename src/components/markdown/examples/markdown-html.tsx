import { Component, h } from '@stencil/core';
import { allowedCssProperties } from '../allowed-css-properties';

const markdown = `
<dl>
  <dt>A Definition list</dt>
  <dd>is something people sometimes use.</dd>

  <dt>Markdown in HTML</dt>
  <dd>does *not* work **very** well.</dd>

  <dt>What to do?</dt>
  <dd>It's better to use HTML <em>tags</em>.</dd>

  <dt>Can you use text colors?</dt>
  <dd style="color: red">No. Inline <code>color</code> styles are stripped so the text always inherits the surrounding theme — this stays readable in both light and dark mode.</dd>

  <dt>Can you use background colors?</dt>
  <dd style="background-color: rgb(var(--color-green-default))">No. Inline <code>background-color</code> styles are stripped for the same reason.</dd>

  <dt>Can you make text bold or italic with inline styles?</dt>
  <dd style="font-weight: bold; font-style: italic;">Yes, since <code>font-weight</code> and <code>font-style</code> are allowed.</dd>

  <dt>Can you use background images?</dt>
  <dd style="background-image: url(https://lundalogik.github.io/lime-icons8/assets/icons/poison.svg)">No, you should not be able to, so if there's a skull and crossbones background here, something is wrong.</dd>

  <dt>Can you sneakily use <code>background</code> to insert an image?</dt>
  <dd style="background: #4ca250 url(https://lundalogik.github.io/lime-icons8/assets/icons/poison.svg)">No, the <code>background</code> shorthand is stripped entirely.</dd>
</dl>
`;

/**
 * HTML
 */
@Component({
    tag: 'limel-example-markdown-html',
    shadow: true,
})
export class MarkdownHtmlExample {
    public render() {
        return (
            <div>
                <limel-markdown value={markdown} />
                <br />
                Allowed CSS properties:
                <ul>
                    {allowedCssProperties.map((property) => {
                        return <li>{property}</li>;
                    })}
                </ul>
            </div>
        );
    }
}
