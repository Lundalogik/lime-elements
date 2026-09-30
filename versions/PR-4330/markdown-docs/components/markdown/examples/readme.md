
<!-- Auto Generated Below -->


## Overview

Exporting the content as markdown

`toMarkdown` returns the content as markdown, for targets that cannot
render custom elements, such as the clipboard. Each whitelisted element
that implements `MarkdownDescribable` is replaced by the markdown it
returns from its own `toMarkdown` method.

Here, the person chip describes itself as a `mailto:` link.

## Dependencies

### Depends on

- [limel-markdown](..)
- [limel-button](../../button)
- [limel-example-value](../../../examples)

### Graph
```mermaid
graph TD;
  limel-example-markdown-to-markdown --> limel-markdown
  limel-example-markdown-to-markdown --> limel-button
  limel-example-markdown-to-markdown --> limel-example-value
  limel-button --> limel-icon
  limel-button --> limel-spinner
  style limel-example-markdown-to-markdown fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
