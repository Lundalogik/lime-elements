
<!-- Auto Generated Below -->


## Overview

Picker with badges on picked chips

Set `badge` on a `PickerItem` to stamp the resulting chip with a
short status label or counter. The badge accepts a string
(e.g. `"Inactive"`, `"Beta"`) or a number (e.g. `12`).

Use it to surface metadata about the picked value at a glance
without forcing the consumer to read the chip text or open a
tooltip — for example, marking deactivated users in a group
picker, or flagging items that have unread notifications.

:::note
For long string labels you may need to override the
`--badge-max-width` CSS custom property on the host element of
the consuming component, since the default is tuned for short
numeric counters.
:::

## Dependencies

### Depends on

- [limel-picker](..)
- [limel-example-value](../../../examples)

### Graph
```mermaid
graph TD;
  limel-example-picker-with-badges --> limel-picker
  limel-example-picker-with-badges --> limel-example-value
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
  limel-tooltip-content --> limel-hotkey
  limel-input-field --> limel-helper-line
  limel-input-field --> limel-icon
  limel-input-field --> limel-portal
  limel-input-field --> limel-menu-surface
  limel-input-field --> limel-list
  limel-input-field --> limel-notched-outline
  style limel-example-picker-with-badges fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
