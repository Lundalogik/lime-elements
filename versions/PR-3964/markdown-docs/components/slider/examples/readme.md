
<!-- Auto Generated Below -->


## Overview

With multiplier and step

When step is configured and the initial value is not a multiple of the step
value, the slider will round the value to the nearest step when it is changed
for the first time. After a valid value has been set, only discrete valid
values will be possible to pick.

## Dependencies

### Depends on

- [limel-slider](..)
- [limel-example-value](../../../examples)

### Graph
```mermaid
graph TD;
  limel-example-slider-multiplier --> limel-slider
  limel-example-slider-multiplier --> limel-example-value
  limel-slider --> limel-helper-line
  limel-slider --> limel-notched-outline
  style limel-example-slider-multiplier fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
