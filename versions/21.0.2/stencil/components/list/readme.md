# limel-list



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute     | Description                                                                                                                                                                                                                   | Type                                    | Default     |
| ------------ | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- | ----------- |
| `badgeIcons` | `badge-icons` | Set to `true` if the list should display larger icons with a background                                                                                                                                                       | `boolean`                               | `undefined` |
| `items`      | --            | List of items to display                                                                                                                                                                                                      | `(ListItem<any> \| ListSeparator)[]`    | `undefined` |
| `type`       | `type`        | The type of the list, omit to get a regular list. Available types are: `selectable`: regular list with single selection. `radio`: radio button list with single selection. `checkbox`: checkbox list with multiple selection. | `"checkbox" \| "radio" \| "selectable"` | `undefined` |


## Events

| Event    | Description                                                                                     | Type                                  |
| -------- | ----------------------------------------------------------------------------------------------- | ------------------------------------- |
| `change` | Fired when a new value has been selected from the list. Only fired if selectable is set to true | `CustomEvent<ListItem \| ListItem[]>` |


## CSS Custom Properties

| Name                      | Description                       |
| ------------------------- | --------------------------------- |
| `--icon-background-color` | Color to use for icon background. |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
