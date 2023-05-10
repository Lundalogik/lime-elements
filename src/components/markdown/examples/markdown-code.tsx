import { Component, h } from '@stencil/core';

const markdown = `
~~~
const s = "JavaScript no syntax highlighting";
alert(s);
~~~

~~~javascript
const a = "JavaScript no syntax highlighting";
alert(a);
~~~

Even if the language is indicated, we can only render
the code blocks without syntax highlighting.
`;

/**
 * Code
 */
@Component({
    tag: 'limel-example-markdown-code',
    shadow: true,
})
export class MarkdownCodeExample {
    public render() {
        return <limel-markdown value={markdown} />;
    }
}
