
<!-- Auto Generated Below -->


## Overview

Repeating the default command in the menu

The default command must be the most commonly used action.
Such actions typically have a very short label.

However, sometimes it could be useful to repeat the default command again
in the list of commands, using a more descriptive label which
clarifies the default action.

:::tip
- **Limit the overall number of choices** within the menu to less than 10
- **Order the items within the menu by popularity** and put the most popular ones on top.
:::

## Dependencies

### Depends on

- [limel-split-button](..)

### Graph
```mermaid
graph TD;
  limel-example-split-button-repeat-default-command --> limel-split-button
  limel-split-button --> limel-menu
  limel-split-button --> limel-button
  limel-menu --> limel-spinner
  limel-menu --> limel-breadcrumbs
  limel-menu --> limel-input-field
  limel-menu --> limel-menu-list
  limel-menu --> limel-badge
  limel-menu --> limel-portal
  limel-menu --> limel-menu-surface
  limel-breadcrumbs --> limel-icon
  limel-breadcrumbs --> limel-tooltip
  limel-tooltip --> limel-portal
  limel-tooltip --> limel-tooltip-content
  limel-input-field --> limel-helper-line
  limel-input-field --> limel-icon
  limel-input-field --> limel-portal
  limel-input-field --> limel-menu-surface
  limel-input-field --> limel-list
  limel-input-field --> limel-notched-outline
  limel-button --> limel-icon
  limel-button --> limel-spinner
  style limel-example-split-button-repeat-default-command fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
