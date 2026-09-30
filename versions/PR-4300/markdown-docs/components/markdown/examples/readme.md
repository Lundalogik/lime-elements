
<!-- Auto Generated Below -->


## Overview

Getting the content as markdown

Custom elements in the markdown are rendered as components, but a
target that cannot render them — the clipboard, for one — needs plain
markdown. `toMarkdown()` returns the component's content with every
whitelisted element replaced by the markdown it stands for.

An element takes part by implementing `MarkdownRepresentable`: one
method, `toMarkdown()`, returning the markdown for that instance. The
chip below returns a link with the record's name. An element that does
not implement it contributes its text when written with a closing tag,
and nothing otherwise — the badge here becomes nothing.

:::note
Only whitelisted elements are asked, since they are the only custom
elements that render. Elements are paired with their markup by tag
name and order, so when a tag is written more often than it rendered —
inside a code span, say — every occurrence of that tag is dropped
rather than paired wrongly.
:::

## Dependencies

### Depends on

- [limel-markdown](..)
- [limel-button](../../button)

### Graph
```mermaid
graph TD;
  limel-example-markdown-to-markdown --> limel-markdown
  limel-example-markdown-to-markdown --> limel-button
  limel-button --> limel-icon
  limel-button --> limel-spinner
  style limel-example-markdown-to-markdown fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
