import { Component, h } from '@stencil/core';

const markdown = `
Colons can be used to align columns.

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

There must be at least 3 dashes separating each header cell.
The outer pipes (|) are optional, and you don't need to make the
raw Markdown line up prettily. You can also use inline Markdown.

Markdown | Less | Pretty
--- | --- | ---
*Still* | renders | **nicely**
1 | 2 | 3
`;

/**
 * Tables
 */
@Component({
    tag: 'limel-example-markdown-tables',
    shadow: true,
})
export class MarkdownTablesExample {
    public render() {
        return <limel-markdown value={markdown} />;
    }
}
