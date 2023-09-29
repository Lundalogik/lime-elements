import { Component, h } from '@stencil/core';

const markdown = `
# H1
## H2
### H3
#### H4
##### H5
###### H6

Alternatively, H1 and H2 can be typed underline-ish style like this:

Alt-H1
===

Alt-H2
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
