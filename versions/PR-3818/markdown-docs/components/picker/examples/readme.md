
<!-- Auto Generated Below -->


## Overview

Picker with `value` as an object, containing items with menus
While chips inside the picker can be clicked on, resulting in
an action, they can also have an ellipsis menu which will provide the end users with
additional actions.

When a menu item is selected from the ellipsis menu, the `onMenuItemSelected` event
will be emitted, reflecting the `value` of the selected item.

:::note
When a chip has `removable={true}` and when there are menu items, the "remove button" on the
chip will be automatically added as the last item in the ellipsis menu.

Clicking the remove button will emit the same `onRemove` event.
:::

## Dependencies

### Depends on

- [limel-picker](..)
- [limel-example-value](../../../examples)

### Graph
```mermaid
graph TD;
  limel-example-picker-value-as-object-with-actions --> limel-picker
  limel-example-picker-value-as-object-with-actions --> limel-example-value
  limel-picker --> limel-chip-set
  limel-picker --> limel-list
  limel-picker --> limel-spinner
  limel-picker --> limel-portal
  limel-picker --> limel-menu-surface
  limel-chip-set --> limel-helper-line
  limel-chip-set --> limel-notched-outline
  limel-chip-set --> limel-chip
  limel-chip-set --> limel-icon
  limel-chip --> limel-icon
  limel-chip --> limel-badge
  limel-chip --> limel-menu
  limel-chip --> limel-linear-progress
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
  style limel-example-picker-value-as-object-with-actions fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
