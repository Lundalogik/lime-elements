# limel-dialog



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute    | Description                                                                                                                                                                                        | Type                                           |
| ---------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `closingActions` | --           | defines which action triggers a close-event; default: `{escapeKey: true, scrimClick: true,}`; if another click-event should close the dialog, add `data-mdc-dialog-action="close"` to that element | `{ escapeKey: boolean; scrimClick: boolean; }` |
| `fullscreen`     | `fullscreen` | `true` if the dialog should be full-screen, `false` otherwise.                                                                                                                                     | `boolean`                                      |
| `heading`        | `heading`    | The heading for the dialog, if any.                                                                                                                                                                | `string`                                       |
| `open`           | `open`       | `true` if the dialog is open, `false` otherwise. Defaults to `false`.                                                                                                                              | `boolean`                                      |


## Events

| Event   | Detail | Description                                                                                                                         |
| ------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| `close` |        | Emitted when the dialog is closed from inside the component. (*Not* emitted when the consumer sets the `open`-property to `false`.) |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
