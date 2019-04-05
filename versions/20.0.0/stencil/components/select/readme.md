# limel-select



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description                                                                | Type                                 | Default     |
| ---------- | ---------- | -------------------------------------------------------------------------- | ------------------------------------ | ----------- |
| `disabled` | `disabled` | Disables the input field when `true`. Defaults to `false`.                 | `boolean`                            | `false`     |
| `label`    | `label`    | Text to display next to the select                                         | `string`                             | `undefined` |
| `multiple` | `multiple` | Set to `true` to allow multiple values to be selected. Defaults to `false` | `boolean`                            | `false`     |
| `options`  | --         | List of options                                                            | `Option<string>[]`                   | `[]`        |
| `required` | `required` | True if the control requires a value                                       | `boolean`                            | `false`     |
| `value`    | --         | Currently selected value or values (if `multiple` is set)                  | `Option<string> \| Option<string>[]` | `undefined` |


## Events

| Event    | Description                       | Type                              |
| -------- | --------------------------------- | --------------------------------- |
| `change` | Emitted when the value is changed | `CustomEvent<Option \| Option[]>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
