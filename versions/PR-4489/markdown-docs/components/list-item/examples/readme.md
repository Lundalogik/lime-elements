
<!-- Auto Generated Below -->


## Overview

Primary component in a list item

This example shows how to render a custom primary component inside
`limel-list-item` using the `primaryComponent` prop.

:::note
By default, the primary component is rendered after the icon,
and before the item's text.

Since the list item is a flex box, you can easily change the
order of the primary component by applying a different `order` as
a style. This could be done either via the primary component's own
styles, or via its `props` in the list.
:::

:::note
The primary component does not become automatically disabled,
once the list item is disabled. Clicks on, or interactions with the component
will still be registered on disabled items.
The consumer should handle the disabled state of their components accordingly.
:::

## Dependencies

### Depends on

- [limel-list-item](..)
- [limel-example-controls](../../../examples)
- [limel-switch](../../switch)

### Graph
```mermaid
graph TD;
  limel-example-list-item-primary-component --> limel-list-item
  limel-example-list-item-primary-component --> limel-example-controls
  limel-example-list-item-primary-component --> limel-switch
  limel-list-item --> limel-icon
  limel-list-item --> limel-menu
  limel-list-item --> limel-icon-button
  limel-list-item --> limel-radio-button
  limel-list-item --> limel-dynamic-label
  limel-list-item --> limel-helper-line
  limel-menu --> limel-spinner
  limel-menu --> limel-breadcrumbs
  limel-menu --> limel-input-field
  limel-menu --> limel-menu-list
  limel-menu --> limel-badge
  limel-menu --> limel-portal
  limel-menu --> limel-menu-surface
  limel-breadcrumbs --> limel-icon
  limel-breadcrumbs --> limel-tooltip
  limel-tooltip --> limel-portal
  limel-tooltip --> limel-tooltip-content
  limel-tooltip-content --> limel-hotkey
  limel-input-field --> limel-helper-line
  limel-input-field --> limel-icon
  limel-input-field --> limel-portal
  limel-input-field --> limel-menu-surface
  limel-input-field --> limel-list
  limel-input-field --> limel-notched-outline
  limel-icon-button --> limel-icon
  limel-icon-button --> limel-tooltip
  limel-dynamic-label --> limel-icon
  limel-switch --> limel-dynamic-label
  limel-switch --> limel-helper-line
  style limel-example-list-item-primary-component fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
