
<!-- Auto Generated Below -->


## Overview

Tab bars with custom styles
In some situations and for the sake of UI design, you may want to have tabs
that equally share the available screen width and stretch. To get such a
result, you can add the `has-tabs-with-equal-width` class to the tab bar.

Unlike tabs that follow their content, tabs with equal width have no
largest width by default, so that they always fill the tab bar. If you set
`--tab-bar-horizontal-tab-max-width`, they stop growing at that width, and
in a wide tab bar, the space after the last tab stays empty.

## Dependencies

### Depends on

- [limel-tab-bar](..)
- [limel-example-value](../../../examples)

### Graph
```mermaid
graph TD;
  limel-example-tab-bar-with-equal-tab-width --> limel-tab-bar
  limel-example-tab-bar-with-equal-tab-width --> limel-example-value
  limel-tab-bar --> limel-scroller
  limel-tab-bar --> limel-icon
  limel-tab-bar --> limel-badge
  style limel-example-tab-bar-with-equal-tab-width fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
