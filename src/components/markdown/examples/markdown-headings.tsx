import { Component, h } from '@stencil/core';

const markdown = `
# Headline 1
## Headline 2
### Headline 3
#### Headline 4
##### Headline 5
###### Headline 6

Alternatively, H1 and H2 can be typed underline-ish style like this:

Alternative H1
===

Alternative H2
---
`;

/**
 * Headings
 */
@Component({
    tag: 'limel-example-markdown-headings',
    shadow: true,
})
export class MarkdownHeadingsExample {
    public render() {
        return <limel-markdown value={markdown} />;
    }
}
