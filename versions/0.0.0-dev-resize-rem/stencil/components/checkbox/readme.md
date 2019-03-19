# limel-checkbox



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description                                                                                                                                                                                                                                                                                                                                                                                                           | Type      | Default     |
| ---------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ----------- |
| `checked`  | `checked`  | The boolean value of the checkbox to define if it's checked. Please note that the value of this property is *not* updated by the component itself when the user clicks the checkbox. Instead, the new value is available via the `change` event. If the new value is accepted (the normal case), the consumer must update this property accordingly. If the value is not updated, the change is, in effect, rejected. | `boolean` | `false`     |
| `disabled` | `disabled` | Disables the input field when `true`.                                                                                                                                                                                                                                                                                                                                                                                 | `boolean` | `false`     |
| `label`    | `label`    | The checkbox label.                                                                                                                                                                                                                                                                                                                                                                                                   | `string`  | `undefined` |


## Events

| Event    | Description                                                                                                        | Type                |
| -------- | ------------------------------------------------------------------------------------------------------------------ | ------------------- |
| `change` | Emitted when the input value is changed. The new value is available via the `detail` property on the event object. | `CustomEvent<void>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
