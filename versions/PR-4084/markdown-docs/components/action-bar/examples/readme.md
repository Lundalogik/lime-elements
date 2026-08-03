
<!-- Auto Generated Below -->


## Overview

Overflow menu
When the action bar items don't fit in the available space,
an overflow button is automatically added as the last item on the action bar.

The menu indicates the quantity of the actions which are currently invisible for the users.
Clicking on the overflow button opens a menu with the remaining actions that didn't fit
in the available space.

## Dependencies

### Depends on

- [limel-action-bar](..)

### Graph
```mermaid
graph TD;
  limel-example-action-bar-overflow-menu --> limel-action-bar
  limel-action-bar --> limel-action-bar-item
  limel-action-bar --> limel-action-bar-overflow-menu
  limel-action-bar-item --> limel-icon
  limel-action-bar-item --> limel-tooltip
  limel-tooltip --> limel-portal
  limel-tooltip --> limel-tooltip-content
  limel-tooltip-content --> limel-hotkey
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
  limel-input-field --> limel-helper-line
  limel-input-field --> limel-icon
  limel-input-field --> limel-portal
  limel-input-field --> limel-menu-surface
  limel-input-field --> limel-list
  limel-input-field --> limel-notched-outline
  style limel-example-action-bar-overflow-menu fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
