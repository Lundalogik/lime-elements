
<!-- Auto Generated Below -->


## Overview

This component is used internally by `limel-tooltip`.

## Properties

| Property             | Attribute      | Description              | Type     | Default     |
| -------------------- | -------------- | ------------------------ | -------- | ----------- |
| `helperLabel`        | `helper-label` | Read more in tooltip.tsx | `string` | `undefined` |
| `hotkey`             | `hotkey`       | Read more in tooltip.tsx | `string` | `undefined` |
| `label` _(required)_ | `label`        | Read more in tooltip.tsx | `string` | `undefined` |
| `maxlength`          | `maxlength`    | Read more in tooltip.tsx | `number` | `undefined` |


## Dependencies

### Used by

 - [limel-tooltip](.)

### Depends on

- [limel-hotkey](../hotkey)

### Graph
```mermaid
graph TD;
  limel-tooltip-content --> limel-hotkey
  limel-tooltip --> limel-tooltip-content
  style limel-tooltip-content fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
