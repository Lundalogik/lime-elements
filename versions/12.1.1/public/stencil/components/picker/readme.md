# limel-picker



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description                                                                                                                                        | Type                                     | Default     |
| ---------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | ----------- |
| `disabled` | `disabled` | True if the picker should be disabled                                                                                                              | `boolean`                                | `false`     |
| `label`    | `label`    | Text to display for the input field of the picker                                                                                                  | `string`                                 | `undefined` |
| `multiple` | `multiple` | True if multiple values are allowed                                                                                                                | `boolean`                                | `false`     |
| `required` | `required` | True if the control requires a value                                                                                                               | `boolean`                                | `false`     |
| `searcher` | --         | A search function that takes a search-string as an argument, and returns a promise that will eventually be resolved with an array of `ListItem`:s. | `(query: string) => Promise<ListItem[]>` | `undefined` |
| `value`    | --         | Currently selected value or values                                                                                                                 | `ListItem \| ListItem[]`                 | `undefined` |


## Events

| Event    | Description                                              | Detail |
| -------- | -------------------------------------------------------- | ------ |
| `change` | Fired when a new value has been selected from the picker | void   |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
