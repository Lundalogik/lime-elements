
<!-- Auto Generated Below -->


## Overview

Split (side-by-side) view

Set `layout` to `split` for a side-by-side comparison.
The old version is shown on the left, the new version on the right.
Paired changes are aligned on the same row, making it easy
to see exactly what changed.

## Dependencies

### Depends on

- [limel-code-diff](..)

### Graph
```mermaid
graph TD;
  limel-example-code-diff-split --> limel-code-diff
  limel-code-diff --> limel-icon-button
  limel-code-diff --> limel-input-field
  limel-code-diff --> limel-action-bar
  limel-icon-button --> limel-icon
  limel-icon-button --> limel-tooltip
  limel-tooltip --> limel-portal
  limel-tooltip --> limel-tooltip-content
  limel-input-field --> limel-helper-line
  limel-input-field --> limel-icon
  limel-input-field --> limel-portal
  limel-input-field --> limel-menu-surface
  limel-input-field --> limel-list
  limel-input-field --> limel-notched-outline
  limel-action-bar --> limel-action-bar-item
  limel-action-bar --> limel-action-bar-overflow-menu
  limel-action-bar --> limel-icon
  limel-action-bar --> limel-tooltip
  limel-action-bar-item --> limel-icon
  limel-action-bar-item --> limel-tooltip
  limel-action-bar-overflow-menu --> limel-icon
  limel-action-bar-overflow-menu --> limel-menu
  limel-menu --> limel-spinner
  limel-menu --> limel-breadcrumbs
  limel-menu --> limel-input-field
  limel-menu --> limel-menu-list
  limel-menu --> limel-badge
  limel-menu --> limel-portal
  limel-menu --> limel-menu-surface
  limel-breadcrumbs --> limel-icon
  limel-breadcrumbs --> limel-tooltip
  style limel-example-code-diff-split fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
