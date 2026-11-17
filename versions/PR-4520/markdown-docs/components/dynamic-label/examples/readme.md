
<!-- Auto Generated Below -->


## Overview

Basic example

Switching the value to `true` or `false` will dynamically change the label,
while the default label (including its icon) is ignored.

## Dependencies

### Depends on

- [limel-dynamic-label](..)
- [limel-example-controls](../../../examples)
- [limel-switch](../../switch)
- [limel-example-value](../../../examples)

### Graph
```mermaid
graph TD;
  limel-example-dynamic-label-basic --> limel-dynamic-label
  limel-example-dynamic-label-basic --> limel-example-controls
  limel-example-dynamic-label-basic --> limel-switch
  limel-example-dynamic-label-basic --> limel-example-value
  limel-dynamic-label --> limel-icon
  limel-switch --> limel-dynamic-label
  limel-switch --> limel-helper-line
  style limel-example-dynamic-label-basic fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
