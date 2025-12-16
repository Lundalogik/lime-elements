# limel-example-header-slot-actions



<!-- Auto Generated Below -->


## Overview

Using the "actions" slot
The component offers a place for including custom actions, or
any other component that you want to include in the header.
To include any component in the `actions` area,
you can simply use the `slot="actions"` attribute.

:::note
In small containers when having the default layout, the `actions` area
wins the battle of limited space! It means, if you have a very wide
component in the actions area, it will never shrink in size, and instead
forces the headings to truncate.
:::

## Dependencies

### Depends on

- [limel-header](..)
- [limel-select](../../select)

### Graph
```mermaid
graph TD;
  limel-example-header-slot-actions --> limel-header
  limel-example-header-slot-actions --> limel-select
  limel-header --> limel-icon
  limel-select --> limel-notched-outline
  limel-select --> limel-icon
  limel-select --> limel-helper-line
  limel-select --> limel-portal
  limel-select --> limel-menu-surface
  limel-select --> limel-list
  style limel-example-header-slot-actions fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
