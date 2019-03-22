# limel-list



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute     | Description                                                    | Type                                 | Default     |
| ------------ | ------------- | -------------------------------------------------------------- | ------------------------------------ | ----------- |
| `badgeIcons` | `badge-icons` | True if the list should display larger icons with a background | `boolean`                            | `undefined` |
| `items`      | --            | List of items to display                                       | `(ListItem<any> \| ListSeparator)[]` | `undefined` |
| `selectable` | `selectable`  | True if the items in the list should be selectable/clickable   | `boolean`                            | `undefined` |


## Events

| Event    | Description                                                                                     | Type                    |
| -------- | ----------------------------------------------------------------------------------------------- | ----------------------- |
| `change` | Fired when a new value has been selected from the list. Only fired if selectable is set to true | `CustomEvent<ListItem>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
