
<!-- Auto Generated Below -->


## Overview

Progress on a chip

A chip in the set can show a determinate progress bar by setting `progress`
— a number between `0` and `100` — on the chip. This is useful for
reflecting an ongoing process on a specific chip, such as an upload.

For an indeterminate indicator, set `loading` on the chip instead.

## Dependencies

### Depends on

- [limel-chip-set](..)
- [limel-example-controls](../../../examples)
- [limel-slider](../../slider)

### Graph
```mermaid
graph TD;
  limel-example-chip-set-progress --> limel-chip-set
  limel-example-chip-set-progress --> limel-example-controls
  limel-example-chip-set-progress --> limel-slider
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
  limel-slider --> limel-helper-line
  limel-slider --> limel-notched-outline
  style limel-example-chip-set-progress fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
