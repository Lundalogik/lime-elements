import { Component, h } from '@stencil/core';

const markdown = `
URLs and URLs in angle brackets will automatically get turned into links, like
http://www.example.com or <http://www.example.com>.

***

[I'm an inline-style link](https://www.google.com)

[I'm an inline-style link with title](https://www.google.com "Google's Homepage")

[I'm a reference-style link][Arbitrary case-insensitive reference text]

[I'm a relative reference to a repository file](../blob/master/LICENSE)

[You can use numbers for reference-style link definitions][1]

Or leave it empty and use the [link text itself].

Below, you find some text that the reference links can follow, but they will not be rendered in the body.

[arbitrary case-insensitive reference text]: https://www.mozilla.org
[1]: http://wikipedia.org
[link text itself]: http://www.wikipedia.org
`;

/**
 * Links
 * There are two ways to create links.
 */
@Component({
    tag: 'limel-example-markdown-links',
    shadow: true,
})
export class MarkdownLinksExample {
    public render() {
        return <limel-markdown value={markdown} />;
    }
}
