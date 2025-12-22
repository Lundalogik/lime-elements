# limel-example-code-editor-readonly-with-line-numbers



<!-- Auto Generated Below -->


## Overview

Readonly, with line numbers and dark theme
Here you see a `readonly` instance of the Code Editor component. This means
you cannot edit the code. We also display line numbers here.
Additionally, this instance has a `dark` `colorScheme`, which means it does not
respect the operating system's settings for preferred appearance (dark or light).

## Dependencies

### Depends on

- [limel-code-editor](..)

### Graph
```mermaid
graph TD;
  limel-example-code-editor-readonly-with-line-numbers --> limel-code-editor
  limel-code-editor --> limel-helper-line
  limel-code-editor --> limel-chip
  limel-code-editor --> limel-notched-outline
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
  style limel-example-code-editor-readonly-with-line-numbers fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
