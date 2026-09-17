
<!-- Auto Generated Below -->


## Overview

File size badge
When the size of the selected file is known, `limel-file` displays it as a
badge on the chip, giving end-users a quick sense of how large the file is.

The size is picked up automatically when a user chooses a file from their
device. When a file is provided programmatically, for example when loaded
from a server, the badge is only shown if the `size` property (in bytes) is
set on the `FileInfo` object. Toggle the switch below to see the difference.

## Dependencies

### Depends on

- [limel-file](..)
- [limel-example-controls](../../../examples)
- [limel-switch](../../switch)
- [limel-example-value](../../../examples)

### Graph
```mermaid
graph TD;
  limel-example-file-size-badge --> limel-file
  limel-example-file-size-badge --> limel-example-controls
  limel-example-file-size-badge --> limel-switch
  limel-example-file-size-badge --> limel-example-value
  limel-file --> limel-file-dropzone
  limel-file --> limel-spinner
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
  limel-tooltip-content --> limel-hotkey
  limel-input-field --> limel-helper-line
  limel-input-field --> limel-icon
  limel-input-field --> limel-portal
  limel-input-field --> limel-menu-surface
  limel-input-field --> limel-list
  limel-input-field --> limel-notched-outline
  limel-switch --> limel-dynamic-label
  limel-switch --> limel-helper-line
  limel-dynamic-label --> limel-icon
  style limel-example-file-size-badge fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
