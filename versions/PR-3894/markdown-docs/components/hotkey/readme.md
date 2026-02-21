
<!-- Auto Generated Below -->


## Overview

This component is used internally to visualize hotkeys in other components,
such as the menu. It will also emit an event when the hotkey is pressed,
so that the parent component can react to it.

## Properties

| Property   | Attribute  | Description                                                           | Type      | Default     |
| ---------- | ---------- | --------------------------------------------------------------------- | --------- | ----------- |
| `disabled` | `disabled` | When disabled, the hotkey is still rendered but will not emit events. | `boolean` | `false`     |
| `value`    | `value`    | The hotkey                                                            | `string`  | `undefined` |


## Events

| Event           | Description                                  | Type                                                                            |
| --------------- | -------------------------------------------- | ------------------------------------------------------------------------------- |
| `hotkeyTrigger` | Emits when the configured hotkey is pressed. | `CustomEvent<{ hotkey: string; value: string; keyboardEvent: KeyboardEvent; }>` |


## Dependencies

### Used by

 - [limel-example-hotkey-basic](examples)
 - [limel-example-hotkey-disabled](examples)
 - [limel-example-hotkey-duplicates](examples)
 - [limel-menu-item-meta](../list-item/menu-item-meta)

### Graph
```mermaid
graph TD;
  limel-example-hotkey-basic --> limel-hotkey
  limel-example-hotkey-disabled --> limel-hotkey
  limel-example-hotkey-duplicates --> limel-hotkey
  limel-menu-item-meta --> limel-hotkey
  style limel-hotkey fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
