
<!-- Auto Generated Below -->


## Overview

Toggle State

This isn't really a feature of `limel-icon-button`, but since it is a common
use case, here is a simple way to make the icon button toggle between two
different "states", each with its own icon and label.

## Dependencies

### Depends on

- [limel-icon-button](..)

### Graph
```mermaid
graph TD;
  limel-example-icon-button-toggle-state --> limel-icon-button
  limel-icon-button --> limel-icon
  limel-icon-button --> limel-tooltip
  limel-tooltip --> limel-portal
  limel-tooltip --> limel-tooltip-content
  style limel-example-icon-button-toggle-state fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
