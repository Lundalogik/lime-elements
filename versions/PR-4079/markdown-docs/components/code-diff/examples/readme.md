
<!-- Auto Generated Below -->


## Overview

Line wrapping

Set `lineWrapping` to `true` to wrap long lines instead of scrolling
horizontally. This is useful for config files, prose, or any content
with long values.

Toggle the split view to see how wrapping behaves in each mode.

## Dependencies

### Depends on

- [limel-example-controls](../../../examples)
- [limel-switch](../../switch)
- [limel-select](../../select)
- [limel-code-diff](..)

### Graph
```mermaid
graph TD;
  limel-example-code-diff-line-wrap --> limel-example-controls
  limel-example-code-diff-line-wrap --> limel-switch
  limel-example-code-diff-line-wrap --> limel-select
  limel-example-code-diff-line-wrap --> limel-code-diff
  limel-switch --> limel-dynamic-label
  limel-switch --> limel-helper-line
  limel-dynamic-label --> limel-icon
  limel-select --> limel-notched-outline
  limel-select --> limel-icon
  limel-select --> limel-helper-line
  limel-select --> limel-portal
  limel-select --> limel-menu-surface
  limel-select --> limel-list
  limel-code-diff --> limel-icon-button
  limel-code-diff --> limel-input-field
  limel-code-diff --> limel-action-bar
  limel-icon-button --> limel-icon
  limel-icon-button --> limel-tooltip
  limel-tooltip --> limel-portal
  limel-tooltip --> limel-tooltip-content
  limel-tooltip-content --> limel-hotkey
  limel-input-field --> limel-helper-line
  limel-input-field --> limel-icon
  limel-input-field --> limel-portal
  limel-input-field --> limel-menu-surface
  limel-input-field --> limel-list
  limel-input-field --> limel-notched-outline
  limel-action-bar --> limel-action-bar-item
  limel-action-bar --> limel-action-bar-overflow-menu
  limel-action-bar-item --> limel-icon
  limel-action-bar-item --> limel-tooltip
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
  style limel-example-code-diff-line-wrap fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
