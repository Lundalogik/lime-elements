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
  <dd style="color: red">Yes, since I'm red!</dd>

  <dt>Can you use background colors?</dt>
  <dd style="background-color: rgb(var(--color-green-default))">Yes, since I'm on a green background!</dd>

  <dt>Can you use more than one style at the same time?</dt>
  <dd style="color: rgb(var(--color-sky-lighter)); background-color: rgb(var(--color-coral-dark)); font-weight: bold;">Yes, since I'm a light sky blue on a dark coral background!</dd>

  <dt>Can you use background images?</dt>
  <dd style="background-image: url(https://lundalogik.github.io/lime-icons8/assets/icons/poison.svg)">No, you should not be able to, so if there's a skull and crossbones background here, something is wrong.</dd>

  <dt>Can you use <code>background</code> with a color value?</dt>
  <dd style="background: #4ca250">Yes. If the value is recognized as a color value, the value will be moved to <code>background-color</code></dd>

  <dt>Can you sneakily use <code>background</code> to insert an image?</dt>
  <dd style="background: #4ca250 url(https://lundalogik.github.io/lime-icons8/assets/icons/poison.svg)">No. If the value is not recognized as a color value, the background property will be stripped.</dd>
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
