# limel-text-field



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description                                                                                                                                                                                                                                                                                                                                                              | Type      |
| -------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- |
| `disabled`     | `disabled`      | Disables the text-field when `true`. Defaults to `false`.                                                                                                                                                                                                                                                                                                                | `boolean` |
| `invalid`      | `invalid`       | Set to `true` to indicate that the current value of the text-field is invalid. Defaults to `false`.                                                                                                                                                                                                                                                                      | `boolean` |
| `label`        | `label`         | The input label.                                                                                                                                                                                                                                                                                                                                                         | `string`  |
| `required`     | `required`      | Set to `true` to indicate that the field is required. Defaults to `false`.                                                                                                                                                                                                                                                                                               | `boolean` |
| `trailingIcon` | `trailing-icon` | This property just shows its value on the right side of the field at this moment. As soon as we have integrated a icon library it's supposed to match with an icon and display that                                                                                                                                                                                      | `string`  |
| `type`         | `type`          | This property determines the html-type of the field and with that which keyboard to show on a mobile device. Defaults to 'text'                                                                                                                                                                                                                                          | `string`  |
| `value`        | `value`         | The value of the field. Please note that the value of this property is *not* updated by the component itself when the user enters text. Instead, the new value is available via the `change` event. If the new value is accepted (the normal case), the consumer must update this property accordingly. If the value is not updated, the change is, in effect, rejected. | `string`  |


## Events

| Event    | Detail | Description                                                                                                        |
| -------- | ------ | ------------------------------------------------------------------------------------------------------------------ |
| `action` |        | This event is tied to the `trailingIcon` property, which doesn't work at the moment. Don't use it.                 |
| `change` |        | Emitted when the input value is changed. The new value is available via the `detail` property on the event object. |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
