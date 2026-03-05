
<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description                            | Type  | Default     |
| -------- | --------- | -------------------------------------- | ----- | ----------- |
| `tab`    | --        | The tab that this component belongs to | `Tab` | `undefined` |


## Events

| Event       | Description                                                            | Type               |
| ----------- | ---------------------------------------------------------------------- | ------------------ |
| `changeTab` | Emitted when the vote button is clicked to update the badge in the tab | `CustomEvent<Tab>` |


## Dependencies

### Used by

 - [limel-example-tab-panel](.)

### Depends on

- [limel-spinner](../../spinner)
- [limel-icon](../../icon)
- [limel-button](../../button)

### Graph
```mermaid
graph TD;
  limel-example-tab-panel-content --> limel-spinner
  limel-example-tab-panel-content --> limel-icon
  limel-example-tab-panel-content --> limel-button
  limel-button --> limel-icon
  limel-button --> limel-spinner
  limel-example-tab-panel --> limel-example-tab-panel-content
  style limel-example-tab-panel-content fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
