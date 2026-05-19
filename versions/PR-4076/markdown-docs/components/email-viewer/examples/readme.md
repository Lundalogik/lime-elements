
<!-- Auto Generated Below -->


## Overview

Email with remote image policy

Example showing an HTML email body where remote images are represented as
`data-remote-src`, which triggers the remote-images warning banner.

This mirrors the shape produced by `loadEmail`, where remote image URLs are
rewritten to `data-remote-src` and only restored when the user allows remote
images.

## Dependencies

### Depends on

- [limel-email-viewer](..)

### Graph
```mermaid
graph TD;
  limel-example-email-viewer-remote-image-policy --> limel-email-viewer
  limel-email-viewer --> limel-chip
  limel-email-viewer --> limel-collapsible-section
  limel-email-viewer --> limel-markdown
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
  limel-collapsible-section --> limel-icon
  limel-collapsible-section --> limel-icon-button
  limel-icon-button --> limel-icon
  limel-icon-button --> limel-tooltip
  style limel-example-email-viewer-remote-image-policy fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
