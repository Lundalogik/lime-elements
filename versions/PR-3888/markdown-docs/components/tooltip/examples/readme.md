
<!-- Auto Generated Below -->


## Overview

Using `maxlength` property
To present an easy to read content, the tooltip's maximum text
length is set to 50 characters, including spaces.
When this threshold is reached, content will be rendered with line breaks.
However, it is possible to override this value by specifying `maxlength`.

:::note
Tooltips are intended to display very brief information.
Try not to place large amount of text in them.
:::

## Dependencies

### Depends on

- [limel-icon-button](../../icon-button)
- [limel-tooltip](..)

### Graph
```mermaid
graph TD;
  limel-example-tooltip-max-character --> limel-icon-button
  limel-example-tooltip-max-character --> limel-tooltip
  limel-icon-button --> limel-icon
  limel-icon-button --> limel-tooltip
  limel-tooltip --> limel-portal
  limel-tooltip --> limel-tooltip-content
  style limel-example-tooltip-max-character fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
