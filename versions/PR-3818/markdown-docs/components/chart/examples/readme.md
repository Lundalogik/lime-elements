
<!-- Auto Generated Below -->


## Overview

Ring chart
A ring chart is similar to a doughnut chart but used in concentric layers,
ideal for comparison of hierarchical data.

It's good for:
- Comparing multiple parts of a whole in a layered visual layout.
- Displaying hierarchical data or showing nested relationships.

:::tip
**Use:**
- When you need to show multiple data series in a single, visually appealing chart.
- For data with a clear hierarchy or grouping.

**Avoid:**
- With too many rings, as it can become visually overwhelming.
- For data that needs precise comparison across series.
:::

## Dependencies

### Depends on

- [limel-chart](..)
- [limel-example-controls](../../../examples)
- [limel-input-field](../../input-field)

### Graph
```mermaid
graph TD;
  limel-example-chart-type-ring --> limel-chart
  limel-example-chart-type-ring --> limel-example-controls
  limel-example-chart-type-ring --> limel-input-field
  limel-chart --> limel-spinner
  limel-chart --> limel-badge
  limel-chart --> limel-tooltip
  limel-tooltip --> limel-portal
  limel-tooltip --> limel-tooltip-content
  limel-input-field --> limel-helper-line
  limel-input-field --> limel-icon
  limel-input-field --> limel-portal
  limel-input-field --> limel-menu-surface
  limel-input-field --> limel-list
  limel-input-field --> limel-notched-outline
  style limel-example-chart-type-ring fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
