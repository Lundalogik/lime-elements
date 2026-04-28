
<!-- Auto Generated Below -->


## Overview

Using the `unit` prop

The `unit` prop lets you display a measurement unit alongside the
slider's min, max, and current value indicators. This gives users
immediate context about what the number represents, without needing
to read surrounding labels or descriptions.

For example, a slider controlling temperature becomes much clearer
when the value reads `22°C` instead of just `22`.

## Dependencies

### Depends on

- [limel-slider](..)
- [limel-example-value](../../../examples)

### Graph
```mermaid
graph TD;
  limel-example-slider-unit --> limel-slider
  limel-example-slider-unit --> limel-example-value
  limel-slider --> limel-helper-line
  limel-slider --> limel-notched-outline
  style limel-example-slider-unit fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
