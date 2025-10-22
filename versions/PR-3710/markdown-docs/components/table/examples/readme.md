# limel-example-table-sorting-disabled



<!-- Auto Generated Below -->


## Overview

Disable column sorting

By default, all columns can be sorted by end-users, if they click on
a column header. An arrow icon on the header visualizes the
direction of sorting, when a column is sorted.

However, you can disable the sorting possibility in individual columns,
by setting the `headerSort` to `false`.

## Dependencies

### Depends on

- [limel-table](..)

### Graph
```mermaid
graph TD;
  limel-example-table-sorting-disabled --> limel-table
  limel-table --> limel-spinner
  limel-table --> limel-checkbox
  limel-checkbox --> limel-dynamic-label
  limel-checkbox --> limel-helper-line
  limel-dynamic-label --> limel-icon
  style limel-example-table-sorting-disabled fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
