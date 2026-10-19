
<!-- Auto Generated Below -->


## Overview

Keeping parts of the page visible

By default, the panel covers the full height of its positioned ancestor,
along the right edge. Use `--side-panel-top-inset`, `--side-panel-right-inset`
and `--side-panel-bottom-inset` to keep parts of that element visible.

In this example, the insets keep the header and the dock visible while the
panel is open.

## Dependencies

### Depends on

- [limel-button](../../button)
- [limel-side-panel](..)
- [limel-input-field](../../input-field)

### Graph
```mermaid
graph TD;
  limel-example-side-panel-insets --> limel-button
  limel-example-side-panel-insets --> limel-side-panel
  limel-example-side-panel-insets --> limel-input-field
  limel-button --> limel-icon
  limel-button --> limel-spinner
  limel-side-panel --> limel-icon
  limel-side-panel --> limel-tooltip
  limel-side-panel --> limel-header
  limel-side-panel --> limel-resize-handle
  limel-tooltip --> limel-portal
  limel-tooltip --> limel-tooltip-content
  limel-tooltip-content --> limel-hotkey
  limel-header --> limel-icon
  limel-input-field --> limel-helper-line
  limel-input-field --> limel-icon
  limel-input-field --> limel-portal
  limel-input-field --> limel-menu-surface
  limel-input-field --> limel-list
  limel-input-field --> limel-notched-outline
  style limel-example-side-panel-insets fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
