
<!-- Auto Generated Below -->


## Overview

Styling

Even though the component's main use case is displaying a profile picture—in
which a file input, an image viewer, and other controls are combined within
the same component—it can also be styled to fit different design requirements.

Custom CSS property `--profile-picture-border-radius` can be used to customize
the appearance of the component. Additionally, you can define a custom size or
aspect ratio to render the image as desired.

## Dependencies

### Depends on

- [limel-profile-picture](..)
- [limel-example-value](../../../examples)

### Graph
```mermaid
graph TD;
  limel-example-profile-picture-styling --> limel-profile-picture
  limel-example-profile-picture-styling --> limel-example-value
  limel-profile-picture --> limel-tooltip
  limel-profile-picture --> limel-file-dropzone
  limel-profile-picture --> limel-file-input
  limel-profile-picture --> limel-icon
  limel-profile-picture --> limel-spinner
  limel-profile-picture --> limel-popover
  limel-profile-picture --> limel-icon-button
  limel-profile-picture --> limel-callout
  limel-tooltip --> limel-portal
  limel-tooltip --> limel-tooltip-content
  limel-file-dropzone --> limel-icon
  limel-popover --> limel-portal
  limel-popover --> limel-popover-surface
  limel-icon-button --> limel-icon
  limel-icon-button --> limel-tooltip
  limel-callout --> limel-icon
  style limel-example-profile-picture-styling fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
