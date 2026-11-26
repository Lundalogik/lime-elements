
<!-- Auto Generated Below -->


## Overview

Resize in a general file picker

The same `resizeImage` options with the default `accept="*"` — the scenario
unique to a general-purpose picker. Resize degrades gracefully:

- selecting an image resizes and re-encodes it;
- selecting a PDF, archive, document, or SVG passes through untouched —
  only decodable raster images are resized;
- selecting a HEIC/HEIF off Safari emits the original unchanged, because the
  browser cannot decode it.

Inspect the emitted value below: its `filename`, `contentType` and `size`
change only when the file was actually resized.

:::note
HEIC/HEIF images (common from iPhones) cannot be decoded outside Safari, so
they are emitted unchanged. Detect this in your app — for example from the
emitted filename extension, as below — and convert or reject server-side if
needed.
:::

## Dependencies

### Depends on

- [limel-file](..)
- [limel-example-value](../../../examples)
- [limel-callout](../../callout)

### Graph
```mermaid
graph TD;
  limel-example-file-resize-mixed --> limel-file
  limel-example-file-resize-mixed --> limel-example-value
  limel-example-file-resize-mixed --> limel-callout
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
  limel-callout --> limel-icon
  style limel-example-file-resize-mixed fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
