import { Component, h } from '@stencil/core';

const markdown = `
Here's our logo (hover to see the title text):

Inline-style:
![alt text](https://lundalogik.github.io/lime-elements/versions/latest/favicon.svg "Logo Title Text 1")

Reference-style:
![alt text][logo]

[logo]: https://lundalogik.github.io/lime-elements/versions/latest/favicon.svg "Logo Title Text 2"
`;

/**
 * Images
 */
@Component({
    tag: 'limel-example-markdown-images',
    shadow: true,
})
export class MarkdownImageExample {
    public render() {
        return <limel-markdown value={markdown} />;
    }
}
