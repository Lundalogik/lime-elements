# limel-dock-button



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute           | Description                                                                                             | Type       | Default     |
| ------------------- | ------------------- | ------------------------------------------------------------------------------------------------------- | ---------- | ----------- |
| `expanded`          | `expanded`          | When the dock is expanded or collapsed, dock items show labels and tooltips as suitable for the layout. | `boolean`  | `false`     |
| `item` _(required)_ | --                  | Item that is placed in the dock.                                                                        | `DockItem` | `undefined` |
| `useMobileLayout`   | `use-mobile-layout` | When dock is using mobile layout, dock items show labels and tooltips as suitable for the layout.       | `boolean`  | `false`     |


## Events

| Event          | Description                                             | Type                    |
| -------------- | ------------------------------------------------------- | ----------------------- |
| `close`        | Fired when the popover is closed.                       | `CustomEvent<void>`     |
| `itemSelected` | Fired when a dock item has been selected from the dock. | `CustomEvent<DockItem>` |
| `menuOpen`     | Fired when a dock menu is opened.                       | `CustomEvent<DockItem>` |


## Dependencies

### Used by

 - [limel-dock](..)

### Depends on

- [limel-badge](../../badge)
- [limel-popover](../../popover)
- [limel-icon](../../icon)
- [limel-tooltip](../../tooltip)

### Graph
```mermaid
graph TD;
  limel-dock-button --> limel-badge
  limel-dock-button --> limel-popover
  limel-dock-button --> limel-icon
  limel-dock-button --> limel-tooltip
  limel-popover --> limel-portal
  limel-popover --> limel-popover-surface
  limel-tooltip --> limel-portal
  limel-tooltip --> limel-tooltip-content
  limel-dock --> limel-dock-button
  style limel-dock-button fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
