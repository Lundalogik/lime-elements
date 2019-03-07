# limel-chip-set



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description                                                                                                                                                                                                                                                                                                                                                                                                            | Type                              | Default     |
| ---------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | ----------- |
| `disabled` | `disabled` | True if the chip set should be disabled                                                                                                                                                                                                                                                                                                                                                                                | `boolean`                         | `false`     |
| `label`    | `label`    | Label to display for the input field when type is `input`                                                                                                                                                                                                                                                                                                                                                              | `string`                          | `undefined` |
| `required` | `required` | True if the control requires a value                                                                                                                                                                                                                                                                                                                                                                                   | `boolean`                         | `false`     |
| `type`     | `type`     | Type of chip set  - `choice` renders a set of selectable chips where only one is selectable. The `removable` property is ignored - `filter` renders a set of selectable chips where all are selectable. The `icon` property is ignored - `input` renders a set of chips that can be used in conjunction with an input field  If no type is set, a basic set of chips without additional functionality will be rendered | `"choice" \| "filter" \| "input"` | `undefined` |
| `value`    | --         | List of chips for the set                                                                                                                                                                                                                                                                                                                                                                                              | `Chip[]`                          | `[]`        |


## Events

| Event      | Description                                           | Type                |
| ---------- | ----------------------------------------------------- | ------------------- |
| `change`   | Dispatched when a chip is selected/deselected         | `CustomEvent<void>` |
| `input`    | Dispatched when the input is changed for type `input` | `CustomEvent<void>` |
| `interact` | Dispatched when a chip is interacted with             | `CustomEvent<void>` |


## Methods

### `getEditMode() => Promise<boolean>`

Used to find out whether the chip-set is in edit mode.

#### Returns

Type: `Promise<boolean>`

`true` if the chip-set is in edit mode, `false` otherwise.

### `setFocus() => void`

Used to set focus to the chip-set input field.

#### Returns

Type: `void`




## CSS Custom Properties

| Name                      | Description                                              |
| ------------------------- | -------------------------------------------------------- |
| `--background-color`      | Background color of the field when type is set to input. |
| `--icon-background-color` | Background color of the icon. Defaults to transparent.   |
| `--icon-color`            | Color of the icon. Defaults to 54% black.                |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
