# limel-date-picker



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description                                                                                                            | Type                                                                         | Default      |
| ---------- | ---------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------ |
| `disabled` | `disabled` | Disables the date picker when `true`. Defaults to `false`.                                                             | `boolean`                                                                    | `undefined`  |
| `format`   | `format`   | Format to display the selected date in                                                                                 | `string`                                                                     | `undefined`  |
| `invalid`  | `invalid`  | Set to `true` to indicate that the current value of the date picker is invalid. Defaults to `false`.                   | `boolean`                                                                    | `undefined`  |
| `label`    | `label`    | Text to display next to the date picker                                                                                | `string`                                                                     | `undefined`  |
| `language` | `language` | Defines the localisation for translations and date formatting. Property `format` customizes the localized date format. | `"da" \| "en" \| "fi" \| "no" \| "sv"`                                       | `'en'`       |
| `required` | `required` | Set to `true` to indicate that the field is required. Defaults to `false`.                                             | `boolean`                                                                    | `undefined`  |
| `type`     | `type`     | Type of date picker. Defaults to `datetime`                                                                            | `"date" \| "datetime" \| "month" \| "quarter" \| "time" \| "week" \| "year"` | `'datetime'` |
| `value`    | --         | The value of the field.                                                                                                | `Date`                                                                       | `undefined`  |


## Events

| Event    | Description                                    | Detail |
| -------- | ---------------------------------------------- | ------ |
| `change` | Emitted when the date picker value is changed. | void   |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
