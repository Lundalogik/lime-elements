
<!-- Auto Generated Below -->


## Overview

Scatter chart with negative values
Because a scatter chart has two value axes, either of them can carry negative
values — unlike single-axis charts, where only the value axis can. When the
data spans negative and positive on both axes, the chart draws a zero line on
each axis and places points in the correct quadrant relative to the origin.

Switching the `orientation` still transposes the whole plot, zero lines and
negative ranges included.

## Dependencies

### Depends on

- [limel-chart](..)
- [limel-example-controls](../../../examples)
- [limel-select](../../select)

### Graph
```mermaid
graph TD;
  limel-example-chart-type-scatter-negative --> limel-chart
  limel-example-chart-type-scatter-negative --> limel-example-controls
  limel-example-chart-type-scatter-negative --> limel-select
  limel-chart --> limel-spinner
  limel-chart --> limel-badge
  limel-chart --> limel-tooltip
  limel-tooltip --> limel-portal
  limel-tooltip --> limel-tooltip-content
  limel-tooltip-content --> limel-hotkey
  limel-select --> limel-notched-outline
  limel-select --> limel-icon
  limel-select --> limel-helper-line
  limel-select --> limel-portal
  limel-select --> limel-menu-surface
  limel-select --> limel-list
  style limel-example-chart-type-scatter-negative fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
