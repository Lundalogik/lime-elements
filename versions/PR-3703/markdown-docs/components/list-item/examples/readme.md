# limel-example-list-item-radio



<!-- Auto Generated Below -->


## Overview

Radio button list items

This example shows how list items can be displayed as radio buttons.
Radio buttons allow users to select only one option from a group.

:::important
- Set `role="radiogroup"` on the container for accessibility.
- Only one value is selected at a time; clicks and Enter/Space update
  `selectedValue` and re-render.
:::

:::note
The radio visuals are purely presentational; state comes from the parent.
In production, prefer using `limel-list type="radio"` to centralize logic.
:::

## Dependencies

### Depends on

- [limel-list-item](..)
- [limel-example-value](../../../examples)
- [limel-example-controls](../../../examples)
- [limel-checkbox](../../checkbox)

### Graph
```mermaid
graph TD;
  limel-example-list-item-radio --> limel-list-item
  limel-example-list-item-radio --> limel-example-value
  limel-example-list-item-radio --> limel-example-controls
  limel-example-list-item-radio --> limel-checkbox
  limel-list-item --> limel-icon
  limel-list-item --> limel-menu
  limel-list-item --> limel-icon-button
  limel-list-item --> limel-dynamic-label
  limel-list-item --> limel-helper-line
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
  limel-icon-button --> limel-icon
  limel-icon-button --> limel-tooltip
  limel-dynamic-label --> limel-icon
  limel-checkbox --> limel-dynamic-label
  limel-checkbox --> limel-helper-line
  style limel-example-list-item-radio fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
