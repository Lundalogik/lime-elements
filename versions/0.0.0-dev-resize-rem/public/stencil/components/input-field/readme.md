# limel-input-field



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description                                                                                                                                                                                   | Type       | Default     |
| -------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------- |
| `completions`  | --              | list of suggestions `value` can autocomplete to.                                                                                                                                              | `string[]` | `[]`        |
| `disabled`     | `disabled`      | Disables the input field when `true`. Defaults to `false`.                                                                                                                                    | `boolean`  | `false`     |
| `formatNumber` | `format-number` | Set to `true` to format the current value of the input field only if the field is of type number. The number format is determined by the current language of the browser. Defaults to `true`. | `boolean`  | `true`      |
| `invalid`      | `invalid`       | Set to `true` to indicate that the current value of the input field is invalid. Defaults to `false`.                                                                                          | `boolean`  | `false`     |
| `label`        | `label`         | The input label.                                                                                                                                                                              | `string`   | `undefined` |
| `required`     | `required`      | Set to `true` to indicate that the field is required. Defaults to `false`.                                                                                                                    | `boolean`  | `false`     |
| `trailingIcon` | `trailing-icon` | Trailing icon to show to the far right in the field                                                                                                                                           | `string`   | `undefined` |
| `type`         | `type`          | This property determines the html-type of the field and with that which keyboard to show on a mobile device. Defaults to 'text'                                                               | `string`   | `'text'`    |
| `value`        | `value`         | The value of the field.                                                                                                                                                                       | `string`   | `undefined` |


## Events

| Event    | Description                                                            | Type                  |
| -------- | ---------------------------------------------------------------------- | --------------------- |
| `action` | Emitted when the `trailingIcon` is set and the icon is interacted with | `CustomEvent<void>`   |
| `change` | Emitted when the input value is changed.                               | `CustomEvent<string>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
