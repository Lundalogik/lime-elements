# limel-example-color-picker-manual-input



<!-- Auto Generated Below -->


## Overview

Disallowing manual input
By default, users can not only pick a color from the palette,
but also type in any valid color name or color value.

By setting the `manualInput` to `false` you can easily prevent users from
typing a custom color value into the input field.

Naturally, setting this prop to `false` does not completely disable the color picker.
It will only allow users to pick from the provided color palette.

## Dependencies

### Depends on

- [limel-color-picker](..)
- [limel-example-controls](../../../examples)
- [limel-checkbox](../../checkbox)

### Graph
```mermaid
graph TD;
  limel-example-color-picker-manual-input --> limel-color-picker
  limel-example-color-picker-manual-input --> limel-example-controls
  limel-example-color-picker-manual-input --> limel-checkbox
  limel-color-picker --> limel-tooltip
  limel-color-picker --> limel-popover
  limel-color-picker --> limel-color-picker-palette
  limel-color-picker --> limel-input-field
  limel-tooltip --> limel-portal
  limel-tooltip --> limel-tooltip-content
  limel-popover --> limel-portal
  limel-popover --> limel-popover-surface
  limel-color-picker-palette --> limel-input-field
  limel-input-field --> limel-helper-line
  limel-input-field --> limel-icon
  limel-input-field --> limel-portal
  limel-input-field --> limel-menu-surface
  limel-input-field --> limel-list
  limel-input-field --> limel-notched-outline
  limel-checkbox --> limel-dynamic-label
  limel-checkbox --> limel-helper-line
  limel-dynamic-label --> limel-icon
  style limel-example-color-picker-manual-input fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
