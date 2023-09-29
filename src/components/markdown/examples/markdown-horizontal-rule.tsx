import { Component, h } from '@stencil/core';

const markdown = `
Three or more of…

---

Hyphens,

***

Asterisks,

___

Or Underscores
`;

/**
 * Horizontal Rule
 */
@Component({
    tag: 'limel-example-markdown-horizontal-rule',
    shadow: true,
})
export class MarkdownHorizontalRuleExample {
    public render() {
        return <limel-markdown value={markdown} />;
    }
}
