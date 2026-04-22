
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
  limel-email-viewer --> limel-badge
  limel-email-viewer --> limel-collapsible-section
  limel-email-viewer --> limel-markdown
  limel-collapsible-section --> limel-icon
  limel-collapsible-section --> limel-icon-button
  limel-icon-button --> limel-icon
  limel-icon-button --> limel-tooltip
  limel-tooltip --> limel-portal
  limel-tooltip --> limel-tooltip-content
  style limel-example-email-viewer-remote-image-policy fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
