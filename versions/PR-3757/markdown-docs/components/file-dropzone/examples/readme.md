# limel-example-file-dropzone-type-filtering



<!-- Auto Generated Below -->


## Overview

File type filtering
The component allows you to specify the types of files that the dropzone will accept.
By default, it accepts all file types (`*`).

For media files, it is possible to specify any format, using:
`audio/*`, `video/*`, `image/*`.

Additionally, you can use unique file type specifiers, such as:
`.jpg`, or `.pdf`; or use a comma-separated list of file extensions or MIME types,
for instance: `image/png, image/jpeg` or `.png, .jpg, .jpeg`.

Read more about
[HTML attribute: accept](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/accept)

## Dependencies

### Depends on

- [limel-file-dropzone](..)
- [limel-input-field](../../input-field)
- [limel-chip](../../chip)
- [limel-example-value](../../../examples)

### Graph
```mermaid
graph TD;
  limel-example-file-dropzone-type-filtering --> limel-file-dropzone
  limel-example-file-dropzone-type-filtering --> limel-input-field
  limel-example-file-dropzone-type-filtering --> limel-chip
  limel-example-file-dropzone-type-filtering --> limel-example-value
  limel-file-dropzone --> limel-icon
  limel-input-field --> limel-helper-line
  limel-input-field --> limel-icon
  limel-input-field --> limel-portal
  limel-input-field --> limel-menu-surface
  limel-input-field --> limel-list
  limel-input-field --> limel-notched-outline
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
  style limel-example-file-dropzone-type-filtering fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
