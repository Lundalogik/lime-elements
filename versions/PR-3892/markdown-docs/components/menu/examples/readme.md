
<!-- Auto Generated Below -->


## Overview

Size of the menu drop-down surface

Any element in the UI can be configured to open a menu.
By default, the dropdown that opens up after the menu trigger is clicked
inherits its width from the items that are inside the dropdown menu.

However, for some designs, you may want the width of the menu dropdown
to be exactly as wide as the width of its trigger element, or
as wide as `limel-menu` element itself. This is easily achieved using the
`surfaceWidth` prop. Read more on `SurfaceWidth`.

:::tip
In this example, `limel-menu` is highlighted with a dashed border,
to make it easier to see its width.
:::
:::note
The `--menu-surface-width` Overrides the width defined by `surfaceWidth`!
:::

## Dependencies

### Depends on

- [limel-menu](..)
- [limel-button](../../button)
- [limel-select](../../select)

### Graph
```mermaid
graph TD;
  limel-example-menu-surface-width --> limel-menu
  limel-example-menu-surface-width --> limel-button
  limel-example-menu-surface-width --> limel-select
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
  limel-select --> limel-notched-outline
  limel-select --> limel-icon
  limel-select --> limel-helper-line
  limel-select --> limel-portal
  limel-select --> limel-menu-surface
  limel-select --> limel-list
  style limel-example-menu-surface-width fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
