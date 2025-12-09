# limel-example-button-group-mix



<!-- Auto Generated Below -->


## Overview

Mixed text and icon within the same group

Generally, you should avoid mixing text and images in button group. Although
individual buttons can contain text or images, mixing the two in a single
group can lead to an inconsistent and confusing interface.

However, in some case your design may benefit from having only one button in
a different format.

## Dependencies

### Depends on

- [limel-button-group](..)
- [limel-example-controls](../../../examples)
- [limel-switch](../../switch)

### Graph
```mermaid
graph TD;
  limel-example-button-group-mix --> limel-button-group
  limel-example-button-group-mix --> limel-example-controls
  limel-example-button-group-mix --> limel-switch
  limel-button-group --> limel-icon
  limel-button-group --> limel-tooltip
  limel-button-group --> limel-badge
  limel-tooltip --> limel-portal
  limel-tooltip --> limel-tooltip-content
  limel-switch --> limel-helper-line
  limel-switch --> limel-dynamic-label
  limel-dynamic-label --> limel-icon
  style limel-example-button-group-mix fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
