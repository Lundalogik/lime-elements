import { Component, h } from '@stencil/core';

const markdown = `
<dl>
  <dt>A Definition list</dt>
  <dd>is something people sometimes use.</dd>

  <dt>Markdown in HTML</dt>
  <dd>does *not* work **very** well.</dd>

  <dt>What to do?</dt>
  <dd>It's better to use HTML <em>tags</em>.</dd>
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
        return <limel-markdown value={markdown} />;
    }
}
