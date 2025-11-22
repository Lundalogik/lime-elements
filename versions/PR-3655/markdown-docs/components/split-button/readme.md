
<!-- Auto Generated Below -->


## Overview

A split button is a button with two components:
a button and a side-menu attached to it.

Clicking on the button runs a default action,
and clicking on the arrow opens up a list of other possible actions.

:::warning
- Never use a split button for navigation purposes, such as going to next page.
The button should only be used for performing commands!
- Never use this component instead of a Select or Menu component!
:::

## Properties

| Property        | Attribute        | Description                                                                                               | Type                                 | Default     |
| --------------- | ---------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------ | ----------- |
| `disabled`      | `disabled`       | Set to `true` to disable the button.                                                                      | `boolean`                            | `false`     |
| `icon`          | `icon`           | Set icon for the button                                                                                   | `string`                             | `undefined` |
| `items`         | `items`          | A list of items and separators to show in the menu.                                                       | `(ListSeparator \| MenuItem<any>)[]` | `[]`        |
| `label`         | `label`          | The text to show on the default action part of the button.                                                | `string`                             | `undefined` |
| `loading`       | `loading`        | Set to `true` to put the button in the `loading` state. This also disables the button.                    | `boolean`                            | `false`     |
| `loadingFailed` | `loading-failed` | Set to `true` to indicate failure instead of success when the button is no longer in the `loading` state. | `boolean`                            | `false`     |
| `primary`       | `primary`        | Set to `true` to make the button primary.                                                                 | `boolean`                            | `false`     |


## Events

| Event    | Description                              | Type                         |
| -------- | ---------------------------------------- | ---------------------------- |
| `select` | Is emitted when a menu item is selected. | `CustomEvent<MenuItem<any>>` |


## Dependencies

### Used by

 - [limel-example-button-disabled-vs-hidden](../../design-guidelines/disabled-hidden/examples)
 - [limel-example-split-button-basic](examples)
 - [limel-example-split-button-loading](examples)
 - [limel-example-split-button-repeat-default-command](examples)

### Depends on

- [limel-menu](../menu)
- [limel-button](../button)

### Graph
```mermaid
graph TD;
  limel-split-button --> limel-menu
  limel-split-button --> limel-button
  limel-menu --> limel-spinner
  limel-menu --> limel-breadcrumbs
  limel-menu --> limel-input-field
  limel-menu --> limel-menu-list
  limel-menu --> limel-badge
  limel-menu --> limel-portal
  limel-menu --> limel-menu-surface
  limel-breadcrumbs --> limel-icon
  limel-breadcrumbs --> limel-tooltip
  limel-tooltip --> limel-portal
  limel-tooltip --> limel-tooltip-content
  limel-input-field --> limel-helper-line
  limel-input-field --> limel-icon
  limel-input-field --> limel-portal
  limel-input-field --> limel-menu-surface
  limel-input-field --> limel-list
  limel-input-field --> limel-notched-outline
  limel-button --> limel-icon
  limel-button --> limel-spinner
  limel-example-button-disabled-vs-hidden --> limel-split-button
  limel-example-split-button-basic --> limel-split-button
  limel-example-split-button-loading --> limel-split-button
  limel-example-split-button-repeat-default-command --> limel-split-button
  style limel-split-button fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
