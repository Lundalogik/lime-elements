# limel-example-collapsible-section-with-slider



<!-- Auto Generated Below -->


## Overview

With a limel-slider - for testing
:::note
Some elements need to be redrawn if they were created
while their container was hidden. The collapsible
section will emit a resize event after opening, to make this happen.
:::

## Dependencies

### Depends on

- [limel-collapsible-section](..)
- [limel-slider](../../slider)

### Graph
```mermaid
graph TD;
  limel-example-collapsible-section-with-slider --> limel-collapsible-section
  limel-example-collapsible-section-with-slider --> limel-slider
  limel-collapsible-section --> limel-icon
  limel-collapsible-section --> limel-icon-button
  limel-icon-button --> limel-icon
  limel-icon-button --> limel-tooltip
  limel-tooltip --> limel-portal
  limel-tooltip --> limel-tooltip-content
  limel-slider --> limel-helper-line
  limel-slider --> limel-notched-outline
  style limel-example-collapsible-section-with-slider fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
