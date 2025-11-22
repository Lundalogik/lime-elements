
<!-- Auto Generated Below -->


## Overview

The Switch component is a fundamental element in UI design that serves as a toggle switch
to control the state of a specific setting or option in an application or website.
The two distinct positions of the Switch are visually indicative of the two states:
ON and OFF; making it easy for users to understand the current state of the controlled feature.

The Switch component is widely used in user interfaces to enable users to
quickly and intuitively change binary settings.

:::important
Checkboxes are sometimes used interchangeably with switches in user interfaces.
But there is an important difference between the two! Please read our guidelines about
[Switch vs. Checkbox](/#/DesignGuidelines/switch-vs-checkbox.md/).

## Properties

| Property         | Attribute         | Description                                                                                                                                                                                  | Type               | Default     |
| ---------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ----------- |
| `disabled`       | `disabled`        | Disables the switch when `true`, and visually shows that the switch is editable but disabled. This tells the users that if certain requirements are met, the switch may become interactable. | `boolean`          | `false`     |
| `helperText`     | `helper-text`     | Optional helper text to display below the switch                                                                                                                                             | `string`           | `undefined` |
| `invalid`        | `invalid`         | Set to `true` to indicate that the current value is invalid.                                                                                                                                 | `boolean`          | `undefined` |
| `label`          | `label`           | Label to display next to the switch                                                                                                                                                          | `string`           | `undefined` |
| `readonly`       | `readonly`        | Disables the switch when `true`. This visualizes the switch slightly differently. But shows no visual sign indicating that the switch is disabled or can ever become interactable.           | `boolean`          | `false`     |
| `readonlyLabels` | `readonly-labels` | The labels to use to clarify what kind of data is being visualized, when the component is `readonly`.                                                                                        | `Label<boolean>[]` | `[]`        |
| `value`          | `value`           | The value of the switch                                                                                                                                                                      | `boolean`          | `false`     |


## Events

| Event    | Description                        | Type                   |
| -------- | ---------------------------------- | ---------------------- |
| `change` | Emitted when the value has changed | `CustomEvent<boolean>` |


## Dependencies

### Used by

 - [limel-example-dialog-nested-close-events](../dialog/examples)
 - [limel-example-dynamic-label-readonly-boolean](../dynamic-label/examples)
 - [limel-example-form-span-fields](../form/examples)
 - [limel-example-icon-button-composite](../icon-button/examples)
 - [limel-example-list-item-actions](../list-item/examples)
 - [limel-example-list-item-interactive](../list-item/examples)
 - [limel-example-list-item-primary-component](../list-item/examples)
 - [limel-example-readonly-props](../../design-guidelines/boolean/examples)
 - [limel-example-snackbar-persistent-non-dismissible](../snackbar/examples)
 - [limel-example-switch](examples)
 - [limel-example-switch-helper-text](examples)
 - [limel-example-switch-readonly](examples)
 - [limel-example-switch-vs-checkbox](../../design-guidelines/boolean/examples)

### Depends on

- [limel-helper-line](../helper-line)
- [limel-dynamic-label](../dynamic-label)

### Graph
```mermaid
graph TD;
  limel-switch --> limel-helper-line
  limel-switch --> limel-dynamic-label
  limel-dynamic-label --> limel-icon
  limel-example-dialog-nested-close-events --> limel-switch
  limel-example-dynamic-label-readonly-boolean --> limel-switch
  limel-example-form-span-fields --> limel-switch
  limel-example-icon-button-composite --> limel-switch
  limel-example-list-item-actions --> limel-switch
  limel-example-list-item-interactive --> limel-switch
  limel-example-list-item-primary-component --> limel-switch
  limel-example-readonly-props --> limel-switch
  limel-example-snackbar-persistent-non-dismissible --> limel-switch
  limel-example-switch --> limel-switch
  limel-example-switch-helper-text --> limel-switch
  limel-example-switch-readonly --> limel-switch
  limel-example-switch-vs-checkbox --> limel-switch
  style limel-switch fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
