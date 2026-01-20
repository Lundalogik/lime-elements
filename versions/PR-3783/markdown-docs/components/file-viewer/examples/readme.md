# limel-example-file-viewer-with-picker



<!-- Auto Generated Below -->


## Overview

See an instant preview
Select a file from your local machine using the file picker below,
and `limel-file-viewer` component will display the file, if the format
is supported.

## Dependencies

### Depends on

- [limel-file](../../file)
- [limel-file-viewer](..)

### Graph
```mermaid
graph TD;
  limel-example-file-viewer-with-picker --> limel-file
  limel-example-file-viewer-with-picker --> limel-file-viewer
  limel-file --> limel-file-dropzone
  limel-file --> limel-chip-set
  limel-file --> limel-file-input
  limel-file-dropzone --> limel-icon
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
  limel-file-viewer --> limel-email-viewer
  limel-file-viewer --> limel-icon
  limel-file-viewer --> limel-tooltip
  limel-file-viewer --> limel-menu
  limel-file-viewer --> limel-spinner
  limel-email-viewer --> limel-badge
  style limel-example-file-viewer-with-picker fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
