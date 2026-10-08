
<!-- Auto Generated Below -->


## Overview

Vertical tab panel
Set `orientation` to `vertical` to place the tabs in a column, to the left
of the content. This suits a view with many sections, such as settings, in
a container that is wider than it is tall.

## Dependencies

### Depends on

- [limel-tab-panel](..)
- [limel-example-tab-panel-content](.)

### Graph
```mermaid
graph TD;
  limel-example-tab-panel-vertical --> limel-tab-panel
  limel-example-tab-panel-vertical --> limel-example-tab-panel-content
  limel-tab-panel --> limel-tab-bar
  limel-tab-bar --> limel-scroller
  limel-tab-bar --> limel-icon
  limel-tab-bar --> limel-badge
  limel-example-tab-panel-content --> limel-spinner
  limel-example-tab-panel-content --> limel-icon
  limel-example-tab-panel-content --> limel-button
  limel-button --> limel-icon
  limel-button --> limel-spinner
  style limel-example-tab-panel-vertical fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
