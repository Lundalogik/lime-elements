# limel-file



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description                                                               | Type       | Default     |
| ---------- | ---------- | ------------------------------------------------------------------------- | ---------- | ----------- |
| `disabled` | `disabled` | True if the input should be disabled                                      | `boolean`  | `false`     |
| `label`    | `label`    | The input label.                                                          | `string`   | `undefined` |
| `required` | `required` | Set to `true` to indicate that the field is required. Defaults to `false` | `boolean`  | `false`     |
| `value`    | --         | The selected file.                                                        | `FileInfo` | `undefined` |


## Events

| Event    | Description                                   | Type                    |
| -------- | --------------------------------------------- | ----------------------- |
| `change` | Dispatched when a file is selected/deselected | `CustomEvent<FileInfo>` |


## Dependencies

### Used by

 - [limel-example-file](../../examples/file)

### Depends on

- [limel-chip-set](../chip-set)

### Graph
```mermaid
graph TD;
  limel-file --> limel-chip-set
  limel-chip-set --> limel-icon
  limel-example-file --> limel-file
  style limel-file fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
