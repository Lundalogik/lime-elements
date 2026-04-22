
<!-- Auto Generated Below -->


## Properties

| Property        | Attribute        | Description                                                                                                                                                                                                                                                                                                   | Type                                                                                                                                                                 | Default        |
| --------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `items`         | --               | List of the items that should be rendered in the overflow menu.                                                                                                                                                                                                                                               | `(ListSeparator \| MenuItem<any>)[]`                                                                                                                                 | `undefined`    |
| `openDirection` | `open-direction` | Defines the location that the content of the overflow menu appears, in relation to its trigger. It defaults to `bottom-end`, since in normal scenarios (for example when the action bar is not floating at the bottom of the screen) this menu is the right-most item in the user interface of the component. | `"bottom" \| "bottom-end" \| "bottom-start" \| "left" \| "left-end" \| "left-start" \| "right" \| "right-end" \| "right-start" \| "top" \| "top-end" \| "top-start"` | `'bottom-end'` |
| `overFlowIcon`  | --               | Icon to display in the overflow menu trigger. If not provided, the number of items in the overflow menu will be displayed.                                                                                                                                                                                    | `Icon`                                                                                                                                                               | `undefined`    |


## Events

| Event    | Description                                                          | Type                                                                     |
| -------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `select` | Fired when an item in the action bar overflow menu has been clicked. | `CustomEvent<ActionBarItemOnlyIcon<any> \| ActionBarItemWithLabel<any>>` |


## Dependencies

### Used by

 - [limel-action-bar](..)

### Depends on

- [limel-icon](../../icon)
- [limel-menu](../../menu)

### Graph
```mermaid
graph TD;
  limel-action-bar-overflow-menu --> limel-icon
  limel-action-bar-overflow-menu --> limel-menu
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
  limel-input-field --> limel-helper-line
  limel-input-field --> limel-icon
  limel-input-field --> limel-portal
  limel-input-field --> limel-menu-surface
  limel-input-field --> limel-list
  limel-input-field --> limel-notched-outline
  limel-action-bar --> limel-action-bar-overflow-menu
  style limel-action-bar-overflow-menu fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
