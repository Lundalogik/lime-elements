# limel-picker



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description                                                                                                                                        | Type                     |
| ---------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| `disabled` | `disabled` | True if the picker should be disabled                                                                                                              | `boolean`                |
| `label`    | `label`    | Text to display for the input field of the picker                                                                                                  | `string`                 |
| `multiple` | `multiple` | True if multiple values are allowed                                                                                                                | `boolean`                |
| `required` | `required` | True if the control requires a value                                                                                                               | `boolean`                |
| `searcher` | --         | A search function that takes a search-string as an argument, and returns a promise that will eventually be resolved with an array of `ListItem`:s. | `Searcher`               |
| `value`    | --         | Currently selected value or values                                                                                                                 | `ListItem \| ListItem[]` |


## Events

| Event    | Detail | Description                                              |
| -------- | ------ | -------------------------------------------------------- |
| `change` |        | Fired when a new value has been selected from the picker |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
