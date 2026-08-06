
<!-- Auto Generated Below -->


## Overview

The highlight color menu lets the user pick a color, and emits `save` or
`cancel` when done. The text editor listens to these events and applies
the picked color as a highlight mark on the current selection.

This example shows the open, pick, save and cancel flow, and previews the
saved color the way the editor renders a highlight.

## Dependencies

### Depends on

- [limel-button](../../../button)
- [limel-text-editor-highlight-color-menu](..)

### Graph
```mermaid
graph TD;
  limel-example-highlight-color-menu --> limel-button
  limel-example-highlight-color-menu --> limel-text-editor-highlight-color-menu
  limel-button --> limel-icon
  limel-button --> limel-spinner
  limel-text-editor-highlight-color-menu --> limel-color-picker
  limel-text-editor-highlight-color-menu --> limel-button
  limel-color-picker --> limel-tooltip
  limel-color-picker --> limel-popover
  limel-color-picker --> limel-color-picker-palette
  limel-color-picker --> limel-input-field
  limel-tooltip --> limel-portal
  limel-tooltip --> limel-tooltip-content
  limel-tooltip-content --> limel-hotkey
  limel-popover --> limel-portal
  limel-popover --> limel-popover-surface
  limel-color-picker-palette --> limel-input-field
  limel-input-field --> limel-helper-line
  limel-input-field --> limel-icon
  limel-input-field --> limel-portal
  limel-input-field --> limel-menu-surface
  limel-input-field --> limel-list
  limel-input-field --> limel-notched-outline
  style limel-example-highlight-color-menu fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
