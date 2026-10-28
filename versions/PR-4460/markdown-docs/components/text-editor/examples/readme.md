
<!-- Auto Generated Below -->


## Overview

Text editor in markdown mode.

When using the text editor in markdown mode the `value` property is expected to contain
a markdown formatted string and the output will likewise be markdown. This is the default
if no value for `contentType` is provided.

## Dependencies

### Depends on

- [limel-text-editor](..)
- [limel-example-controls](../../../examples)
- [limel-switch](../../switch)
- [limel-example-value](../../../examples)

### Graph
```mermaid
graph TD;
  limel-example-text-editor-with-markdown --> limel-text-editor
  limel-example-text-editor-with-markdown --> limel-example-controls
  limel-example-text-editor-with-markdown --> limel-switch
  limel-example-text-editor-with-markdown --> limel-example-value
  limel-text-editor --> limel-helper-line
  limel-text-editor --> limel-notched-outline
  limel-text-editor --> limel-markdown
  limel-text-editor --> limel-prosemirror-adapter
  limel-prosemirror-adapter --> limel-action-bar
  limel-prosemirror-adapter --> limel-portal
  limel-prosemirror-adapter --> limel-text-editor-link-menu
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
  limel-text-editor-link-menu --> limel-input-field
  limel-text-editor-link-menu --> limel-button
  limel-button --> limel-icon
  limel-button --> limel-spinner
  limel-switch --> limel-dynamic-label
  limel-switch --> limel-helper-line
  limel-dynamic-label --> limel-icon
  style limel-example-text-editor-with-markdown fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
