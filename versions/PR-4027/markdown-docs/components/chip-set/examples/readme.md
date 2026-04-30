
<!-- Auto Generated Below -->


## Overview

Per-chip invalid state

Set `invalid: true` on any chip in the `value` array to mark that
specific chip as invalid. This is independent of the chip-set-level
`invalid` prop, which is intended for signalling that the whole field
is invalid. Per-chip `invalid` lets the consumer flag individual
entries, for example an address that fails validation in a list of
recipients.

In this example, each entry is checked with a simple email regex when
added. Invalid entries are rendered with `invalid: true` and an error
icon.

## Dependencies

### Depends on

- [limel-chip-set](..)
- [limel-example-controls](../../../examples)
- [limel-select](../../select)
- [limel-example-value](../../../examples)

### Graph
```mermaid
graph TD;
  limel-example-chip-set-invalid-chips --> limel-chip-set
  limel-example-chip-set-invalid-chips --> limel-example-controls
  limel-example-chip-set-invalid-chips --> limel-select
  limel-example-chip-set-invalid-chips --> limel-example-value
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
  limel-select --> limel-notched-outline
  limel-select --> limel-icon
  limel-select --> limel-helper-line
  limel-select --> limel-portal
  limel-select --> limel-menu-surface
  limel-select --> limel-list
  style limel-example-chip-set-invalid-chips fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
